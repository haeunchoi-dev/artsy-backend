import { Request, Response, NextFunction } from 'express';
import {
  ERROR_NAMES,
  UnauthorizedError,
  InternalServerError,
} from '@/error/errors';
import jwt from 'jsonwebtoken';
import UserDto from '@/dto/user-dto';

export enum UserType {
  user = 'user',
  //admin = 'admin',
}

export default function auth(userType: UserType) {
  return (req: Request, res: Response, next: NextFunction) => {
    switch (userType) {
      case UserType.user: {
        authMember(req, res, next);
        break;
      }
      //case UserType.admin: {
      //  authAdmin(req, next);
      //  break;
      //}
      default: {
        throw new InternalServerError(
          ERROR_NAMES.INTERNAL_SERVER_ERROR,
          'auth error - undefined user type',
        );
      }
    }
  };
}

async function authMember(req: Request, res: Response, next: NextFunction) {
  const { loginToken } = req.cookies;
  if (
    loginToken === undefined ||
    loginToken === null ||
    loginToken === 'null'
  ) {
    throw new UnauthorizedError(
      ERROR_NAMES.UNAUTHORIZED,
      'authMember - invalid loginToken',
    );
  }

  try {
    const userInfo = jwt.verify(
      loginToken,
      process.env.TOKEN_SECRET_KEY || 'artsy-secret-key',
    ) as { userId: string };

    req.user = new UserDto(userInfo.userId);
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new UnauthorizedError(
        ERROR_NAMES.UNAUTHORIZED,
        'authMember - only access member - token expired',
      );
    } else if (error.name === 'JsonWebTokenError') {
      throw new UnauthorizedError(
        ERROR_NAMES.UNAUTHORIZED,
        'authMember - only access member - invalid token',
      );
    } else {
      throw error;
    }
  }
}
