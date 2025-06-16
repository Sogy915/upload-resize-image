"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// spec/imgEndpoint.spec.ts
const supertest_1 = __importDefault(require("supertest"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const index_1 = __importDefault(require("../src/index"));
describe('Image API Endpoints Tests', () => {
    const uploadsDir = path_1.default.resolve(__dirname, '../uploads');
    const resizedDir = path_1.default.resolve(__dirname, '../resized');
    const testUploadImage = path_1.default.resolve(__dirname, '../upload/three-flowers-buds-with-leaves-table.jpg');
    const testFileName = 'three-flowers-buds-with-leaves-table.jpg';
    const testWidth = 200;
    const testHeight = 200;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield promises_1.default.mkdir(uploadsDir, { recursive: true }).catch(() => { });
        yield promises_1.default.mkdir(resizedDir, { recursive: true }).catch(() => { });
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const uploadedFiles = yield promises_1.default.readdir(uploadsDir);
            for (const file of uploadedFiles) {
                if (file.includes('three-flowers-buds-with-leaves-table') || file.includes(testFileName.split('.')[0])) {
                    yield promises_1.default.unlink(path_1.default.join(uploadsDir, file));
                }
            }
            const resizedFiles = yield promises_1.default.readdir(resizedDir);
            for (const file of resizedFiles) {
                if (file.includes(testFileName.split('.')[0])) {
                    yield promises_1.default.unlink(path_1.default.join(resizedDir, file));
                }
            }
        }
        catch (error) {
            console.error('Error during test cleanup in imgEndpointSpec:', error);
        }
    }));
    describe('POST /api/upload', () => {
        it('should upload an image file successfully and return 200', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(index_1.default)
                .post('/api/upload')
                .attach('image', testUploadImage);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('File uploaded successfully!');
            expect(response.body.filename).toMatch(/\.jpg$/i);
            expect(response.body.path).toContain('uploads/');
            const uploadedFilePath = path_1.default.join(uploadsDir, response.body.filename);
            const fileExists = yield promises_1.default.stat(uploadedFilePath).then(() => true).catch(() => false);
            expect(fileExists).toBeTrue();
        }));
        it('should return 400 if no image file is uploaded', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(index_1.default)
                .post('/api/upload');
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('No file uploaded or invalid file type.');
        }));
        it('should return 400 if the uploaded file is not an image', () => __awaiter(void 0, void 0, void 0, function* () {
            const nonImageFile = path_1.default.resolve(__dirname, '../package.json');
            const response = yield (0, supertest_1.default)(index_1.default)
                .post('/api/upload')
                .attach('image', nonImageFile);
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('No file uploaded or invalid file type.');
        }));
    });
    describe('GET /api/resize', () => {
        const originalImagePath = path_1.default.resolve(__dirname, '../upload/three-flowers-buds-with-leaves-table.jpg');
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield promises_1.default.mkdir(path_1.default.dirname(originalImagePath), { recursive: true }).catch(() => { });
        }));
        it('should return the resized image and status 200', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(index_1.default)
                .get('/api/resize')
                .query({ filename: testFileName, width: testWidth, height: testHeight });
            expect(response.status).toBe(200);
            expect(response.type).toBe('image/jpeg');
            const parsedFileName = path_1.default.parse(testFileName);
            const resizedImagePath = path_1.default.join(resizedDir, `${parsedFileName.name}_${testWidth}x${testHeight}${parsedFileName.ext}`);
            const fileExists = yield promises_1.default.stat(resizedImagePath).then(() => true).catch(() => false);
            expect(fileExists).toBeTrue();
        }));
        it('should return 400 if filename is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(index_1.default)
                .get('/api/resize')
                .query({ width: testWidth, height: testHeight });
            expect(response.status).toBe(400);
            expect(response.text).toContain('Filename, width, and height are required');
        }));
        it('should return 400 if width or height are not valid numbers', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(index_1.default)
                .get('/api/resize')
                .query({ filename: testFileName, width: 'abc', height: testHeight });
            expect(response.status).toBe(400);
            expect(response.text).toContain('Width and height must be positive numbers');
        }));
        it('should return 404 if the requested image does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const nonExistentFile = 'nonExistentImage.jpg';
            const response = yield (0, supertest_1.default)(index_1.default)
                .get('/api/resize')
                .query({ filename: nonExistentFile, width: testWidth, height: testHeight });
            expect(response.status).toBe(404);
            expect(response.text).toContain('Image not found');
        }));
    });
});
