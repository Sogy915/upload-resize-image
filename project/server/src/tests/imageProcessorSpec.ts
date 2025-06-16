import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

describe('Image processing function (sharp)', () => {
  const inputPath = path.join(__dirname, '../../../uploads/square-frame-made-from-flowers-buds-leaves.jpg');
  const outputPath = path.join(__dirname, '../../../resizes/square-frame-made-from-flowers-buds-leaves_300x300.jpg');

  afterAll(() => {

    if (fs.existsSync(outputPath)) {
      
      fs.unlinkSync(outputPath);
    }
  });

  it('should resize image without throwing error', async () => {
    await expectAsync(
      sharp(inputPath)
        .resize(100, 100)
        .toFormat('jpeg')
        .toFile(outputPath)
    ).toBeResolved();
  });

  it('should create a resized file', async () => {
    await sharp(inputPath).resize(100, 100).toFile(outputPath);
    expect(fs.existsSync(outputPath)).toBeTrue();
  });
});