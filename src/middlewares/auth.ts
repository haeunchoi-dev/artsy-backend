import { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';
//const { ERROR_CODE, createAppError } = require('./appErrorMaker');

export enum UserType {
  user = 'user',
  admin = 'admin'
}

export default function auth(userType: UserType) {
  return (req: Request, res: Response, next: NextFunction) => {
    switch (userType) {
      //case 'non-user': {
      //  authNonUser(req, next)
      //  break;
      //}
      case UserType.user: {
        authMember(req, next);
        break;
      }
      //case UserType.admin: {
      //  authAdmin(req, next);
      //  break;
      //}
      default: {
        // TODO
        throw new Error('에러 관리');
        //throw createAppError(ERROR_CODE.internalServerError, 'internalServerError', 'auth error - undefined user type');
      }
    }
  }
}

//function authNonUser(req, next) {
//  const token = req.headers.authorization;
//  if (!(token === 'undefined' || token === 'null')) {
//    throw createAppError(ERROR_CODE.unauthorized, 'unauthorized', 'only access non-user');
//  }

//  next();
//}

function authMember(req: Request, next: NextFunction) {
  const loginToken = req.cookies.loginToken;
  if (!loginToken || loginToken === 'null') {
    // TODO
    throw new Error('auth 에러 관리');
  }

  try {
    const userInfo = jwt.verify(loginToken, process.env.TOKEN_SECRET_KEY) as { userId: string };
    req.params.userId = userInfo.userId;
    next();

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // TODO
      throw new Error('에러 관리');
      //throw createAppError(ERROR_CODE.unauthorized, 'unauthorized', 'only access member - token expired');
    } else if (error.name === "JsonWebTokenError") {
      // TODO
      throw new Error('에러 관리');
      //throw createAppError(ERROR_CODE.unauthorized, 'unauthorized', 'only access member - invalid token');
    } else {
      throw error;
    }
  }
}

//function authAdmin(req, next) {
//  try {
//    const userInfo = jwt.verify(req.headers.authorization, process.env.TOKEN_SECRET_KEY);
//    if (userInfo.type !== 'admin') {
//      throw createAppError(ERROR_CODE.unauthorized, 'unauthorized', 'only access admin');
//    }
//    req.userInfo = userInfo;
//    next();

//  } catch (error) {
//    if (error.name === "TokenExpiredError") {
//      throw createAppError(ERROR_CODE.unauthorized, 'unauthorized', 'only access admin - token expired');
//    } else if (error.name === "JsonWebTokenError") {
//      throw createAppError(ERROR_CODE.unauthorized, 'unauthorized', 'only access admin - invalid token');
//    } else {
//      throw error;
//    }
//  }
//}