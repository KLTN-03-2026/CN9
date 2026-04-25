"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const checkRole_1 = require("../../middlewares/checkRole");
const returnController_1 = __importDefault(require("../../controllers/returnController"));
const router = (0, express_1.Router)();
router.put("/:returnId/", verifyToken_1.default, (0, checkRole_1.checkRole)(["admin"]), returnController_1.default.approveReturnByAdminId);
exports.default = router;
