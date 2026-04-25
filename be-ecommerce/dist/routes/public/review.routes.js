"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const upload_1 = require("../../middlewares/upload");
const reviewController_1 = __importDefault(require("../../controllers/reviewController"));
const router = (0, express_1.Router)();
router.post("/", verifyToken_1.default, upload_1.uploadImageReview.array("reivewImage"), reviewController_1.default.createReview);
router.get("/my-reviews", verifyToken_1.default, reviewController_1.default.getMyReviews);
router.get("/product/:productId", verifyToken_1.default, reviewController_1.default.getReviewsByProductId);
router.patch("/:id/approve", verifyToken_1.default, reviewController_1.default.approveReview);
exports.default = router;
