import multer from 'multer';
import path from 'path';
import { Request } from 'express';
 
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${Date.now()}${ext}`);
  },
});
 
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype === 'image/jpeg' || file.originalname.endsWith('.jpg')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
 
export const upload = multer({ storage, fileFilter });