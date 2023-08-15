import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import getSwaggerOption from './swagger-ui';
import apiRouter from './router';
import { ERRORS } from './error/errors';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

apiRouter(app);

//swagger 적용
const { swaggerUI, specs, setUpOption } = getSwaggerOption();
app.use('/api/api-docs', swaggerUI.serve, swaggerUI.setup(specs, setUpOption));

app.use((err, req, res, next) => {
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
