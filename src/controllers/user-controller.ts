import { Injectable } from '../decorators/di-decorator';
import { Route } from '../decorators/route-decorator';

import UserService from '../services/user-service';
import { Request, Response } from 'express';

@Injectable()
class UserController {
  constructor(private readonly service: UserService) {}

  @Route('post', '/user/sign-up-with-email')
  async signUpWithEmail(req: Request, res: Response) {
    const { displayName, email, password } = req.body;

    // TODO Checker

    await this.service.signUpWithEmail(displayName, email, password);
  }

  @Route('post', '/user/check-duplicated-email')
  async checkDuplicatedEmail(req: Request, res: Response) {
    const { email } = req.body;

    // TODO Checker

    return await this.service.checkDuplicatedEmail(email);
  }

  @Route('post', '/user/login-with-email')
  async loginWithEmail(req: Request, res: Response) {
    const { email, password } = req.body;

    // TODO Checker

    return await this.service.loginWithEmail(email, password);
  }
}

export default UserController;
