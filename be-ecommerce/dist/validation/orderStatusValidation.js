"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatusValidation = exports.orderStatusValidation = void 0;
const orderStatusValidation = (data) => {
    const errors = {};
    if (!data.name || data.name.trim().length === 0) {
        errors.name = "Tên trạng thái đơn hàng không được để trống";
    }
    if (data.sort_order !== undefined &&
        (isNaN(data.sort_order) || data.sort_order < 0)) {
        errors.sort_order = "Thứ tự sắp xếp phải là số không âm";
    }
    return errors;
};
exports.orderStatusValidation = orderStatusValidation;
const updateOrderStatusValidation = (data) => {
    const errors = {};
    if (data.name !== undefined &&
        (!data.name || data.name.trim().length === 0)) {
        errors.name = "Tên trạng thái đơn hàng không được để trống";
    }
    if (data.sort_order !== undefined &&
        (isNaN(data.sort_order) || data.sort_order < 0)) {
        errors.sort_order = "Thứ tự sắp xếp phải là số không âm";
    }
    return errors;
};
exports.updateOrderStatusValidation = updateOrderStatusValidation;
