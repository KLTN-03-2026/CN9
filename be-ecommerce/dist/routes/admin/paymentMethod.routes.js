"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const checkRole_1 = require("../../middlewares/checkRole");
const paymentMethodController_1 = __importDefault(require("../../controllers/paymentMethodController"));
const router = (0, express_1.Router)();
router.get("/", verifyToken_1.default, paymentMethodController_1.default.getAllPaymentMethods);
router.post("/", verifyToken_1.default, (0, checkRole_1.checkRole)(["admin"]), paymentMethodController_1.default.createPaymentMethod);
router.get("/:id", verifyToken_1.default, paymentMethodController_1.default.getPaymentMethodById);
router.patch("/:id/toggle", verifyToken_1.default, (0, checkRole_1.checkRole)(["admin"]), paymentMethodController_1.default.toggleActivePaymentMethod);
router.put("/:id", verifyToken_1.default, (0, checkRole_1.checkRole)(["admin"]), paymentMethodController_1.default.updatePaymentMethodById);
router.delete("/:id", verifyToken_1.default, (0, checkRole_1.checkRole)(["admin"]), paymentMethodController_1.default.deletePaymentMethodById);
exports.default = router;
