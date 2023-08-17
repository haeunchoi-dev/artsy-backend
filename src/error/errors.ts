export const ERROR_NAMES = {
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  NOT_FOUND_EMAIL: 'NOT_FOUND_EMAIL',
  INCORRECT_PASSWORD: 'INCORRECT_PASSWORD',
  INVALID_PARAM: 'INVALID_PARAM',
  UNAUTHORIZED: 'UNAUTHORIZED',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
};

const ERRORS = {
  [ERROR_NAMES.EMAIL_ALREADY_EXISTS]: {
    message: '이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요.',
  },
  [ERROR_NAMES.NOT_FOUND_EMAIL]: {
    message: '존재하지 않는 이메일입니다.',
  },
  [ERROR_NAMES.INCORRECT_PASSWORD]: {
    message: '비밀번호가 일치하지 않습니다.',
  },
  [ERROR_NAMES.INVALID_PARAM]: {
    message: '잘못된 요청 값이 있습니다.'
  },
  [ERROR_NAMES.UNAUTHORIZED]: {
    message: '권한이 없습니다.'
  },
  [ERROR_NAMES.INTERNAL_SERVER_ERROR]: {
    message: 'internal server error'
  },
};

class AppErrorBase extends Error {
  public serverLog: string | undefined;
  public appErrorMessage: string;

  constructor(description: string, serverLog?: string) {
    super(description);
    this.serverLog = serverLog !== undefined ? serverLog : description;
    this.setAppErrorMessage(description);
  }

  setAppErrorMessage(description: string) {
    const errDetail = ERRORS[description];
    this.appErrorMessage = errDetail !== undefined ? errDetail.message : description;
  }
}

// 잘못된 요청
export class BadRequestError extends AppErrorBase {
  public name = 'Bad Request';
  public statusCode = 400;

  constructor(description: string, serverLog?: string) {
    super(description, serverLog);
    Error.captureStackTrace(this);
  }
}

// 인증 자격 없음
export class UnauthorizedError extends AppErrorBase {
  public name = 'Unauthorized';
  public statusCode = 401;

  constructor(description: string, serverLog?: string) {
    super(description, serverLog);
    Error.captureStackTrace(this);
  }
}

// 접근권한없음
export class ForbiddenError extends AppErrorBase {
  public name = 'Forbidden';
  public statusCode = 403;

  constructor(description: string, serverLog?: string) {
    super(description, serverLog);
    Error.captureStackTrace(this);
  }
}

export class InternalServerError extends AppErrorBase {
  public name = 'Internal Server Error';
  public statusCode = 500;

  constructor(description: string, serverLog?: string) {
    super(description, serverLog);
    Error.captureStackTrace(this);
  }
}
