"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = __importDefault(require("../../controllers/paymentController"));
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const checkRole_1 = require("../../middlewares/checkRole");
const router = (0, express_1.Router)();
router.get("/revenue", verifyToken_1.default, paymentController_1.default.getRevenue);
router.patch("/:id/cod-confirm/:adminId", verifyToken_1.default, (0, checkRole_1.checkRole)(["admin"]), paymentController_1.default.confirmCodPaymentReceived);
exports.default = router;
