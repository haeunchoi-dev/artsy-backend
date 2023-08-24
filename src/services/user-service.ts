import jwt from 'jsonwebtoken';

import { Injectable } from '@/decorators/di-decorator';
import {
  ERROR_NAMES,
  BadRequestError,
  InternalServerError,
} from '@/error/errors';
import {
  hashPassword,
  comparePassword,
  generateTempPassword
} from '@/libs/password';
import mailSender from '@/libs/mailSender';

import UserModel from '@/models/user-model';

@Injectable()
class UserService {
  constructor(private readonly userModel: UserModel) {}

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

    const secretKey = process.env.TOKEN_SECRET_KEY;
    if (!secretKey) {
      throw new InternalServerError(
        ERROR_NAMES.INTERNAL_SERVER_ERROR,
        'loginWithEmail - secretKey === undefined',
      );
    }

    // TODO Access Token and Refresh Token
    const token = jwt.sign({ userId: user.id }, secretKey);

    // TODO createdDate to timestamp
    return {
      token: token,
      userInfo: {
        displayName: user.displayName,
        email: user.email,
        createdDate: user.createdDate,
      },
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

  async findPassword(email: string) {
    const users = await this.userModel.findByEmail(email);

    if (users.length === 0) {
      throw new BadRequestError(
        ERROR_NAMES.NOT_FOUND_EMAIL,
        'findPassword - users.length === 0',
      );
    }

    const tempPassword = generateTempPassword();
    mailSender.sendTempPassword(email, tempPassword);

    const user = users[0];
    const hashedPassword = await hashPassword(tempPassword);
    await this.userModel.updateUserPassword(user.id, hashedPassword);
  }
}

export default UserService;
