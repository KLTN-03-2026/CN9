"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const cartController_1 = __importDefault(require("../../controllers/cartController"));
const router = (0, express_1.Router)();
router.get("/", verifyToken_1.default, cartController_1.default.getProductsToCart);
exports.default = router;
