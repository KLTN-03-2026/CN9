"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const upload_1 = require("../../middlewares/upload");
const accountController_1 = __importDefault(require("../../controllers/accountController"));
const router = (0, express_1.Router)();
router.put("/", verifyToken_1.default, upload_1.uploadAvatarAccount.single("avatarAccount"), accountController_1.default.updateAccountById);
router.get("/", verifyToken_1.default, accountController_1.default.getAccountById);
exports.default = router;
