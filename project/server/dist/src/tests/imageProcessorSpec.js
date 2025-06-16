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
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
describe('Image processing function (sharp)', () => {
    const inputPath = path_1.default.join(__dirname, '../../../uploads/square-frame-made-from-flowers-buds-leaves.jpg');
    const outputPath = path_1.default.join(__dirname, '../../../resizes/square-frame-made-from-flowers-buds-leaves_300x300.jpg');
    afterAll(() => {
        if (fs_1.default.existsSync(outputPath)) {
            fs_1.default.unlinkSync(outputPath);
        }
    });
    it('should resize image without throwing error', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expectAsync((0, sharp_1.default)(inputPath)
            .resize(100, 100)
            .toFormat('jpeg')
            .toFile(outputPath)).toBeResolved();
    }));
    it('should create a resized file', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, sharp_1.default)(inputPath).resize(100, 100).toFile(outputPath);
        expect(fs_1.default.existsSync(outputPath)).toBeTrue();
    }));
});
