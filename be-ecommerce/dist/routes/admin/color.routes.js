"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const colorController_1 = __importDefault(require("../../controllers/colorController"));
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const checkRole_1 = require("../../middlewares/checkRole");
const router = (0, express_1.Router)();
router.get("/", verifyToken_1.default, colorController_1.default.getColors);
router.post("/", verifyToken_1.default, (0, checkRole_1.checkRole)(["admin"]), colorController_1.default.createColor);
router.put("/:colorId", verifyToken_1.default, (0, checkRole_1.checkRole)(["admin"]), colorController_1.default.updateColorById);
router.delete("/:colorId", verifyToken_1.default, (0, checkRole_1.checkRole)(["admin"]), colorController_1.default.deleteColorById);
exports.default = router;
