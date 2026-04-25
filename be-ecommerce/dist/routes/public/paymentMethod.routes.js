"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const paymentMethodController_1 = __importDefault(require("../../controllers/paymentMethodController"));
const router = (0, express_1.Router)();
router.get("/", verifyToken_1.default, paymentMethodController_1.default.getAllPaymentMethods);
router.get("/active", paymentMethodController_1.default.getActivePaymentMethods);
exports.default = router;
