import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { Injectable } from '../decorators/di-decorator';
import { ERROR_NAMES, BadRequestError } from '../error/errors';

import UserModel from '../models/user-model';

@Injectable()
class UserService {
  constructor(private readonly userModel: UserModel) {}

  async signUpWithEmail(displayName: string, email: string, password: string) {
    const users = await this.userModel.findByEmail(email);

    if (users.length > 0) {
      throw new BadRequestError(ERROR_NAMES.EMAIL_ALREADY_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userModel.create(displayName, email, hashedPassword);
  }

  async checkDuplicatedEmail(email: string) {
    const users = await this.userModel.findByEmail(email);

    return {
      isExists: users.length > 0 ? true : false
    }
  }

  async loginWithEmail(email: string, password: string) {
    const users = await this.userModel.findByEmail(email);

    if (users.length === 0) {
      // TODO
      throw new Error('에러를 던질지, null을 반환할지');
    }

    const user = users[0];
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (isCorrectPassword === false) {
      // TODO
      throw new Error('에러를 던질지, null을 반환할지');
    }

    // TODO Token and Cookie
    const secretKey = process.env.TOKEN_SECRET_KEY;
    if (secretKey === undefined) {
      // TODO 에러관리
      throw new Error('토큰 에러');
    }

    const token = jwt.sign({ userId: user.id }, secretKey);

    // TODO createdDate to timestamp
    return {
      token: token,
      userInfo: {
        displayName: user.displayName,
        email: user.email,
        createdDate: user.createdDate
      }
    };
  }
}

export default UserService;
