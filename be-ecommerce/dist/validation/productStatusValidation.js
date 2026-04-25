"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductStatusValidation = exports.productStatusValidation = void 0;
const productStatusValidation = (data) => {
    const errors = {};
    if (!data.name || data.name.trim() === "") {
        errors.name = "Tên trạng thái sản phẩm không được để trống";
    }
    if (data.name && data.name.length > 100) {
        errors.name = "Tên trạng thái sản phẩm không được quá 100 ký tự";
    }
    if (data.description && data.description.length > 500) {
        errors.description = "Mô tả không được quá 500 ký tự";
    }
    if (!data.hex) {
        errors.hex = "Màu không được để trống";
    }
    return errors;
};
exports.productStatusValidation = productStatusValidation;
const updateProductStatusValidation = (data) => {
    const errors = {};
    if (data.name !== undefined) {
        if (!data.name || data.name.trim() === "") {
            errors.name = "Tên trạng thái sản phẩm không được để trống";
        }
        if (data.name && data.name.length > 100) {
            errors.name = "Tên trạng thái sản phẩm không được quá 100 ký tự";
        }
    }
    if (data.description !== undefined &&
        data.description &&
        data.description.length > 500) {
        errors.description = "Mô tả không được quá 500 ký tự";
    }
    if (data.hex !== undefined) {
        errors.hex = "Màu không được để trống";
    }
    return errors;
};
exports.updateProductStatusValidation = updateProductStatusValidation;
