"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryController_1 = __importDefault(require("../../controllers/categoryController"));
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const checkRole_1 = require("../../middlewares/checkRole");
const upload_1 = require("../../middlewares/upload");
const router = (0, express_1.Router)();
router.get("/top-selling", categoryController_1.default.getTopSellingCategories);
router.get("/", verifyToken_1.default, categoryController_1.default.getCategories);
router.get("/:categoryId", verifyToken_1.default, categoryController_1.default.getCategoryById);
router.post("/", verifyToken_1.default, (0, checkRole_1.checkRole)(["admin"]), upload_1.uploadCoverCategory.single("imageCategory"), categoryController_1.default.createCategory);
router.put("/:categoryId", verifyToken_1.default, (0, checkRole_1.checkRole)(["admin"]), upload_1.uploadCoverCategory.single("imageCategory"), categoryController_1.default.updateCategoryById);
router.delete("/:categoryId", verifyToken_1.default, (0, checkRole_1.checkRole)(["admin"]), categoryController_1.default.deleteCategoryById);
exports.default = router;
