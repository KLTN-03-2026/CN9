"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const reviewModel_1 = __importDefault(require("../models/reviewModel"));
const reviewValidation_1 = require("../validation/reviewValidation");
const paginate_1 = require("../utils/paginate");
const createReview = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Vui lòng đăng nhập" });
        }
        const { rating, comment, orderItemId, productId } = req.body || {};
        if (!rating || !orderItemId || !productId) {
            return res.status(400).json({ message: "Dữ liệu không đầy đủ" });
        }
        const files = req.files;
        if (files && files.length > 0) {
            const image_urls = files.map((file) => file.path);
            const reviewData = {
                userId,
                rating: parseInt(rating),
                comment,
                orderItemId: parseInt(orderItemId),
                productId: parseInt(productId),
                images: JSON.stringify(image_urls),
            };
            const errors = (0, reviewValidation_1.reviewValidation)(reviewData);
            if (Object.keys(errors).length > 0) {
                return res
                    .status(400)
                    .json({ message: "Dữ liệu không hợp lệ", errors });
            }
            const existingReview = await reviewModel_1.default.checkReview(userId, Number(orderItemId));
            if (existingReview) {
                return res
                    .status(400)
                    .json({ message: "Bạn đã đánh giá sản phẩm này rồi" });
            }
            const review = await reviewModel_1.default.createReview(reviewData);
            return res
                .status(201)
                .json({ message: "Tạo đánh giá thành công", data: review });
        }
        else {
            return res
                .status(400)
                .json({ message: "Vui lòng tải lên ít nhất một hình ảnh" });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const getAllReviews = async (req, res) => {
    try {
        const { page, limit, skip } = (0, paginate_1.getPaginationParams)(req.query);
        const { data, total } = await reviewModel_1.default.getAllReviews(skip, limit);
        return res.status(200).json({
            message: "Lấy danh sách đánh giá thành công",
            ...(0, paginate_1.buildPaginatedResponse)(data, total, page, limit),
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const getReviewById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (!id) {
            return res.status(400).json({ message: "ID đánh giá không hợp lệ" });
        }
        const review = await reviewModel_1.default.getReviewById(id);
        if (!review) {
            return res.status(404).json({ message: "Không tìm thấy đánh giá" });
        }
        return res
            .status(200)
            .json({ message: "Lấy thông tin đánh giá thành công", data: review });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const getReviewsByProductId = async (req, res) => {
    try {
        const productId = parseInt(req.params.productId);
        if (!productId) {
            return res.status(400).json({ message: "ID sản phẩm không hợp lệ" });
        }
        const reviews = await reviewModel_1.default.getReviewsByProductId(productId);
        return res
            .status(200)
            .json({ message: "Lấy đánh giá sản phẩm thành công", data: reviews });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const getMyReviews = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Vui lòng đăng nhập" });
        }
        const reviews = await reviewModel_1.default.getReviewsByUserId(userId);
        return res
            .status(200)
            .json({ message: "Lấy đánh giá của bạn thành công", data: reviews });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const getPendingReviews = async (req, res) => {
    try {
        const reviews = await reviewModel_1.default.getPendingReviews();
        return res
            .status(200)
            .json({ message: "Lấy đánh giá chờ duyệt thành công", data: reviews });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const updateReviewById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (!id) {
            return res.status(400).json({ message: "ID đánh giá không hợp lệ" });
        }
        const existingReview = await reviewModel_1.default.getReviewById(id);
        if (!existingReview) {
            return res.status(404).json({ message: "Không tìm thấy đánh giá" });
        }
        const { rating, comment, is_approved, approved_by } = req.body || {};
        const updateData = {};
        if (rating !== undefined)
            updateData.rating = parseInt(rating);
        if (comment !== undefined)
            updateData.comment = comment;
        if (is_approved !== undefined)
            updateData.is_approved = Boolean(is_approved);
        if (approved_by !== undefined)
            updateData.approved_by = parseInt(approved_by);
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });
        }
        const errors = (0, reviewValidation_1.updateReviewValidation)(updateData);
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
        }
        const review = await reviewModel_1.default.updateReviewById(id, updateData);
        return res
            .status(200)
            .json({ message: "Cập nhật đánh giá thành công", data: review });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const approveReview = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const adminId = req.user?.id;
        if (!id) {
            return res.status(400).json({ message: "ID đánh giá không hợp lệ" });
        }
        if (!adminId) {
            return res.status(401).json({ message: "Vui lòng đăng nhập" });
        }
        const existingReview = await reviewModel_1.default.getReviewById(id);
        if (!existingReview) {
            return res.status(404).json({ message: "Không tìm thấy đánh giá" });
        }
        const review = await reviewModel_1.default.updateReviewById(id, {
            is_approved: true,
            approved_by: adminId,
        });
        return res
            .status(200)
            .json({ message: "Duyệt đánh giá thành công", data: review });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const deleteReviewById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (!id) {
            return res.status(400).json({ message: "ID đánh giá không hợp lệ" });
        }
        const existingReview = await reviewModel_1.default.getReviewById(id);
        if (!existingReview) {
            return res.status(404).json({ message: "Không tìm thấy đánh giá" });
        }
        await reviewModel_1.default.deleteReviewById(id);
        return res.status(200).json({ message: "Xóa đánh giá thành công" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const moderateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { adminId, status } = req.body || {};
        if (!id || !adminId || !status) {
            return res.status(400).json({
                message: "Missing required fields",
            });
        }
        if (!["APPROVED", "REJECTED"].includes(status)) {
            return res.status(400).json({
                message: "Invalid status",
            });
        }
        const review = await reviewModel_1.default.moderateReview(Number(id), Number(adminId), status);
        return res.status(200).json({
            message: review.status === "APPROVED"
                ? "Chấp nhận review này"
                : "Từ chối review này",
            data: review,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message || "Internal server error",
        });
    }
};
const replyToReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { adminId, content } = req.body || {};
        if (!id || !adminId || !content) {
            return res.status(400).json({
                message: "Missing required fields",
            });
        }
        const review = await reviewModel_1.default.replyToReview(Number(id), Number(adminId), content);
        return res.status(200).json({
            message: "Trả lời đánh giá thành công",
            data: review,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message || "Internal server error",
        });
    }
};
const reviewController = {
    getMyReviews,
    createReview,
    replyToReview,
    getAllReviews,
    getReviewById,
    approveReview,
    moderateReview,
    updateReviewById,
    deleteReviewById,
    getPendingReviews,
    getReviewsByProductId,
};
exports.default = reviewController;
