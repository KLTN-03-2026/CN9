"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ai_controller_1 = require("../../controllers/ai.controller");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const rateLimiter_config_1 = require("../../config/rateLimiter.config");
const router = express_1.default.Router();
router.post("/search", verifyToken_1.default, rateLimiter_config_1.aiLimiter, ai_controller_1.aiSearch);
exports.default = router;
