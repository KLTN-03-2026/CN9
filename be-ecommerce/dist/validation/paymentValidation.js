"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePaymentValidation = exports.paymentValidation = void 0;
const validStatuses = [
    "pending",
    "processing",
    "success",
    "failed",
    "refunded",
];
const paymentValidation = (data) => {
    const errors = {};
    if (!data.orderId || isNaN(data.orderId) || data.orderId <= 0) {
        errors.orderId = "ID đơn hàng không hợp lệ";
    }
    if (!data.amount || isNaN(data.amount) || data.amount <= 0) {
        errors.amount = "Số tiền phải lớn hơn 0";
    }
    if (!data.payment_method ||
        isNaN(data.payment_method) ||
        data.payment_method <= 0) {
        errors.payment_method = "Phương thức thanh toán không hợp lệ";
    }
    return errors;
};
exports.paymentValidation = paymentValidation;
const updatePaymentValidation = (data) => {
    const errors = {};
    if (data.amount !== undefined && (isNaN(data.amount) || data.amount <= 0)) {
        errors.amount = "Số tiền phải lớn hơn 0";
    }
    if (data.payment_method !== undefined &&
        (isNaN(data.payment_method) || data.payment_method <= 0)) {
        errors.payment_method = "Phương thức thanh toán không hợp lệ";
    }
    if (data.status !== undefined && !validStatuses.includes(data.status)) {
        errors.status = "Trạng thái thanh toán không hợp lệ";
    }
    if (data.transaction_reference !== undefined &&
        data.transaction_reference &&
        data.transaction_reference.length > 255) {
        errors.transaction_reference = "Mã giao dịch không được quá 255 ký tự";
    }
    return errors;
};
exports.updatePaymentValidation = updatePaymentValidation;
