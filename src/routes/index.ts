import { Router } from 'express';

import userRouter from './user-router';

const apiRouter = Router();

apiRouter.use(userRouter);

export default apiRouter;
