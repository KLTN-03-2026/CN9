"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const checkRole_1 = require("../../middlewares/checkRole");
const orderStatusController_1 = __importDefault(require("../../controllers/orderStatusController"));
const router = (0, express_1.Router)();
router.post("/", verifyToken_1.default, orderStatusController_1.default.createOrderStatus);
router.get("/", verifyToken_1.default, orderStatusController_1.default.getAllOrderStatuses);
router.get("/:id", verifyToken_1.default, orderStatusController_1.default.getOrderStatusById);
router.put("/:id", verifyToken_1.default, (0, checkRole_1.checkRole)(["admin"]), orderStatusController_1.default.updateOrderStatusById);
router.delete("/:id", verifyToken_1.default, (0, checkRole_1.checkRole)(["admin"]), orderStatusController_1.default.deleteOrderStatusById);
exports.default = router;
