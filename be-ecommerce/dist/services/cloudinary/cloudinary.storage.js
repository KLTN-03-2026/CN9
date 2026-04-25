"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCloudinaryStorage = void 0;
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_config_1 = __importDefault(require("../../config/cloudinary.config"));
const createCloudinaryStorage = ({ folder }) => new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_config_1.default,
    params: async (req, file) => {
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(2, 15);
        return {
            folder,
            allowed_formats: ["jpg", "png", "jpeg", "webp", "gif", "bmp"],
            public_id: `${folder}_${timestamp}_${randomId}`,
        };
    },
});
exports.createCloudinaryStorage = createCloudinaryStorage;
