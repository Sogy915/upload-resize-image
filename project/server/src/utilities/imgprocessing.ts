import sharp from 'sharp';
import fs from 'fs';

export const processImage = async (
  filePath: string,
  outputPath: string,
  width: number,
  height: number
): Promise<void> => {
  if (!fs.existsSync(outputPath)) {
    await sharp(filePath)
      .resize(width, height)
      .toFormat('jpeg')
      .toFile(outputPath);
  }
};
export const resizeImage = async (
  sourcePath: string,
  width: number,
  height: number,
  outputPath: string
): Promise<void> => {
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source file does not exist: ${sourcePath}`);
  } else if (width <= 0 || height <= 0) {
    throw new Error(`Invalid dimensions: width=${width}, height=${height}`);
  }
  try { 
    await sharp(sourcePath)
      .resize(width, height)
      .toFile(outputPath);
  } catch (error) {
    throw new Error(`Error processing image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  if (!fs.existsSync(outputPath)) {
    throw new Error(`Output file was not created: ${outputPath}`);
  }
  const outputFileStat = await fs.promises.stat(outputPath);
  if (outputFileStat.size === 0) {
    throw new Error(`Output file is empty: ${outputPath}`);
  } else {
    console.log(`Image resized successfully: ${outputPath}`);
  }
};