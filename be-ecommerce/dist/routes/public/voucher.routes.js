"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const voucherController_1 = __importDefault(require("../../controllers/voucherController"));
const router = (0, express_1.Router)();
router.get("/:code", verifyToken_1.default, voucherController_1.default.getVoucherByCode);
exports.default = router;
