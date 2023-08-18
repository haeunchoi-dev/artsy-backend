import 'reflect-metadata';
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import logger from 'morgan';
import cookieParser from 'cookie-parser';

import getSwaggerOption from './swagger-ui';
import apiRouter from './router';

const app = express();
app.use(logger('dev'));
app.use(
  cors({
    credentials: true, // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
    //origin: 'http://localhost:3000',
    //origin: '*',
    origin: process.env.origin || true, // 출처 허용 옵션
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

apiRouter(app);

//swagger 적용
const { swaggerUI, specs, setUpOption } = getSwaggerOption();
app.use('/api/api-docs', swaggerUI.serve, swaggerUI.setup(specs, setUpOption));

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('error', err);

  const errStatusCode = err.statusCode || 500;
  const errMessage = err.appErrorMessage || 'Internal server error';

  res.status(errStatusCode).json({
    success: false,
    error: errMessage,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`포트: ${PORT} 서버 가동 시작`);
});
