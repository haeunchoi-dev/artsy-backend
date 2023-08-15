import { Injectable } from '../decorators/di-decorator';
import { Route } from '../decorators/route-decorator';

import UserService from '../services/user-service';
import { Request, Response } from 'express';

@Injectable()
class UserController {
  constructor(private readonly service: UserService) {}

  @Route('post', '/user/sign-up-with-email')
  async siginUpWithEmail(req: Request, res: Response) {
    const { displayName, email, password } = req.body;

    const newUser = await this.service.siginUpWithEmail(
      displayName,
      email,
      password,
    );
    res.status(200).json({ success: true, artsyData: newUser });
  }
}

export default UserController;
