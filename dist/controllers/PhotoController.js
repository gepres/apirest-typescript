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
const multer_1 = __importDefault(require("multer"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const Photo_1 = __importDefault(require("../models/Photo"));
const multer_2 = __importDefault(require("../middlewares/multer"));
const { check, body, validationResult } = require('express-validator');
const cloudinary = require('cloudinary').v2;
const upload = multer_1.default(multer_2.default).single('imagen');
exports.default = {
    subirImagen: (req, res, next) => {
        upload(req, res, function (error) {
            if (error) {
                // console.log(error);
                if (error instanceof multer_1.default.MulterError) {
                    if (error.code === 'LIMIT_FILE_SIZE') {
                        res.status(400).json({ 'error': 'El archivo es muy grande' });
                    }
                    else {
                        res.status(400).json({ 'error': error.message });
                    }
                }
                else if (error.hasOwnProperty('message')) {
                    res.status(400).json({ 'error': error.message });
                }
                return;
            }
            else {
                next();
            }
        });
    },
    lista: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const photos = yield Photo_1.default.find({}).populate('author', ['username', 'email']);
            res.json(photos);
        }
        catch (error) {
            console.log(error);
        }
    }),
    query: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const photo = yield Photo_1.default.findById(req.params.id);
        return res.json(photo);
    }),
    add: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        yield cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
        const erroresExpress = validationResult(req);
        if (!erroresExpress.isEmpty()) {
            const errExp = erroresExpress.errors.map((err) => err.msg);
            res.status(400).json(errExp);
            return;
        }
        if (!req.file) {
            res.status(400).json({ 'error': 'La imagen es obligatoria' });
            return;
        }
        try {
            const { title, description } = req.body;
            const result = yield cloudinary.uploader.upload(req.file.path, {
                folder: 'typescript/books'
            });
            const newPhoto = {
                title: title,
                description: description,
                image_url: result.url,
                public_id: result.public_id,
                author: req.userId
            };
            const photo = new Photo_1.default(newPhoto);
            yield photo.save();
            yield fs_extra_1.default.unlink(req.file.path);
            return res.json({
                mensaje: 'Foto guadada.',
                photo
            });
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }),
    update: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const erroresExpress = validationResult(req);
        if (!erroresExpress.isEmpty()) {
            const errExp = erroresExpress.errors.map((err) => err.msg);
            res.status(400).json(errExp);
            return;
        }
        try {
            yield cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET
            });
            const photoAnterior = yield Photo_1.default.findOne({ _id: req.params.id });
            // construir un nuevo producto
            let photoNueva = req.body;
            // verificar si hay imagen nueva
            if (req.file) {
                const result = yield cloudinary.uploader.upload(req.file.path, {
                    folder: 'typescript/books'
                });
                yield cloudinary.uploader.destroy(photoAnterior.public_id);
                photoNueva.image_url = result.url,
                    photoNueva.public_id = result.public_id;
                yield fs_extra_1.default.unlink(req.file.path);
            }
            yield Photo_1.default.findOneAndUpdate({ _id: req.params.id }, photoNueva);
            return res.status(200).json({
                mensaje: 'Producto Actualizado'
            });
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }),
    remove: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const photo = yield Photo_1.default.findByIdAndDelete(req.params.id);
        if (!photo) {
            res.json({
                mensaje: 'Ese Producto no existe'
            });
            return next();
        }
        yield cloudinary.uploader.destroy(photo.public_id);
        return res.status(200).json({
            mensaje: 'Foto Eliminada'
        });
    }),
    validatePhoto: [
        body('title').escape(),
        body('description').escape(),
        check('title', 'El titulo es olbigatorio').notEmpty(),
        check('description', 'La descripción es obligatorio').notEmpty()
    ]
};
