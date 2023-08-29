export const ERROR_NAMES = {
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  NOT_FOUND_EMAIL: 'NOT_FOUND_EMAIL',
  INCORRECT_PASSWORD: 'INCORRECT_PASSWORD',
  DATA_NOT_FOUND: 'DATA_NOT_FOUND',
  INVALID_PARAM: 'INVALID_PARAM',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  LIMIT_FILE_SIZE: 'LIMIT_FILE_SIZE',
  LIMIT_FILE_COUNT: 'LIMIT_FILE_COUNT',
  DISALLOW_FILE_TYPE: 'DISALLOW_FILE_TYPE',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
};

const ERRORS = {
  [ERROR_NAMES.EMAIL_ALREADY_EXISTS]: {
    message: 'email already exists',
  },
  [ERROR_NAMES.NOT_FOUND_EMAIL]: {
    message: 'not found email',
  },
  [ERROR_NAMES.INCORRECT_PASSWORD]: {
    message: 'incorrect password',
  },
  [ERROR_NAMES.DATA_NOT_FOUND]: {
    message: 'data not found',
  },
  [ERROR_NAMES.INVALID_PARAM]: {
    message: 'invalid param'
  },
  [ERROR_NAMES.UNAUTHORIZED]: {
    message: 'unauthorized'
  },
  [ERROR_NAMES.FORBIDDEN]: {
    message: 'forbidden'
  },
  [ERROR_NAMES.LIMIT_FILE_SIZE]: {
    message: 'limit file size'
  },
  [ERROR_NAMES.LIMIT_FILE_COUNT]: {
    message: 'limit file count'
  },
  [ERROR_NAMES.DISALLOW_FILE_TYPE]: {
    message: 'disallow file type'
  },
  [ERROR_NAMES.INTERNAL_SERVER_ERROR]: {
    message: 'internal server error'
  },
};

class AppErrorBase extends Error {
  private appErrorType: string;
  private serverLog: string | undefined;
  private appErrorMessage: string;

  constructor(description: string, serverLog?: string) {
    super(description);

    const errorInfo = ERRORS[description];
    if (errorInfo !== undefined) {
      this.appErrorType = description;
      this.serverLog = serverLog !== undefined ? serverLog : errorInfo.message;
      this.appErrorMessage = errorInfo.message;

    } else {
      this.appErrorType = 'UNDEFINED_APP_ERROR_TYPE';
      this.serverLog = serverLog !== undefined ? serverLog : description;
      this.appErrorMessage = description;
    }
  }
}

// 잘못된 요청
export class BadRequestError extends AppErrorBase {
  private errorName = 'Bad Request';
  private statusCode = 400;

  constructor(description: string, serverLog?: string) {
    super(description, serverLog);
    Error.captureStackTrace(this);
  }
}

// 인증 자격 없음
export class UnauthorizedError extends AppErrorBase {
  private errorName = 'Unauthorized';
  private statusCode = 401;

  constructor(description: string, serverLog?: string) {
    super(description, serverLog);
    Error.captureStackTrace(this);
  }
}

// 접근권한없음
export class ForbiddenError extends AppErrorBase {
  private errorName = 'Forbidden';
  private statusCode = 403;

  constructor(description: string, serverLog?: string) {
    super(description, serverLog);
    Error.captureStackTrace(this);
  }
}

export class InternalServerError extends AppErrorBase {
  private errorName = 'Internal Server Error';
  private statusCode = 500;

  constructor(description: string, serverLog?: string) {
    super(description, serverLog);
    Error.captureStackTrace(this);
  }
}
