"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = __importDefault(require("../../controllers/orderController"));
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const upload_1 = require("../../middlewares/upload");
const rateLimiter_config_1 = require("../../config/rateLimiter.config");
const router = (0, express_1.Router)();
router.post("/", rateLimiter_config_1.orderLimiter, orderController_1.default.createOrder);
router.get("/my-orders", verifyToken_1.default, orderController_1.default.getMyOrders);
router.get("/:orderId", verifyToken_1.default, orderController_1.default.getOrderById);
router.patch("/:orderId/confirm-received", verifyToken_1.default, orderController_1.default.confirmOrderReceived);
router.patch("/:orderId/cancel", verifyToken_1.default, orderController_1.default.cancelOrderByUserId);
router.patch("/:orderItemId/return", verifyToken_1.default, upload_1.uploadImageReturnOrder.array("iamgesReturn"), orderController_1.default.returnOrderByUserId);
exports.default = router;
