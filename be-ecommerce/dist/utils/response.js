"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unauthorized = exports.forbidden = exports.notFound = exports.badRequest = exports.serverError = exports.deletedNoContentData = exports.deletedData = exports.updatedData = exports.createdData = exports.getDatas = void 0;
/* ================== SUCCESS ================== */
const getDatas = (res, data, message = "Lấy dữ liệu thành công") => {
    const response = {
        success: true,
        message,
        data,
    };
    return res.status(200).json(response);
};
exports.getDatas = getDatas;
const createdData = (res, data, message = "Tạo dữ liệu thành công") => {
    const response = {
        success: true,
        message,
        data,
    };
    return res.status(201).json(response);
};
exports.createdData = createdData;
const updatedData = (res, data, message = "Cập nhật dữ liệu thành công") => {
    const response = {
        success: true,
        message,
        data,
    };
    return res.status(200).json(response);
};
exports.updatedData = updatedData;
const deletedData = (res, data, message = "Xóa dữ liệu thành công") => {
    const response = {
        success: true,
        message,
        data,
    };
    return res.status(200).json(response);
};
exports.deletedData = deletedData;
const deletedNoContentData = (res, message = "Xóa dữ liệu thành công") => {
    return res.status(200).json({
        success: true,
        message,
    });
};
exports.deletedNoContentData = deletedNoContentData;
/* ================== ERROR ================== */
const serverError = (res, message = "Lỗi server") => {
    return res.status(500).json({
        success: false,
        message,
    });
};
exports.serverError = serverError;
const badRequest = (res, message = "Dữ liệu không hợp lệ") => {
    return res.status(400).json({
        success: false,
        message,
    });
};
exports.badRequest = badRequest;
const notFound = (res, message = "Không tìm thấy dữ liệu") => {
    return res.status(404).json({
        success: false,
        message,
    });
};
exports.notFound = notFound;
const forbidden = (res, message = "Không có quyền truy cập") => {
    return res.status(403).json({
        success: false,
        message,
    });
};
exports.forbidden = forbidden;
const unauthorized = (res, message = "Chưa đăng nhập") => {
    return res.status(401).json({
        success: false,
        message,
    });
};
exports.unauthorized = unauthorized;
