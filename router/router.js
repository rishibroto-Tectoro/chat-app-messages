"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = exports.storage = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
const multer_1 = __importDefault(require("multer"));
const randomstring_1 = __importDefault(require("randomstring"));
const path_1 = __importDefault(require("path"));
const controller = __importStar(require("../controller/controller"));
exports.storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, randomstring_1.default.generate({ charset: "alphanumeric", length: 10 }) + path_1.default.extname(file === null || file === void 0 ? void 0 : file.originalname));
    },
});
exports.uploadFile = (0, multer_1.default)({
    storage: exports.storage,
    limits: {
        fileSize: 1000000,
    },
    fileFilter: (req, file, cb) => {
        console.log('file2', file);
        // if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'text/plain') {
        //     console.log("file", file.mimetype)
        //     cb(null, true)
        // } else {
        //     cb(null, false)
        //     return cb(new Error('Only .tiff and .png format allowed!'))
        // }
        cb(null, true);
    },
});
router.post('/save', controller.add);
router.post('/uploadFile', exports.uploadFile.single('file'), controller.CreateBucket);
exports.default = router;
