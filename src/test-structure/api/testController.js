import testService from '@/test-structure/services/testService';

export default function testController({ api, app }) {
  app.post('/api/user/sign-up-with-email', signUpWithEmail);
  app.post('/api/user/check-duplicated-email', checkDuplicatedEmail);
  app.post('/api/user/login-with-email', loginWithEmail);
  app.get('/api/categories', getAllCategories);
  app.get('/api/categories/:categoryId', getCategory);
  app.get('/api/tickets/total-count', getTicketsTotalCount);
}

async function signUpWithEmail(req, res) {
  const { email, password, displayName } = req.body;

  // TODO Checker

  // TODO 비밀번호 암호화

  await testService.signUpWithEmail(email, password, displayName);

  res.json({
    result: 'OK',
  });
}

async function checkDuplicatedEmail(req, res) {
  const { email } = req.body;

  // TODO Checker

  const result = await testService.checkDuplicatedEmail(email);

  res.json({
    result: 'OK',
    artsyData: {
      isExists: result.length === 0 ? false : true
    }
  });
}

async function loginWithEmail(req, res) {
  const { email, password } = req.body;

  // TODO Checker

  // 비밀번호 암호화

  const result = await testService.loginWithEmail(email, password);
  const responseData = {
    result: 'OK',
  }

  if (result.length === 0) {
    responseData.artsyData = null;
  } else {
    responseData.artsyData = result[0];
  }

  res.json(responseData);
}

async function getAllCategories(req, res) {
  const result = await testService.getAllCategories();

  res.json({
    result: 'OK',
    artsyData: result
  });
}

async function getCategory(req, res) {
  const { categoryId } = req.params;
  console.log('categoryId', categoryId);

  // TODO Checker
  // TODO String to Number

  const result = await testService.getCategory(categoryId);

  const responseData = {
    result: 'OK',
  }

  if (result.length === 0) {
    responseData.artsyData = null;
  } else {
    responseData.artsyData = result[0];
  }

  res.json(responseData);
}

async function getTicketsTotalCount(req, res) {
  // TODO get userId from token

  const testUserId = 'd7b47b50-3b3c-11ee-8868-244bfecb3b3f';

  const result = await testService.getTicketsTotalCount(testUserId);

  res.json({
    result: 'OK',
    artsyData: {
      ...result[0]
    }
  });
}





//function testMiddle1(req, res, next) {
//  console.log('1번 미들웨어');
//  next();
//}

//function testMiddle2(req, res, next) {
//  console.log('2번 미들웨어');
//  //throw new Error('미들웨어 에러 발생')
//  next();
//}