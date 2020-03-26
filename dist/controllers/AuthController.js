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
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { check, body, validationResult } = require('express-validator');
function createToken(user) {
    return jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.SECRET_KEY || '', { expiresIn: '1h' });
}
exports.default = {
    signup: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const erroresExpress = validationResult(req);
        if (!erroresExpress.isEmpty()) {
            const errExp = erroresExpress.errors.map((err) => err.msg);
            res.status(400).json(errExp);
            return;
        }
        const uservalidator = yield User_1.default.findOne({ email: req.body.email });
        if (uservalidator)
            return res.status(400).json({ error: 'Usuario ya existe' });
        try {
            const user = new User_1.default(req.body);
            user.password = yield user.encryptPassword(user.password);
            const savedUser = yield user.save();
            // usuario y pass correcto firmar el token
            const token = createToken(savedUser);
            res.header('auth-token', token).json(token);
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }),
    signin: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const erroresExpress = validationResult(req);
        if (!erroresExpress.isEmpty()) {
            const errExp = erroresExpress.errors.map((err) => err.msg);
            res.status(400).json(errExp);
            return;
        }
        try {
            const user = yield User_1.default.findOne({ email: req.body.email });
            if (!user) {
                return res.status(400).json({ error: 'Usuario Incorrecto' });
            }
            const validatePass = yield user.validatePassword(req.body.password);
            if (!validatePass) {
                return res.status(400).json({ error: 'contraseña Incorrecta' });
            }
            const token = createToken(user);
            res.header('auth-token', token).json(token);
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }),
    validateUser: [
        body('username').escape(),
        body('password').escape(),
        check('username', 'El nombre de usuario es olbigatorio').notEmpty(),
        check('username', 'El nombre tiene que tener más de 4 caracteres').isLength({ min: 4 }),
        check('email', 'El email es olbigatorio').isEmail(),
        check('password', 'La contraseña es obligatoria').notEmpty(),
        check('password', 'La contraseña tiene que tener más de 4 caracteres').isLength({ min: 4 })
    ],
    validateLogin: [
        body('password').escape(),
        check('email', 'El email es olbigatorio').isEmail(),
        check('password', 'La contraseña es obligatoria').notEmpty(),
        check('password', 'La contraseña tiene que tener más de 4 caracteres').isLength({ min: 4 })
    ]
};
