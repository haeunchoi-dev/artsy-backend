import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { ERROR_NAMES, UnauthorizedError, InternalServerError } from '@/error/errors';

export enum UserType {
  user = 'user',
  admin = 'admin',
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
        throw new InternalServerError(ERROR_NAMES.INTERNAL_SERVER_ERROR, 'auth error - undefined user type');
      }
    }
  };
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
  if (loginToken === undefined || loginToken === null || loginToken === 'null') {
    throw new UnauthorizedError(ERROR_NAMES.UNAUTHORIZED, 'authMember - invalid loginToken');
  }

  try {
    const userInfo = jwt.verify(loginToken, process.env.TOKEN_SECRET_KEY || 'artsy-secret-key') as { userId: string };
    req.params.userId = userInfo.userId;
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new UnauthorizedError(ERROR_NAMES.UNAUTHORIZED, 'authMember - only access member - token expired');

    } else if (error.name === 'JsonWebTokenError') {
      throw new UnauthorizedError(ERROR_NAMES.UNAUTHORIZED, 'authMember - only access member - invalid token');

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
