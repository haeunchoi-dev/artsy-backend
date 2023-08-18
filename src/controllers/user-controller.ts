import { Request, Response } from 'express';

import { Injectable } from '@/decorators/di-decorator';
import { Route } from '@/decorators/route-decorator';
import checker from '@/libs/checker';

import UserService from '@/services/user-service';

@Injectable()
class UserController {
  constructor(private readonly service: UserService) {}

  @Route('post', '/user/sign-up-with-email')
  async signUpWithEmail(req: Request, res: Response) {
    const { displayName, email, password } = req.body;

    checker.checkEmailFormat(email);
    checker.checkRequiredStringParams(displayName, password);

    await this.service.signUpWithEmail(displayName, email, password);
  }

  @Route('post', '/user/check-duplicated-email')
  async checkDuplicatedEmail(req: Request, res: Response) {
    const { email } = req.body;

    checker.checkEmailFormat(email);

    return await this.service.checkDuplicatedEmail(email);
  }

  @Route('post', '/user/login-with-email')
  async loginWithEmail(req: Request, res: Response) {
    const { email, password } = req.body;

    checker.checkEmailFormat(email);
    checker.checkRequiredStringParams(password);

    const result = await this.service.loginWithEmail(email, password);

    res.cookie('loginToken', result.token, {
      expires: new Date(Date.now() + 3600000),
    });

    return {
      ...result.userInfo
    }
  }
}

export default UserController;
