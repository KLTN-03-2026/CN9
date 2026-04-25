"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const saleController_1 = __importDefault(require("../../controllers/saleController"));
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const checkRole_1 = require("../../middlewares/checkRole");
const router = (0, express_1.Router)();
router.patch("/:id/active", verifyToken_1.default, saleController_1.default.toggleSaleActive);
router.get("/", verifyToken_1.default, (0, checkRole_1.checkRole)(["admin"]), saleController_1.default.getAllSales);
router.get("/active", verifyToken_1.default, saleController_1.default.getActiveSales);
router.get("/:id", verifyToken_1.default, saleController_1.default.getSaleById);
router.post("/", verifyToken_1.default, (0, checkRole_1.checkRole)(["admin"]), saleController_1.default.createSale);
router.put("/:id", verifyToken_1.default, saleController_1.default.updateSaleById);
router.delete("/:id", verifyToken_1.default, (0, checkRole_1.checkRole)(["admin"]), saleController_1.default.deleteSaleById);
exports.default = router;
