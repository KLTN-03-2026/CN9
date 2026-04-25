"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageOrderRefund = exports.uploadImageReturnOrder = exports.uploadImageReview = exports.uploadCoverCategory = exports.uploadAvatarUser = exports.uploadAvatarAccount = exports.uploadVarianttCover = exports.uploadProductCovers = void 0;
const multer_1 = __importDefault(require("multer"));
const cloudinary_storage_1 = require("../services/cloudinary/cloudinary.storage");
exports.uploadProductCovers = (0, multer_1.default)({
    storage: (0, cloudinary_storage_1.createCloudinaryStorage)({ folder: "productCover" }),
});
exports.uploadVarianttCover = (0, multer_1.default)({
    storage: (0, cloudinary_storage_1.createCloudinaryStorage)({ folder: "variantCover" }),
});
exports.uploadAvatarAccount = (0, multer_1.default)({
    storage: (0, cloudinary_storage_1.createCloudinaryStorage)({ folder: "avatar_account" }),
});
exports.uploadAvatarUser = (0, multer_1.default)({
    storage: (0, cloudinary_storage_1.createCloudinaryStorage)({ folder: "avatar_user" }),
});
exports.uploadCoverCategory = (0, multer_1.default)({
    storage: (0, cloudinary_storage_1.createCloudinaryStorage)({ folder: "category" }),
});
exports.uploadImageReview = (0, multer_1.default)({
    storage: (0, cloudinary_storage_1.createCloudinaryStorage)({ folder: "review" }),
});
exports.uploadImageReturnOrder = (0, multer_1.default)({
    storage: (0, cloudinary_storage_1.createCloudinaryStorage)({ folder: "returnOrder" }),
});
exports.uploadImageOrderRefund = (0, multer_1.default)({
    storage: (0, cloudinary_storage_1.createCloudinaryStorage)({ folder: "orderRefund" }),
});
