"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const checkRole_1 = require("../../middlewares/checkRole");
const voucherController_1 = __importDefault(require("../../controllers/voucherController"));
const router = (0, express_1.Router)();
router.post("/", verifyToken_1.default, (0, checkRole_1.checkRole)(["admin"]), voucherController_1.default.createVoucher);
router.put("/:voucherId", verifyToken_1.default, voucherController_1.default.updateVoucherById);
router.delete("/:voucherId", verifyToken_1.default, voucherController_1.default.deleteVoucherById);
router.get("/", verifyToken_1.default, voucherController_1.default.getVouchers);
router.get("/:voucherId", verifyToken_1.default, voucherController_1.default.getVoucherById);
router.patch("/:voucherId/active", verifyToken_1.default, voucherController_1.default.toggleVoucherActive);
exports.default = router;
