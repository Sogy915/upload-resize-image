"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = requestLogger;
exports.logger = logger;
function requestLogger(req, res, next) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl} was requested`);
    next();
}
function logger(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [LOG]: ${message}`);
}
