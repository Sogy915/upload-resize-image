"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, 'uploads');
    },
    filename: function (_req, file, cb) {
        const ext = path_1.default.extname(file.originalname);
        const name = path_1.default.basename(file.originalname, ext);
        cb(null, `${name}-${Date.now()}${ext}`);
    },
});
const fileFilter = (_req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.originalname.endsWith('.jpg')) {
        cb(null, true);
    }
    else {
        cb(new Error('Only .jpg files are allowed!'));
    }
};
exports.upload = (0, multer_1.default)({ storage, fileFilter });
