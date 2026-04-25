"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = __importDefault(require("../../controllers/productController"));
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const upload_1 = require("../../middlewares/upload");
const checkRole_1 = require("../../middlewares/checkRole");
const router = (0, express_1.Router)();
router.get("/search", verifyToken_1.default, productController_1.default.searchProduct);
router.get("/", verifyToken_1.default, productController_1.default.getAllProducts);
router.get("/:productId", verifyToken_1.default, productController_1.default.getProductById);
router.post("/", verifyToken_1.default, 
// checkRole(["admin"]),
upload_1.uploadProductCovers.array("productCover"), productController_1.default.createProduct);
router.put("/:productId", verifyToken_1.default, (0, checkRole_1.checkRole)(["admin"]), upload_1.uploadProductCovers.array("productCover"), productController_1.default.updateProductById);
router.delete("/:id", verifyToken_1.default, (0, checkRole_1.checkRole)(["admin"]), productController_1.default.deleteProductById);
router.get("/:productId/variants", productController_1.default.getProductVariants);
router.post("/:productId/variants", verifyToken_1.default, (0, checkRole_1.checkRole)(["admin"]), upload_1.uploadVarianttCover.single("variantCover"), productController_1.default.createProductVariant);
router.put("/:productId/variants/:id", verifyToken_1.default, (0, checkRole_1.checkRole)(["admin"]), upload_1.uploadVarianttCover.single("variantCover"), productController_1.default.updateProductVariantById);
router.delete("/:productId/variants/:id", verifyToken_1.default, (0, checkRole_1.checkRole)(["admin"]), productController_1.default.deleteProductVariantById);
exports.default = router;
