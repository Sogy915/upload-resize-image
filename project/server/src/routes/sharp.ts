import express, { Request, Response, Router } from 'express';
import path from 'path';
import fs from 'fs';
import { processImage } from '../utilities/imgprocessing';

const router: Router = express.Router();

const uploadsPath = path.join(__dirname, '../../uploads');
const resizesPath = path.join(__dirname, '../../resizes');

if (!fs.existsSync(resizesPath)) {
  fs.mkdirSync(resizesPath);
}

router.get('/resize', async (req: Request, res: Response): Promise<void> => {

  const filename = (req.query.filename as string)?.trim();

  const width = (req.query.width as string)?.trim();

  const height = (req.query.height as string)?.trim();


  if (!filename || !width || !height) {

    res.status(400).json({ error: 'Please provide filename, width, and height.' });

    return;

  }
 
  const parsedWidth = parseInt(width);

  const parsedHeight = parseInt(height);
 


  if (isNaN(parsedWidth) || isNaN(parsedHeight) || parsedWidth <= 0 || parsedHeight <= 0) {

    res.status(400).json({ error: 'Width and height must be positive numbers' });

    return;

  }
 
  const filePath = path.join(uploadsPath, filename);

  const resizedFilename = `${path.parse(filename).name}_${width}x${height}.jpg`;

  const outputPath = path.join(resizesPath, resizedFilename);
 
  if (!fs.existsSync(filePath)) {

    res.status(404).json({ error: `File not found: ${filename}` });

    return;

  }
 
  try {

    await processImage(filePath, outputPath, parsedWidth, parsedHeight);

    res.sendFile(outputPath);

  } catch (err) {

    console.error('Resize error:', err);

    res.status(500).json({

      error: 'Error resizing image',

      details: (err as Error).message,

    });

  }

});


router.get('/images', (req: Request, res: Response): void => {
  fs.readdir(uploadsPath, (err, files) => {
    if (err) {
      res.status(500).json({ error: 'Unable to fetch images' });
      return;
    }
    const imageUrls = files.map(file => `/uploads/${file}`);
    res.json(imageUrls);
  });
});

router.get('/resized-images', (req: Request, res: Response): void => {
  fs.readdir(resizesPath, (err, files) => {
    if (err) {
      res.status(500).json({ error: 'Unable to fetch resized images' });
      return;
    }
    const resizedImageUrls = files.map(file => `/resizes/${file}`);
    res.json(resizedImageUrls);
  });
});

export default router;