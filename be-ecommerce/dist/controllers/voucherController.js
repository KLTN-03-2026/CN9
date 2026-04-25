"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const voucherModel_1 = __importDefault(require("../models/voucherModel"));
const paginate_1 = require("../utils/paginate");
const toLocalDate = (date) => {
    const [y, m, d] = date.split("-").map(Number);
    return new Date(y, m - 1, d, 0, 0, 0);
};
const createVoucher = async (req, res) => {
    try {
        const { code, description, discount_type, discount_value, min_order_value, start_date, end_date, usage_limit, } = req.body || {};
        const codeExist = await voucherModel_1.default.checkCode(code);
        if (codeExist) {
            return res.status(400).json({ message: "Trùng code" });
        }
        const voucher = await voucherModel_1.default.createVoucher({
            code: code.toUpperCase(),
            description,
            discount_type,
            discount_value,
            min_order_value,
            start_date: toLocalDate(start_date),
            end_date: toLocalDate(end_date),
            usage_limit: Number(usage_limit),
        });
        res.status(201).json({ message: "Tạo dữ liệu thành công", data: voucher });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
const getVouchers = async (req, res) => {
    try {
        const { page, limit, skip } = (0, paginate_1.getPaginationParams)(req.query);
        const search = req.query.search;
        const { data, total } = await voucherModel_1.default.getVouchers(search, skip, limit);
        return res.status(200).json({
            message: "Lấy dữ liệu thành công",
            ...(0, paginate_1.buildPaginatedResponse)(data, total, page, limit),
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const updateVoucherById = async (req, res) => {
    try {
        const voucherId = Number(req.params.voucherId);
        const voucherExist = await voucherModel_1.default.findVoucherById(voucherId);
        if (!voucherExist) {
            return res.status(404).json({ message: "Voucher không tồn tại" });
        }
        const { code, description, discount_type, discount_value, min_order_value, start_date, end_date, usage_limit, } = req.body || {};
        if (code) {
            const codeExist = await voucherModel_1.default.checkCodeExcludeId(code, voucherId);
            if (codeExist) {
                return res.status(400).json({ message: "Trùng name" });
            }
        }
        const dataUpdate = {};
        if (code !== undefined)
            dataUpdate.code = code.toUpperCase();
        if (description !== undefined)
            dataUpdate.description = description;
        if (discount_type !== undefined)
            dataUpdate.discount_type = discount_type;
        if (discount_value !== undefined)
            dataUpdate.discount_value = discount_value;
        if (min_order_value !== undefined)
            dataUpdate.min_order_value = min_order_value;
        if (start_date !== undefined)
            dataUpdate.start_date = toLocalDate(start_date);
        if (end_date !== undefined)
            dataUpdate.end_date = toLocalDate(end_date);
        if (usage_limit !== undefined)
            dataUpdate.usage_limit = Number(usage_limit);
        if (Object.keys(dataUpdate).length === 0) {
            return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });
        }
        const voucher = await voucherModel_1.default.updateVoucherById(voucherId, dataUpdate);
        res
            .status(200)
            .json({ message: "Cập nhật permission thành công", data: voucher });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
const deleteVoucherById = async (req, res) => {
    try {
        const voucherId = Number(req.params.voucherId);
        if (isNaN(voucherId)) {
            return res.status(400).json({ message: "ID không hợp lệ" });
        }
        const voucherExist = await voucherModel_1.default.findVoucherById(voucherId);
        if (!voucherExist) {
            return res.status(404).json({ message: "Voucher không tồn tại" });
        }
        await voucherModel_1.default.deleteVoucherById(voucherId);
        return res.status(200).json({ message: "Xóa thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
const getVoucherByCode = async (req, res) => {
    try {
        const { code } = req.params;
        const { total } = req.query;
        if (!total || isNaN(Number(total))) {
            return res.status(400).json({
                message: "Tổng đơn hàng không hợp lệ",
            });
        }
        const userId = Number(req.user?.userId);
        if (!userId) {
            return res.status(401).json({
                message: "Không xác thực người dùng",
            });
        }
        const voucher = await voucherModel_1.default.getVoucherByCode(code, Number(total), userId);
        return res.status(200).json({
            message: "Áp dụng voucher thành công",
            data: voucher,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: error.message || "Lỗi server",
        });
    }
};
const toggleVoucherActive = async (req, res) => {
    try {
        const { voucherId } = req.params;
        const { isActive } = req.body;
        if (typeof isActive !== "boolean") {
            res.status(400).json({ message: "isActive phải là boolean" });
            return;
        }
        const voucher = await voucherModel_1.default.toggleVoucherActive(Number(voucherId), isActive);
        res.status(200).json({
            message: isActive
                ? "Mở khóa voucher thành công"
                : "Khóa voucher thành công",
            data: voucher,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
const getVoucherById = async (req, res) => {
    try {
        const voucherId = Number(req.params.voucherId);
        if (isNaN(voucherId)) {
            return res.status(400).json({ message: "ID không hợp lệ" });
        }
        const voucher = await voucherModel_1.default.getVoucherById(voucherId);
        if (!voucher) {
            return res.status(404).json({ message: "Voucher không tồn tại" });
        }
        return res
            .status(200)
            .json({ message: "Lấy dữ liệu thành công", data: voucher });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const voucherController = {
    getVouchers,
    createVoucher,
    getVoucherById,
    getVoucherByCode,
    updateVoucherById,
    deleteVoucherById,
    toggleVoucherActive,
};
exports.default = voucherController;
