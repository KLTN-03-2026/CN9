"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../../controllers/userController"));
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const upload_1 = require("../../middlewares/upload");
const rateLimiter_config_1 = require("../../config/rateLimiter.config");
const router = (0, express_1.Router)();
router.post("/", rateLimiter_config_1.authLimiter, userController_1.default.createUser);
router.get("/", verifyToken_1.default, userController_1.default.getUserById);
router.put("/", verifyToken_1.default, upload_1.uploadAvatarUser.single("avatarUser"), userController_1.default.updateUserById);
exports.default = router;
