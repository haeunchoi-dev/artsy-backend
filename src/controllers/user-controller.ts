import { Request, Response } from 'express';
import auth, { UserType } from '@/middlewares/auth';
import { Injectable } from '@/decorators/di-decorator';
import { Route } from '@/decorators/route-decorator';
import checker from '@/libs/checker';

import UserService from '@/services/user-service';

@Injectable()
class UserController {
  constructor(private readonly service: UserService) {}

  @Route('post', '/user/sign-up')
  async signUp(req: Request, res: Response) {
    const { displayName, email, password } = req.body;

    // TODO dto
    checker.checkEmailFormat(email);
    checker.checkRequiredStringParams(displayName, password);

    await this.service.signUpWithEmail(displayName, email, password);
  }

  @Route('post', '/user/check-duplicated-email')
  async checkDuplicatedEmail(req: Request, res: Response) {
    const { email } = req.body;

    // TODO dto
    checker.checkEmailFormat(email);

    return await this.service.checkDuplicatedEmail(email);
  }

  @Route('post', '/user/login')
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    // TODO dto
    checker.checkEmailFormat(email);
    checker.checkRequiredStringParams(password);

    const result = await this.service.loginWithEmail(email, password);

    const secure = process.env.COOKIE_SECURE === 'true';
    const sameSite = (process.env.COOKIE_SAMESITE as 'none') || 'lax';
    const httpOnly = process.env.COOKIE_HTTPONLY === 'true';

    res.cookie('loginToken', result.token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly,
      secure,
      sameSite,
    });

    return {
      ...result.userInfo,
    };
  }

  @Route('post', '/user/logout', auth(UserType.user))
  async logout(req: Request, res: Response) {
    res.clearCookie('loginToken');
  }

  @Route('get', '/user/info', auth(UserType.user))
  async getUserInfo(req: Request, res: Response) {
    const userId = req.params.userId;
    return await this.service.getUserInfo(userId);
  }
}

export default UserController;
