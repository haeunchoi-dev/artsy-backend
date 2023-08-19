import 'reflect-metadata';
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import logger from 'morgan';
import cookieParser from 'cookie-parser';

import getSwaggerOption from './swagger-ui';
import apiRouter from './router';
//import { ERRORS, AppErrorBase } from './error/errors';

const app = express();
app.use(logger('dev'));
app.use(
  cors({
    credentials: true, // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
    //origin: 'http://localhost:3000',
    //origin: '*',
    origin: process.env.ORIGIN || true, // 출처 허용 옵션
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

  // REST API의 에러 핸들링의 표준화를 위해서 RFC 7807에서 제시한 에러핸들링 일반 구조
  // type : 세부 에러 코드. (꼭 숫자일 필요는 없음)
  // title : 에러에 대한 간략한 설명
  // status(optional) : HTTP response code
  // detail : 에러에 대한 자세한 설명
  // instance : 에러 발생 근원지 URI
  // {
  //   "type": "/errors/incorrect-user-pass",
  //   "title": "Incorrect username or password.",
  //   "status": 401,
  //   "detail": "Authentication failed due to incorrect username or password.",
  //   "instance": "/login/log/abc123"
  // }

  // ex 트위터
  //{
  //    "errors": [
  //        {
  //            "code":215,
  //            "message":"Bad Authentication data."
  //        }
  //    ]
  //}

  // ex 페이스북
  //{
  //    "error": {
  //        "message": "Missing redirect_uri parameter.",
  //        "type": "OAuthException",
  //        "code": 191,
  //        "fbtrace_id": "AWswcVwbcqfgrSgjG80MtqJ"
  //    }
  //}

  // 해당 프로젝트에서 사용할 Error
  //error: {
  //  type?: {errorType}, // 클라이언트에서 핸들링할 기준 / type이 없다면 서버에서 내려준 에러가 아니거나 서버에서 예측하지 못한 에러
  //  code: 400, // statusCode custom code는 사용하지 않음
  //  message: {message}, // 클라이언트에서 확인할 메세지
  //}

  const errStatusCode: number = err.statusCode || 500;

  const responseError: {
    type?: string;
    code: number;
    message: string;
  } = {
    code: errStatusCode,
    message:
      err.appErrorMessage !== undefined
        ? `${err.name} - ${err.appErrorMessage}`
        : 'Internal server error',
  };

  if (err.appErrorType !== undefined) {
    responseError.type = err.appErrorType;
  }

  res.status(errStatusCode).json({
    success: false,
    error: responseError,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`포트: ${PORT} 서버 가동 시작`);
});
