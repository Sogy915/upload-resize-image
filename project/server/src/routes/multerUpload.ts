import express from 'express';
import path from 'path';
import fs from 'fs';
import { upload } from '../middleware/multer';

const router = express.Router();

// Endpoint: POST /upload
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ error: 'No file uploaded or invalid file type.' });
  }

  res.status(200).json({
    message: 'File uploaded successfully!',
    filename: req.file.filename,
    path: req.file.path,
  });
});

router.get('/images', (req, res) => {
  const dirPath = path.join(__dirname, '../../uploads');
  fs.readdir(dirPath, (err, files) => {
    if (err) return res.status(500).json({ error: 'Unable to fetch images' });
    const imageUrls = files.map(file => `/uploads/${file}`);
    res.json(imageUrls);
  });
});


export default router;
