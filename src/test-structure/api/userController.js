import mysql from 'mysql2';

import testService from '@/test-structure/services/testService';

export default function userController({ api, app }) {
  app.get('/', testMiddle1, testMiddle2, getTest);
}

async function getTest(req, res) {
  const result = await testService.getTest();
  console.log('get test', result);

  res.send(result);
}

function testMiddle1(req, res, next) {
  console.log('1번 미들웨어');
  next();
}

function testMiddle2(req, res, next) {
  console.log('2번 미들웨어');
  //throw new Error('미들웨어 에러 발생')
  next();
}