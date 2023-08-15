import { Router } from 'express';
import { defaultProcess } from '../libs/api';

import UserController from '../containers/user-container';

const baseUrl = '/user';
const userRouter = Router();

userRouter.post(
  `${baseUrl}/sign-up-with-email`,
  defaultProcess(UserController.siginUpWithEmail),
);

export default userRouter;
