"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = require("../middleware/multer");
const router = express_1.default.Router();
// Endpoint: POST /upload
router.post('/upload', multer_1.upload.single('image'), (req, res) => {
    if (!req.file) {
        return res
            .status(400)
            .json({ error: 'No file uploaded or invalid file type.' });
    }
    res.status(200).json({
        message: 'File uploaded successfully!',
        filename: req.file.filename,
        path: req.file.path,
    });
});
router.get('/images', (req, res) => {
    const dirPath = path_1.default.join(__dirname, '../../uploads');
    fs_1.default.readdir(dirPath, (err, files) => {
        if (err)
            return res.status(500).json({ error: 'Unable to fetch images' });
        const imageUrls = files.map(file => `/uploads/${file}`);
        res.json(imageUrls);
    });
});
exports.default = router;
