"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Photos = new mongoose_1.Schema({
    title: {
        type: String,
        trim: true,
        lowercase: true,
        require: [true, 'Agrega el titulo']
    },
    description: {
        type: String,
        trim: true
    },
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    image_url: String,
    public_id: {
        type: String,
        unique: true
    },
    create_at: {
        type: Date,
        default: Date.now
    }
});
exports.default = mongoose_1.model('Photo', Photos);
