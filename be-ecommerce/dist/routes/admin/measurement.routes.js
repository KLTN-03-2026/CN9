"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const measurementController_1 = __importDefault(require("../../controllers/measurementController"));
const router = (0, express_1.Router)();
router.post("/", verifyToken_1.default, measurementController_1.default.createMeasurement);
router.get("/", verifyToken_1.default, measurementController_1.default.getAllMeasurement);
router.get("/:measurementId", verifyToken_1.default, measurementController_1.default.getMeasurementById);
router.put("/:measurementId", verifyToken_1.default, measurementController_1.default.updateMeasurementById);
router.delete("/:measurementId", verifyToken_1.default, measurementController_1.default.deleteMeasurementById);
exports.default = router;
