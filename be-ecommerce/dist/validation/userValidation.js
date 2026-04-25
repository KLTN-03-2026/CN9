"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserValidation = exports.userValidation = void 0;
const userValidation = (data) => {
    const errors = {};
    if (!data.name || data.name.trim().length === 0) {
        errors.name = "Tên không được để trống";
    }
    if (!data.email || data.email.trim().length === 0) {
        errors.email = "Email không được để trống";
    }
    else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            errors.email = "Email không hợp lệ";
        }
    }
    if (!data.password || data.password.length < 6) {
        errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    if (data.phone && data.phone.trim().length > 0) {
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(data.phone.replace(/\s/g, ""))) {
            errors.phone = "Số điện thoại không hợp lệ";
        }
    }
    return errors;
};
exports.userValidation = userValidation;
const updateUserValidation = (data) => {
    const errors = {};
    if (data.name !== undefined &&
        (!data.name || data.name.trim().length === 0)) {
        errors.name = "Tên không được để trống";
    }
    if (data.phone !== undefined && data.phone && data.phone.trim().length > 0) {
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(data.phone.replace(/\s/g, ""))) {
            errors.phone = "Số điện thoại không hợp lệ";
        }
    }
    return errors;
};
exports.updateUserValidation = updateUserValidation;
