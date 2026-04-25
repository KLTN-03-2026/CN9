"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const roleValidation = (data) => {
    const errors = {};
    if (!data.name_role) {
        errors.name_role = "Vui lòng nhập tên của role";
    }
    if (!data.description) {
        errors.description = "Vui lòng nhập mô tả về role của bạn";
    }
    if (data.permissions.length === 0) {
        errors.permissions = "Vui lòng chọn permission cho role";
    }
    return errors;
};
exports.default = roleValidation;
