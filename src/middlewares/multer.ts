import multer, { FileFilterCallback } from 'multer';
import path from 'path';

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
) => {
  const typeArray = file.mimetype.split('/');

  const fileType = typeArray[1];

  if (fileType == 'jpg' || fileType == 'jpeg' || fileType == 'png') {
    callback(null, true);
  } else {
    callback(null, false);
    new Error('*.jpg, *.jpeg, *.png 파일만 업로드가 가능합니다.');
  }
};

const generateFilename = (file: Express.Multer.File) => {
  const ext = path.extname(file.originalname); // 파일의 확장자
  return path.basename(file.originalname, ext) + Date.now() + ext;
};

const serverRoot = path.resolve(process.cwd());
const storage = multer.diskStorage({
  destination: serverRoot + '/views/uploads/',
  filename: (req, file, cb) => {
    const filename = generateFilename(file);
    cb(null, filename);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

export default upload;
