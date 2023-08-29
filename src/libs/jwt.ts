import jwt from 'jsonwebtoken';
import * as redis from 'redis';

import {
  ERROR_NAMES,
  UnauthorizedError,
} from '@/error/errors';

interface IAccessTokenPayload {
  userId: string;
}

initRedis();

async function initRedis() {
  const redisHost = process.env.REDIS_HOST;
  const redisPort = process.env.REDIS_PORT;
  const redisPassword = process.env.REDIS_PASSWORD;

  if (!redisHost || !redisPort || !redisPassword) {
    throw new Error('undefined redis info');
  }

  const redisClient = redis.createClient({
    password: redisPassword,
    socket: {
      host: redisHost,
      port: Number(redisPort),
    },
    legacyMode: true,
  });

  try {
    await redisClient.connect();
    const jwt = JWT.getInstance();
    jwt.addRedisCli(redisClient.v4);

  } catch (error) {
    console.error('Failed to connect to Redis', error);
    throw new Error(error);
  }
}

class JWT {
  private static instance: JWT | null = null;
  private redisCli: Record<string, any> | null;
  private secretKey: string;

  constructor() {
    const secretKey = process.env.TOKEN_SECRET_KEY;
    if (!secretKey) {
      throw new Error('undefined secretKey');
    }
    this.secretKey = secretKey;
  }

  public static getInstance(): JWT {
    if (!JWT.instance) {
      JWT.instance = new JWT();
    }
    return JWT.instance;
  }

  public addRedisCli(redisCli: Record<string, any>) {
    this.redisCli = redisCli;
  }

  public getSignedAccessToken(userId: String) {
    return jwt.sign({ userId }, this.secretKey, { expiresIn: '1h' });
  }

  public async getSignedRefreshToken(userId: String) {
    this._checkRedisCli();

    const refreshToken = jwt.sign({}, this.secretKey, { expiresIn: '14d' });

    const isExists = await this.redisCli!.exists(userId);
    if (isExists === 1) {
      await this.redisCli!.del(userId);
    }

    await this.redisCli!.set(userId, refreshToken);

    return refreshToken;
  }

  public async verifyAccessTokenAndRefreshToken(accessToken: string, refreshToken: string) {
    this._checkRedisCli();

    try {
      const isAccessTokenExpired = this._isTokenExpired(accessToken);
      const userId = this._decodeAccessToken(accessToken);
      if (!isAccessTokenExpired) {
        //console.log('access token이 정상 - 바로 userId 반환');
        return { userId };
      }

      //console.log('access token이 만료됨');
      // access token 만료. refresh token 검증 필요
      // 1. refresh token 만료 되었는지 체크
      const isRefreshTokenExpired = this._isTokenExpired(refreshToken);
      // 만료되었다면 401 에러 전달
      if (isRefreshTokenExpired) {
        //console.log('refresh token도 만료라서 에러');
        throw new UnauthorizedError(ERROR_NAMES.UNAUTHORIZED, 'token expired');
      }

      // 2. refresh token이 redis에 존재하고 value가 같다면 유효 토큰
      // 유효하지 않은 토큰이라면 401 에러 전달
      const refreshTokenInRedis = await this.redisCli!.get(userId);
      if (!(refreshTokenInRedis === refreshToken)) {
        //console.log('refresh token이 이상함 이건 에러');
        throw new UnauthorizedError(ERROR_NAMES.UNAUTHORIZED, 'invalid refresh token');
      }

      // 유효하다면 새로운 access token 발급과 userId 전달
      //console.log('새로운 access token 반환');
      const newAccessToken = this.getSignedAccessToken(userId);
      return {
        newAccessToken,
        userId
      }

    } catch (error) {
      throw error;
    }
  }

  private _isTokenExpired(token: string): boolean {
    try {
      jwt.verify(token, this.secretKey);
      return false;

    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return true;
      }

      throw error;
    }
  }

  private _decodeAccessToken(accessToken: string): string {
    const payload = jwt.decode(accessToken) as IAccessTokenPayload;
    return payload.userId;
  }

  private _checkRedisCli() {
    if (!this.redisCli) {
      throw new Error('redis cli is null');
    }
  }
}

export default JWT;