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
// spec/sharpSpec.ts
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const imgprocessing_1 = require("../src/utilities/imgprocessing");
describe('Image Processing Function Tests (resizeImage)', () => {
    const testImageOriginal = path_1.default.resolve(__dirname, '../upload/three-flowers-buds-with-leaves-table.jpg');
    const outputDir = path_1.default.resolve(__dirname, '../resizes');
    const outputFilePath = path_1.default.join(outputDir, 'three-flowers-buds-with-leaves-table_300x300.jpg');
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield promises_1.default.mkdir(path_1.default.resolve(__dirname, '../upload'), { recursive: true }).catch(() => { });
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield promises_1.default.mkdir(outputDir, { recursive: true }).catch(() => { });
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (yield promises_1.default.stat(outputFilePath).catch(() => null)) {
                yield promises_1.default.unlink(outputFilePath);
            }
        }
        catch (error) {
            console.error('Error during test cleanup in sharpSpec:', error);
        }
    }));
    it('should resize the image successfully without errors', () => __awaiter(void 0, void 0, void 0, function* () {
        const width = 150;
        const height = 150;
        yield expectAsync((0, imgprocessing_1.resizeImage)(testImageOriginal, width, height, outputFilePath))
            .not.toBeRejected();
        const fileExists = yield promises_1.default.stat(outputFilePath).then(() => true).catch(() => false);
        expect(fileExists).toBeTrue();
    }));
    it('should throw an error if the source file does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const nonExistentPath = path_1.default.resolve(__dirname, '../upload/nonExistentImage.jpg');
        const width = 100;
        const height = 100;
        yield expectAsync((0, imgprocessing_1.resizeImage)(nonExistentPath, width, height, outputFilePath))
            .toBeRejected();
    }));
    it('should throw an error if dimensions are invalid (e.g., zero or negative)', () => __awaiter(void 0, void 0, void 0, function* () {
        const width = 0;
        const height = 100;
        yield expectAsync((0, imgprocessing_1.resizeImage)(testImageOriginal, width, height, outputFilePath))
            .toBeRejected();
    }));
});
