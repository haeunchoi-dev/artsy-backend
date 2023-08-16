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
