"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const refundController_1 = __importDefault(require("../../controllers/refundController"));
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const checkRole_1 = require("../../middlewares/checkRole");
const upload_1 = require("../../middlewares/upload");
const router = (0, express_1.Router)();
router.put("/:id/VNPAY", verifyToken_1.default, (0, checkRole_1.checkRole)(["admin"]));
router.put("/:id/", verifyToken_1.default, (0, checkRole_1.checkRole)(["admin"]), upload_1.uploadImageOrderRefund.single("imageRefund"), refundController_1.default.processManualRefund);
exports.default = router;
