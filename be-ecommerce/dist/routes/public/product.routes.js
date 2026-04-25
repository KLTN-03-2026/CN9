"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = __importDefault(require("../../controllers/productController"));
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const router = (0, express_1.Router)();
router.get("/", productController_1.default.getAllProducts);
router.get("/featured", productController_1.default.getFeaturedProducts);
router.get("/sale", productController_1.default.getSaleProducts);
router.get("/slug/:slug", productController_1.default.getProductBySlug);
router.get("/detail/:productId", verifyToken_1.default, productController_1.default.getProductById);
router.get("/search", productController_1.default.searchProduct);
router.post("/:productId/view", verifyToken_1.default, productController_1.default.createProductView);
exports.default = router;
