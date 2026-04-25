"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productVariantValidation = exports.productValidation = void 0;
const productValidation = (data) => {
    const errors = {};
    if (!data.name_product) {
        errors.name_product = "Vui lòng nhập tên sản phẩm";
    }
    if (!data.price) {
        errors.price = "Vui lòng nhập giá sản phẩm";
    }
    if (data.price && data.price <= 0) {
        errors.price = "Giá sản phẩm phải lớn hơn 0";
    }
    return errors;
};
exports.productValidation = productValidation;
const productVariantValidation = (data) => {
    const errors = {};
    if (!data.productId) {
        errors.productId = "Vui lòng chọn sản phẩm";
    }
    if (data.stock === undefined || data.stock === null) {
        errors.stock = "Vui lòng nhập số lượng tồn kho";
    }
    if (data.stock && data.stock < 0) {
        errors.stock = "Số lượng tồn kho không được âm";
    }
    return errors;
};
exports.productVariantValidation = productVariantValidation;
