"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const photo_1 = __importDefault(require("./routes/photo"));
const auth_1 = __importDefault(require("./routes/auth"));
// initilization
const app = express_1.default();
// settings
app.set('port', process.env.PORT || 3000);
// middlewares
app.use(morgan_1.default('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// routes
app.use('/api/photo', photo_1.default);
app.use('/api/auth', auth_1.default);
// folder storage public files
app.use('/uploads', express_1.default.static(path_1.default.resolve('uploads')));
exports.default = app;
