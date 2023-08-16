import 'reflect-metadata';
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import logger from 'morgan';
import getSwaggerOption from './swagger-ui';
import apiRouter from './router';
import { ERRORS } from './error/errors';

const app = express();
app.use(logger('dev'));
app.use(
  cors({
    credentials: true, // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
    //origin: 'http://localhost:5173',
    origin: true, // 출처 허용 옵션
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

apiRouter(app);

//swagger 적용
const { swaggerUI, specs, setUpOption } = getSwaggerOption();
app.use('/api/api-docs', swaggerUI.serve, swaggerUI.setup(specs, setUpOption));

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log('err', err);

  if (ERRORS[err.message]) {
    const errorDetail = ERRORS[err.message];
    res.status(err.statusCode).send(errorDetail.message);
  } else {
    res.status(err.statusCode || 500).send(err.message);
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`포트: ${PORT} 서버 가동 시작`);
});
