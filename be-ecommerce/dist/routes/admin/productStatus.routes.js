"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const productStatusController_1 = __importDefault(require("../../controllers/productStatusController"));
const router = (0, express_1.Router)();
router.get("/", verifyToken_1.default, productStatusController_1.default.getAllProductStatuses);
router.get("/:id", verifyToken_1.default, productStatusController_1.default.getProductStatusById);
router.post("/", verifyToken_1.default, productStatusController_1.default.createProductStatus);
router.put("/:id", verifyToken_1.default, productStatusController_1.default.updateProductStatusById);
router.delete("/:id", verifyToken_1.default, productStatusController_1.default.deleteProductStatusById);
exports.default = router;
