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
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const imgprocessing_1 = require("../utilities/imgprocessing");
const router = express_1.default.Router();
const uploadsPath = path_1.default.join(__dirname, '../../uploads');
const resizesPath = path_1.default.join(__dirname, '../../resizes');
if (!fs_1.default.existsSync(resizesPath)) {
    fs_1.default.mkdirSync(resizesPath);
}
router.get('/resize', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const filename = (_a = req.query.filename) === null || _a === void 0 ? void 0 : _a.trim();
    const width = (_b = req.query.width) === null || _b === void 0 ? void 0 : _b.trim();
    const height = (_c = req.query.height) === null || _c === void 0 ? void 0 : _c.trim();
    if (!filename || !width || !height) {
        res.status(400).json({ error: 'Please provide filename, width, and height.' });
        return;
    }
    const filePath = path_1.default.join(uploadsPath, filename);
    const resizedFilename = `${path_1.default.parse(filename).name}_${width}x${height}.jpg`;
    const outputPath = path_1.default.join(resizesPath, resizedFilename);
    if (!fs_1.default.existsSync(filePath)) {
        res.status(404).json({ error: `File not found: ${filename}` });
        return;
    }
    try {
        yield (0, imgprocessing_1.processImage)(filePath, outputPath, parseInt(width), parseInt(height));
        res.sendFile(outputPath);
    }
    catch (err) {
        console.error('Resize error:', err);
        res.status(500).json({
            error: 'Error resizing image',
            details: err.message,
        });
    }
}));
router.get('/images', (req, res) => {
    fs_1.default.readdir(uploadsPath, (err, files) => {
        if (err) {
            res.status(500).json({ error: 'Unable to fetch images' });
            return;
        }
        const imageUrls = files.map(file => `/uploads/${file}`);
        res.json(imageUrls);
    });
});
router.get('/resized-images', (req, res) => {
    fs_1.default.readdir(resizesPath, (err, files) => {
        if (err) {
            res.status(500).json({ error: 'Unable to fetch resized images' });
            return;
        }
        const resizedImageUrls = files.map(file => `/resizes/${file}`);
        res.json(resizedImageUrls);
    });
});
exports.default = router;
