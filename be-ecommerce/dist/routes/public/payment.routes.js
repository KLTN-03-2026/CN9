"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = __importDefault(require("../../controllers/paymentController"));
const rateLimiter_config_1 = require("../../config/rateLimiter.config");
const router = (0, express_1.Router)();
router.get("/payment-resultVNPAY", paymentController_1.default.resultVnPay);
router.post("/vnpay", rateLimiter_config_1.orderLimiter, paymentController_1.default.createVNPayUrl);
router.post("/cod", rateLimiter_config_1.orderLimiter, paymentController_1.default.createPayment);
exports.default = router;
