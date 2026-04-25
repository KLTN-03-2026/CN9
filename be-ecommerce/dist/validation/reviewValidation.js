"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReviewValidation = exports.reviewValidation = void 0;
const reviewValidation = (data) => {
    const errors = {};
    if (!data.userId || isNaN(data.userId)) {
        errors.userId = "ID người dùng không hợp lệ";
    }
    if (!data.rating ||
        isNaN(data.rating) ||
        data.rating < 1 ||
        data.rating > 5) {
        errors.rating = "Đánh giá phải từ 1 đến 5 sao";
    }
    if (data.comment && data.comment.trim().length > 1000) {
        errors.comment = "Bình luận không được quá 1000 ký tự";
    }
    return errors;
};
exports.reviewValidation = reviewValidation;
const updateReviewValidation = (data) => {
    const errors = {};
    if (data.rating !== undefined &&
        (isNaN(data.rating) || data.rating < 1 || data.rating > 5)) {
        errors.rating = "Đánh giá phải từ 1 đến 5 sao";
    }
    if (data.comment !== undefined &&
        data.comment &&
        data.comment.trim().length > 1000) {
        errors.comment = "Bình luận không được quá 1000 ký tự";
    }
    return errors;
};
exports.updateReviewValidation = updateReviewValidation;
