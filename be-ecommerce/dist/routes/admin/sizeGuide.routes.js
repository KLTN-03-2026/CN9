"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sizeGuideController_1 = __importDefault(require("../../controllers/sizeGuideController"));
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const router = (0, express_1.Router)();
router.post("/", verifyToken_1.default, sizeGuideController_1.default.createSizeGuide);
router.get("/category/:categoryId", verifyToken_1.default, sizeGuideController_1.default.getSizeGuideByCategory);
router.put("/:sizeGuideId/measurement/:sizeMeasurementId", verifyToken_1.default, sizeGuideController_1.default.updateSizeGuideById);
router.get("/:sizeGuideId", verifyToken_1.default, sizeGuideController_1.default.getSizeGuideByIdSizeMeasurement);
exports.default = router;
