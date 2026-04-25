"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const userBankAccountController_1 = __importDefault(require("../../controllers/userBankAccountController"));
const router = (0, express_1.Router)();
router.post("/", verifyToken_1.default, userBankAccountController_1.default.createUserBankAccount);
router.patch("/:id", verifyToken_1.default, userBankAccountController_1.default.togglePrimaryUserbankAccount);
router.get("/", verifyToken_1.default, userBankAccountController_1.default.getAllUserBankAccount);
exports.default = router;
