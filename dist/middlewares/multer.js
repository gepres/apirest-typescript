"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const shortid_1 = __importDefault(require("shortid"));
const configuracionMulter = {
    limits: { fileSize: 2000000 },
    storage: multer_1.default.diskStorage({
        destination: 'uploads',
        filename: (req, file, next) => {
            const extension = file.mimetype.split('/')[1];
            next(null, `${shortid_1.default.generate()}.${extension}`);
        }
    }),
    fileFilter(req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            // el callback se ejecuta como true o false | true cuando la imagen se acepta
            cb(null, true);
        }
        else {
            cb(new Error('Ese formato no es valido'), false);
        }
    }
};
exports.default = configuracionMulter;
