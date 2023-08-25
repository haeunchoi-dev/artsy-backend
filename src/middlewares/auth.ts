import { Request, Response, NextFunction } from 'express';
import {
  ERROR_NAMES,
  UnauthorizedError,
  InternalServerError,
} from '@/error/errors';
import jwt from '@/libs/jwt';
import { setAccessTokenCookie } from '@/libs/api';
import UserDto from '@/dto/user-dto';

export enum UserType {
  user = 'user',
  //admin = 'admin',
}

export default function auth(userType: UserType) {
  return (req: Request, res: Response, next: NextFunction) => {
    switch (userType) {
      case UserType.user: {
        authMember(req, res, next);
        break;
      }
      //case UserType.admin: {
      //  authAdmin(req, next);
      //  break;
      //}
      default: {
        throw new InternalServerError(
          ERROR_NAMES.INTERNAL_SERVER_ERROR,
          'auth error - undefined user type',
        );
      }
    }
  };
}

async function authMember(req: Request, res: Response, next: NextFunction) {
  const { accessToken, refreshToken } = req.cookies;

  try {
    if (!accessToken || !refreshToken) {
      throw new UnauthorizedError(
        ERROR_NAMES.UNAUTHORIZED,
        'authMember - invalid tokens',
      );
    }

    const { newAccessToken, userId } =
      await jwt.verifyAccessTokenAndRefreshToken(accessToken, refreshToken);

    if (newAccessToken !== undefined) {
      //console.log('새로운 access token이 존재하여 쿠키에 세팅');
      setAccessTokenCookie(res, newAccessToken);
    }

    req.params.userId = userId;
    req.user = new UserDto(userId);
    next();
  } catch (error) {
    next(error);
  }
}
