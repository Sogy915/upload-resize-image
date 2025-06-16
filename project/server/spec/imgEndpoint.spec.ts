// spec/imgEndpoint.spec.ts
import request from 'supertest';
import path from 'path';
import fs from 'fs/promises';

import app from '../src/index';

describe('Image API Endpoints Tests', () => {
    const uploadsDir = path.resolve(__dirname, '../uploads'); 
    const resizedDir = path.resolve(__dirname, '../resized'); 

    const testUploadImage = path.resolve(__dirname, '../upload/three-flowers-buds-with-leaves-table.jpg');

    const testFileName = 'three-flowers-buds-with-leaves-table.jpg';
    const testWidth = 200;
    const testHeight = 200;

    beforeAll(async () => {
        await fs.mkdir(uploadsDir, { recursive: true }).catch(() => {});
        await fs.mkdir(resizedDir, { recursive: true }).catch(() => {});
    });

    afterEach(async () => {
        try {
            const uploadedFiles = await fs.readdir(uploadsDir);
            for (const file of uploadedFiles) {
                if (file.includes('three-flowers-buds-with-leaves-table') || file.includes(testFileName.split('.')[0])) {
                    await fs.unlink(path.join(uploadsDir, file));
                }
            }
            
            const resizedFiles = await fs.readdir(resizedDir);
            for (const file of resizedFiles) {
                
                if (file.includes(testFileName.split('.')[0])) {
                    await fs.unlink(path.join(resizedDir, file));
                }
            }
        } catch (error) {
           
            console.error('Error during test cleanup in imgEndpointSpec:', error);
        }
    });

    describe('POST /api/upload', () => {
        it('should upload an image file successfully and return 200', async () => {
            const response = await request(app)
                .post('/api/upload')
                .attach('image', testUploadImage); 

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('File uploaded successfully!');
            expect(response.body.filename).toMatch(/\.jpg$/i); 
            expect(response.body.path).toContain('uploads/');

   
            const uploadedFilePath = path.join(uploadsDir, response.body.filename);
            const fileExists = await fs.stat(uploadedFilePath).then(() => true).catch(() => false);
            expect(fileExists).toBeTrue();
        });

        it('should return 400 if no image file is uploaded', async () => {
            const response = await request(app)
                .post('/api/upload'); 
            expect(response.status).toBe(400);
            
            expect(response.body.message).toBe('No file uploaded or invalid file type.');
        });

        it('should return 400 if the uploaded file is not an image', async () => {
            const nonImageFile = path.resolve(__dirname, '../package.json'); 
            const response = await request(app)
                .post('/api/upload')
                .attach('image', nonImageFile);

            expect(response.status).toBe(400);
          
            expect(response.body.message).toBe('No file uploaded or invalid file type.');
        });
    });

    describe('GET /api/resize', () => {
       
        const originalImagePath = path.resolve(__dirname, '../upload/three-flowers-buds-with-leaves-table.jpg');

        beforeAll(async () => {
            await fs.mkdir(path.dirname(originalImagePath), { recursive: true }).catch(() => {});

        });

        it('should return the resized image and status 200', async () => {
            const response = await request(app)
                .get('/api/resize')
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
                .get('/api/resize')
                .query({ width: testWidth, height: testHeight });

            expect(response.status).toBe(400);
            expect(response.text).toContain('Filename, width, and height are required');
        });

        it('should return 400 if width or height are not valid numbers', async () => {
            const response = await request(app)
                .get('/api/resize')
                .query({ filename: testFileName, width: 'abc', height: testHeight });

            expect(response.status).toBe(400);
          
            expect(response.text).toContain('Width and height must be positive numbers');
        });

        it('should return 404 if the requested image does not exist', async () => {
            const nonExistentFile = 'nonExistentImage.jpg';
            const response = await request(app)
                .get('/api/resize')
                .query({ filename: nonExistentFile, width: testWidth, height: testHeight });

            expect(response.status).toBe(404);
  
            expect(response.text).toContain('Image not found');
        });
    });
});