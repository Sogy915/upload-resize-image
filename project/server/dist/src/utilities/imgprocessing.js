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
exports.resizeImage = exports.processImage = void 0;
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
const processImage = (filePath, outputPath, width, height) => __awaiter(void 0, void 0, void 0, function* () {
    if (!fs_1.default.existsSync(outputPath)) {
        yield (0, sharp_1.default)(filePath)
            .resize(width, height)
            .toFormat('jpeg')
            .toFile(outputPath);
    }
});
exports.processImage = processImage;
const resizeImage = (sourcePath, width, height, outputPath) => __awaiter(void 0, void 0, void 0, function* () {
    if (!fs_1.default.existsSync(sourcePath)) {
        throw new Error(`Source file does not exist: ${sourcePath}`);
    }
    else if (width <= 0 || height <= 0) {
        throw new Error(`Invalid dimensions: width=${width}, height=${height}`);
    }
    try {
        yield (0, sharp_1.default)(sourcePath)
            .resize(width, height)
            .toFile(outputPath);
    }
    catch (error) {
        throw new Error(`Error processing image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    if (!fs_1.default.existsSync(outputPath)) {
        throw new Error(`Output file was not created: ${outputPath}`);
    }
    const outputFileStat = yield fs_1.default.promises.stat(outputPath);
    if (outputFileStat.size === 0) {
        throw new Error(`Output file is empty: ${outputPath}`);
    }
    else {
        console.log(`Image resized successfully: ${outputPath}`);
    }
});
exports.resizeImage = resizeImage;
