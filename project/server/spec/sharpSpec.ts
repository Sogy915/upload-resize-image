// spec/sharpSpec.ts
import path from 'path';
import fs from 'fs/promises';
import { resizeImage } from '../src/utilities/imgprocessing';

describe('Image Processing Function Tests (resizeImage)', () => {
    const testImageOriginal = path.resolve(__dirname, '../upload/three-flowers-buds-with-leaves-table.jpg');
    const outputDir = path.resolve(__dirname, '../resizes');
    const outputFilePath = path.join(outputDir, 'three-flowers-buds-with-leaves-table_300x300.jpg');

    beforeAll(async () => {
        await fs.mkdir(path.resolve(__dirname, '../upload'), { recursive: true }).catch(() => {});
    });

    beforeEach(async () => {
        await fs.mkdir(outputDir, { recursive: true }).catch(() => {});
    });

    afterEach(async () => {
        try {
            if (await fs.stat(outputFilePath).catch(() => null)) {
                await fs.unlink(outputFilePath);
            }
        } catch (error) {
            console.error('Error during test cleanup in sharpSpec:', error);
        }
    });

    it('should resize the image successfully without errors', async () => {
        const width = 150;
        const height = 150;

        await expectAsync(resizeImage(testImageOriginal, width, height, outputFilePath))
            .not.toBeRejected();

        const fileExists = await fs.stat(outputFilePath).then(() => true).catch(() => false);
        expect(fileExists).toBeTrue();
    });

    it('should throw an error if the source file does not exist', async () => {
        const nonExistentPath = path.resolve(__dirname, '../upload/nonExistentImage.jpg');
        const width = 100;
        const height = 100;

        await expectAsync(resizeImage(nonExistentPath, width, height, outputFilePath))
            .toBeRejected();
    });

    it('should throw an error if dimensions are invalid (e.g., zero or negative)', async () => {
        const width = 0;
        const height = 100;

        await expectAsync(resizeImage(testImageOriginal, width, height, outputFilePath))
            .toBeRejected();
    });
});
