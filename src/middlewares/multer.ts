import { Request, Response, NextFunction, RequestHandler } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';

import { ERROR_NAMES, BadRequestError, InternalServerError } from '@/error/errors';

const serverRoot = path.resolve(process.cwd());
const tempDestination = serverRoot + '/views/uploads/temp';

const generateTempFilename = (originalFileName: string) => {
  const ext = path.extname(originalFileName);
  return path.basename(originalFileName, ext) + '_' + Date.now() + ext;
}

const storage = multer.diskStorage({
  destination: tempDestination,
  filename: (req, file, cb) => {
    const tempFilename = generateTempFilename(file.originalname);
    cb(null, tempFilename);
  },
});

const tempImageFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
) => {
  const ALLOW_IMAGE_TYPE = ['image/png', 'image/jpg', 'image/jpeg'];
  if (file.mimetype === undefined || !ALLOW_IMAGE_TYPE.includes(file.mimetype)) {
    const error: any = new Error('disallow image type');
    error.code = ERROR_NAMES.DISALLOW_FILE_TYPE;
    return callback(error);
  }

  callback(null, true);
};

const tempImageMulter = multer({
  storage: storage,
  fileFilter: tempImageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10
  }
});

const getMulterMiddleware = (multerUploader: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    multerUploader(req, res, (error) => {
      if (error) {
        next(convertMulterErrorToAppError(error));
      }
      next();
    })
  }
}

const convertMulterErrorToAppError = (error: any) => {
  switch (error.code) {
    case ERROR_NAMES.DISALLOW_FILE_TYPE: {
      return new BadRequestError(ERROR_NAMES.DISALLOW_FILE_TYPE, 'multer error - disallow file type');
    }
    case ERROR_NAMES.LIMIT_FILE_SIZE: {
      return new BadRequestError(ERROR_NAMES.LIMIT_FILE_SIZE, 'multer error - limit file size');
    }
    case ERROR_NAMES.LIMIT_FILE_COUNT: {
      return new BadRequestError(ERROR_NAMES.LIMIT_FILE_COUNT, 'multer error - limit file count');
    }
    default: {
      return new InternalServerError(ERROR_NAMES.INTERNAL_SERVER_ERROR, 'multer error');
    }
  }
}

const tempImageUpload = {
  single: (fieldname: string) => {
    const singleUploader = tempImageMulter.single(fieldname);
    return getMulterMiddleware(singleUploader);
  },
  fields: (fields: multer.Field[]) => {
    const filedsUploader = tempImageMulter.fields(fields);
    return getMulterMiddleware(filedsUploader);
  },
  array: (fieldName: string, maxCount?: number | undefined) => {
    const arrayUploader = tempImageMulter.array(fieldName, maxCount);
    return getMulterMiddleware(arrayUploader);
  }
}

export {
  tempImageUpload,
}