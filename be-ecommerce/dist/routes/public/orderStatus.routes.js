"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const orderStatusController_1 = __importDefault(require("../../controllers/orderStatusController"));
const router = (0, express_1.Router)();
router.get("/", verifyToken_1.default, orderStatusController_1.default.getAllOrderStatuses);
exports.default = router;
