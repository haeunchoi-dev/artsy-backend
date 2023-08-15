export const ERROR_NAMES = {
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
};

export const ERRORS = {
  [ERROR_NAMES.EMAIL_ALREADY_EXISTS]: {
    code: 1001,
    statusCode: 400,
    message: '이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요.',
  },
};
