"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../../controllers/authController"));
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const rateLimiter_config_1 = require("../../config/rateLimiter.config");
const router = (0, express_1.Router)();
router.post("/login", rateLimiter_config_1.authLimiter, authController_1.default.loginUser);
router.post("/logout", authController_1.default.logout);
router.get("/me", verifyToken_1.default, authController_1.default.getInfoUser);
router.get("/verify-email", rateLimiter_config_1.verifyEmailLimiter, authController_1.default.verifyEmail);
exports.default = router;
