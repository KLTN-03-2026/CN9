"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const checkRole_1 = require("../../middlewares/checkRole");
const reviewController_1 = __importDefault(require("../../controllers/reviewController"));
const router = (0, express_1.Router)();
router.get("/", verifyToken_1.default, (0, checkRole_1.checkRole)(["admin"]), reviewController_1.default.getAllReviews);
router.get("/pending", verifyToken_1.default, reviewController_1.default.getPendingReviews);
router.get("/:id", verifyToken_1.default, (0, checkRole_1.checkRole)(["admin"]), reviewController_1.default.getReviewById);
router.delete("/:id", verifyToken_1.default, (0, checkRole_1.checkRole)(["admin"]), reviewController_1.default.deleteReviewById);
router.patch("/:id/moderate", verifyToken_1.default, (0, checkRole_1.checkRole)(["admin"]), reviewController_1.default.moderateReview);
router.patch("/:id/reply", verifyToken_1.default, (0, checkRole_1.checkRole)(["admin"]), reviewController_1.default.replyToReview);
exports.default = router;
