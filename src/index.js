import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import logger from 'morgan';

import getSwaggerOption from './swagger-ui';

import initApiController from './test-structure/api';

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());

//swagger 적용
const { swaggerUI, specs, setUpoption } = getSwaggerOption();
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs, setUpoption));

// Controller 연결
initApiController(app);

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => {
  console.log(`포트: ${PORT} 서버 가동 시작`);
});
