import { Injectable } from '@/decorators/di-decorator';
import {
  ERROR_NAMES,
  BadRequestError,
  InternalServerError,
} from '@/error/errors';
import JWT from '@/libs/jwt';
import {
  hashPassword,
  comparePassword,
  generateTempPassword
} from '@/libs/password';
import mailSender from '@/libs/mailSender';

import { IResDBUser } from '@/types/user';
import UserModel from '@/models/user-model';
import UserTempPasswordModel from '@/models/user-temp-password-model';

@Injectable()
class UserService {
  private jwtSecretKey: string;

  constructor(
    private readonly userModel: UserModel,
    private readonly userTempPasswordModel: UserTempPasswordModel,
  ) {
    const secretKey = process.env.TOKEN_SECRET_KEY;
    if (!secretKey) {
      throw new InternalServerError(
        ERROR_NAMES.INTERNAL_SERVER_ERROR,
        'loginWithEmail - secretKey === undefined',
      );
    }
    this.jwtSecretKey = secretKey;
  }

  private async getAccessTokenAndRefreshToken(userId: string) {
    const accessToken = JWT.getInstance().getSignedAccessToken(userId);
    const refreshToken = await JWT.getInstance().getSignedRefreshToken(userId);
    return { accessToken, refreshToken };
  }

  async signUpWithEmail(displayName: string, email: string, password: string) {
    const users = await this.userModel.findByEmail(email);

    if (users.length > 0) {
      throw new BadRequestError(
        ERROR_NAMES.EMAIL_ALREADY_EXISTS,
        'signUpWithEmail - users.length > 0',
      );
    }

    const hashedPassword = await hashPassword(password);
    await this.userModel.create(displayName, email, hashedPassword);
  }

  async checkDuplicatedEmail(email: string) {
    const users = await this.userModel.findByEmail(email);

    return {
      isExists: users.length > 0 ? true : false,
    };
  }

  async loginWithEmail(email: string, password: string) {
    const users = await this.userModel.findByEmail(email);

    if (users.length === 0) {
      throw new BadRequestError(
        ERROR_NAMES.NOT_FOUND_EMAIL,
        'loginWithEmail - users.length === 0',
      );
    }

    const user = users[0];
    const isCorrectPassword = await comparePassword(password, user.password);
    if (!isCorrectPassword) {
      throw new BadRequestError(
        ERROR_NAMES.INCORRECT_PASSWORD,
        'loginWithEmail - incorrect password',
      );
    }

    const { accessToken, refreshToken } = await this.getAccessTokenAndRefreshToken(user.id);
    return {
      accessToken,
      refreshToken,
      userInfo: {
        displayName: user.displayName,
        email: user.email,
        createdDate: user.createdDate,
      }
    };
  }

  async getUserInfo(userId: string) {
    return await this.userModel.userInfoByUserId(userId);
  }

  async updateUserInfo(userId: string, displayName: string, password?: string) {
    let _password = password;
    if (_password) {
      _password = await hashPassword(_password);
    }
    await this.userModel.updateUserInfo(userId, displayName, _password);
  }

  async requestTempPassword(email: string) {
    const users = await this.userModel.findByEmail(email);

    if (users.length === 0) {
      throw new BadRequestError(
        ERROR_NAMES.NOT_FOUND_EMAIL,
        'findPassword - users.length === 0',
      );
    }

    const tempPassword = generateTempPassword();
    mailSender.sendTempPassword(email, tempPassword);

    const hashedPassword = await hashPassword(tempPassword);
    await this.userTempPasswordModel.create(email, hashedPassword);
  }

  async tempLogin(email: string, password: string) {
    const users = await this.userTempPasswordModel.findByEmailAndLimitDate(email, 10);

    if (users.length === 0) {
      throw new BadRequestError(
        ERROR_NAMES.DATA_NOT_FOUND,
        'tempLogin - users.length === 0',
      );
    }

    const promiseList = users.map(async (user: IResDBUser) => {
      const isCorrectPassword = await comparePassword(password, user.password);
      return isCorrectPassword;
    });

    const results = await Promise.all(promiseList);
    if (results.every(result => result === false)) {
      throw new BadRequestError(
        ERROR_NAMES.INCORRECT_PASSWORD,
        'tempLogin - incorrect password',
      );
    }

    await this.userTempPasswordModel.deleteByEmail(email)

    const realUser = (await this.userModel.findByEmail(email))[0];
    const { accessToken, refreshToken } = await this.getAccessTokenAndRefreshToken(realUser.id);
    return {
      accessToken,
      refreshToken,
      userInfo: {
        displayName: realUser.displayName,
        email: realUser.email,
        createdDate: realUser.createdDate,
      }
    };
  }
}

export default UserService;
