// spec/imgEndpoint.spec.ts

import request from 'supertest';

import path from 'path';

import fs from 'fs/promises';

import app from '../src/index';
 
describe('Image API Endpoints Tests', () => {

  const testFileName = 'three-flowers-buds-with-leaves-table.jpg';

  const testWidth = 200;

  const testHeight = 200;
 
  const uploadsDir = path.resolve(__dirname, '../uploads');

  const resizedDir = path.resolve(__dirname, '../resizes');

  const sourceImagePath = path.resolve(__dirname, '../upload', testFileName);

  const uploadImagePath = path.join(uploadsDir, testFileName);
 
  beforeAll(async () => {

    await fs.mkdir(uploadsDir, { recursive: true });

    await fs.mkdir(resizedDir, { recursive: true });
 
    try {

      await fs.access(uploadImagePath);

    } catch {

      await fs.copyFile(sourceImagePath, uploadImagePath);

    }

  });
 
  afterEach(async () => {

    try {

      const uploadedFiles = await fs.readdir(uploadsDir);

      for (const file of uploadedFiles) {

        if (file.includes(testFileName.split('.')[0])) {
            await new Promise(resolve => setTimeout(resolve, 100))
          await fs.unlink(path.join(uploadsDir, file));

        }

      }
 
      const resizedFiles = await fs.readdir(resizedDir);

      for (const file of resizedFiles) {

        if (file.includes(testFileName.split('.')[0])) {
        await new Promise(resolve => setTimeout(resolve, 100))
          await fs.unlink(path.join(resizedDir, file));

        }

      }

    } catch (err) {

      console.error('Error cleaning up after tests:', err);

    }

  });
 
  describe('POST /api/upload', () => {

  it('should upload an image file successfully and return 200', async () => {

    const response = await request(app)

      .post('/api/upload')

      .attach('image', sourceImagePath);
 
    expect(response.status).toBe(200);

    expect(response.body.message).toBe('File uploaded successfully!');

    expect(response.body.filename).toMatch(/\.jpg$/i);

    expect(response.body.path).toContain('uploads/');
 
    const uploadedFilePath = path.join(uploadsDir, response.body.filename);

    const fileExists = await fs.stat(uploadedFilePath).then(() => true).catch(() => false);

    expect(fileExists).toBeTrue();

  });
 
  it('should return 400 if no image file is uploaded', async () => {

    const response = await request(app).post('/api/upload');

    expect(response.status).toBe(400);

    expect(response.body.message).toBe('No file uploaded or invalid file type.');

  });
 
  it('should return 400 if the uploaded file is not an image', async () => {

    const nonImageFile = path.resolve(__dirname, '../__tests__/dummy.txt'); // تأكد من وجوده

    const response = await request(app)

      .post('/api/upload')

      .attach('image', nonImageFile);
 
    expect(response.status).toBe(400);

    expect(response.body.message).toBe('No file uploaded or invalid file type.');

  });

});
 
 
  describe('GET /api/images/resize', () => {

    beforeAll(async () => {

      try {

        await fs.access(uploadImagePath);

      } catch {

        await fs.copyFile(sourceImagePath, uploadImagePath);

      }

    });
 
    it('should return the resized image and status 200', async () => {

      const response = await request(app)

        .get('/api/images/resize')

        .query({ filename: testFileName, width: testWidth, height: testHeight });
 
      expect(response.status).toBe(200);

      expect(response.type).toBe('image/jpeg');
 
      const parsedFileName = path.parse(testFileName);

      const resizedImagePath = path.join(

        resizedDir,

        `${parsedFileName.name}_${testWidth}x${testHeight}${parsedFileName.ext}`

      );
 
      const fileExists = await fs.stat(resizedImagePath).then(() => true).catch(() => false);

      expect(fileExists).toBeTrue();

    });
 
    it('should return 400 if filename is missing', async () => {

      const response = await request(app)

        .get('/api/images/resize')

        .query({ width: testWidth, height: testHeight });
 
      expect(response.status).toBe(400);

      expect(response.text).toContain('Please provide filename');

    });
 
    it('should return 400 if width or height are not valid numbers', async () => {

      const response = await request(app)

        .get('/api/images/resize')

        .query({ filename: testFileName, width: 'abc', height: testHeight });
 
      expect(response.status).toBe(400);

      expect(response.text).toContain('Width and height must be positive numbers');

    });
 
    it('should return 404 if the requested image does not exist', async () => {

      const nonExistentFile = 'nonExistentImage.jpg';

      const response = await request(app)

        .get('/api/images/resize')

        .query({ filename: nonExistentFile, width: testWidth, height: testHeight });
 
      expect(response.status).toBe(404);

      expect(response.text).toContain('File not found');

    });

  });

});

 