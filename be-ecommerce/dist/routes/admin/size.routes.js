"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const sizeController_1 = __importDefault(require("../../controllers/sizeController"));
const router = (0, express_1.Router)();
router.get("/", verifyToken_1.default, sizeController_1.default.getSizes);
router.post("/", verifyToken_1.default, sizeController_1.default.createSize);
router.put("/:sizeId", verifyToken_1.default, sizeController_1.default.updateSizeById);
router.delete("/:sizeId", verifyToken_1.default, sizeController_1.default.deleteSizeById);
exports.default = router;
