export const ERROR_NAMES = {
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
};

export const ERRORS = {
  [ERROR_NAMES.EMAIL_ALREADY_EXISTS]: {
    message: '이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요.',
  },
};

export class BaadRequestError extends Error {
  statusCode: number;
  constructor(description: string) {
    super(description);

    this.name = 'Bad Request';
    this.statusCode = 400;
    Error.captureStackTrace(this);
  }
}

export class ForbiddenError extends Error {
  // 접근권한없음
  statusCode: number;
  constructor(description: string) {
    super(description);

    this.name = 'Forbidden';
    this.statusCode = 403;
    Error.captureStackTrace(this);
  }
}
