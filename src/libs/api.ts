import { Request, Response, NextFunction } from 'express';

interface SuccessResponseData {
  success: true,
  artsyData?: Array<Object> | Object | null
}

type RequestHandlerType = (req: Request, res: Response, next: NextFunction) => Promise<Array<Object> | Object | null | undefined>

export const defaultProcess = (requestHandler: RequestHandlerType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resultData = await requestHandler(req, res, next);

      const responseData: SuccessResponseData = {
        success: true
      }

      if (resultData !== undefined) {
        responseData.artsyData = resultData;
      }

      res.status(200).json(responseData);

    } catch (error) {
      next(error);
    }
  };
};

const secure = process.env.COOKIE_SECURE === 'true';
const sameSite = (process.env.COOKIE_SAMESITE as 'none') || 'lax';
const httpOnly = process.env.COOKIE_HTTPONLY === 'true';
const expiredTime = 1000 * 60 * 60 * 24 * 14;

export const setAccessTokenCookie = (res: Response, accessToken: string) => {
  const cookieOptions = {
    expires: new Date(Date.now() + expiredTime),
    httpOnly,
    secure,
    sameSite,
  }
  res.cookie('accessToken', accessToken, cookieOptions);
}

export const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  const cookieOptions = {
    expires: new Date(Date.now() + expiredTime),
    httpOnly,
    secure,
    sameSite,
  }
  res.cookie('refreshToken', refreshToken, cookieOptions);
}