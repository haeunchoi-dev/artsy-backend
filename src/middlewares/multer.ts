const multer = require('multer');
const path = require('path');

const fileFilter = (req, file, callback) => {
  const typeArray = file.mimetype.split('/');

  const fileType = typeArray[1];

  if (fileType == 'jpg' || fileType == 'jpeg' || fileType == 'png') {
    callback(null, true);
  } else {
    return callback(
      { message: '*.jpg, *.jpeg, *.png 파일만 업로드가 가능합니다.' },
      false,
    );
  }
};

const generateFilename = (file) => {
  console.log('multer start');
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
