"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryController_1 = __importDefault(require("../../controllers/categoryController"));
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const router = (0, express_1.Router)();
router.get("/", verifyToken_1.default, categoryController_1.default.getCategories);
router.get("/:slug/products", categoryController_1.default.getProductBySlugCategory);
router.get("/:categoryId", categoryController_1.default.getCategoryById);
exports.default = router;
