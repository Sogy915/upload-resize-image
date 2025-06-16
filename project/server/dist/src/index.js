"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const logger_1 = require("./utilities/logger");
const sharp_1 = __importDefault(require("./routes/sharp"));
const multerUpload_1 = __importDefault(require("./routes/multerUpload"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = 3000;
console.log("Server is running on port ${PORT}np");
app.use(express_1.default.static(path_1.default.join(__dirname, '../../client/public')));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.use('/resizes', express_1.default.static(path_1.default.join(__dirname, '../resizes')));
path_1.default.join(__dirname, 'uploads');
// Middleware
app.use(logger_1.requestLogger);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Ensure uploads folder exists (optional to remove if not needed)
const uploadFolder = path_1.default.join(__dirname, 'uploads');
if (!fs_1.default.existsSync(uploadFolder)) {
    fs_1.default.mkdirSync(uploadFolder);
}
// Serve static uploaded files (optional to remove if not needed)
app.use('/uploads', express_1.default.static(uploadFolder));
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'http://127.0.0.1:8080'],
    methods: ['GET', 'POST']
}));
// Routes
app.get('/', (req, res) => {
    (0, logger_1.logger)('Root route accessed');
    res.send('Hello from Express + TypeScript!');
});
app.get('/api', (req, res) => {
    res.send('API working');
});
app.get('/route', (req, res) => {
    res.send('Hello from /route');
});
app.use('/api/images', sharp_1.default);
app.use('/api', multerUpload_1.default);
app.get('/test', (req, res) => {
    console.log('✅ test route hit!');
    res.send('test works');
});
// Error handling middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, _next) => {
    console.error(err.message);
    res.status(400).json({ error: err.message });
});
// Start server
app.listen(PORT, () => {
    (0, logger_1.logger)(`Server running at http://localhost:${PORT}`);
});
exports.default = app;
