"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const logger_1 = require("./utilities/logger");
const app = (0, express_1.default)();
const PORT = 3000;
// Middleware
app.use(logger_1.requestLogger);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Ensure uploads folder exists
const uploadFolder = path_1.default.join(__dirname, 'uploads');
if (!fs_1.default.existsSync(uploadFolder)) {
    fs_1.default.mkdirSync(uploadFolder);
}
// Serve static uploaded files
app.use('/uploads', express_1.default.static(uploadFolder));
// Multer configuration
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    },
});
const fileFilter = (req, file, cb) => {
    const allowedExtensions = ['.jpg', '.jpeg'];
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    }
    else {
        cb(new Error('Only .jpg and .jpeg images are allowed'));
    }
};
const upload = (0, multer_1.default)({ storage, fileFilter });
// Routes
app.get('/', (req, res) => {
    (0, logger_1.logger)('Root route accessed');
    res.send('Hello from Express + TypeScript!');
});
app.get('/api', (_req, res) => {
    res.send('API working');
});
app.get('/route', (req, res) => {
    res.send('Hello from /route');
});
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res
            .status(400)
            .json({ message: 'No file uploaded or invalid file type' });
    }
    const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    (0, logger_1.logger)(`File uploaded: ${fileUrl}`);
    res.status(200).json({
        message: 'Upload successful',
        fileUrl,
    });
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, _next) => {
    console.error(err.message);
    res.status(400).json({ error: err.message });
});
// Start server
app.listen(PORT, () => {
    (0, logger_1.logger)(`Server running at http://localhost:${PORT}`);
});
