"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
const PhotoController_1 = __importDefault(require("../controllers/PhotoController"));
const verifyToken_1 = require("../middlewares/verifyToken");
router.get('/', PhotoController_1.default.lista);
router.get('/:id', PhotoController_1.default.query);
router.post('/', verifyToken_1.tokenValidation, PhotoController_1.default.subirImagen, PhotoController_1.default.validatePhoto, PhotoController_1.default.add);
router.put('/:id', verifyToken_1.tokenValidation, PhotoController_1.default.subirImagen, PhotoController_1.default.validatePhoto, PhotoController_1.default.update);
router.delete('/:id', verifyToken_1.tokenValidation, PhotoController_1.default.remove);
exports.default = router;
