"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const paymentMethodModel_1 = __importDefault(require("../models/paymentMethodModel"));
const paymentMethodValidation_1 = require("../validation/paymentMethodValidation");
const createPaymentMethod = async (req, res) => {
    try {
        const { name, code, description, is_active } = req.body || {};
        const paymentMethodData = {
            name,
            code: code?.toUpperCase(),
            description,
            is_active: is_active !== undefined ? Boolean(is_active) : true,
        };
        const errors = (0, paymentMethodValidation_1.paymentMethodValidation)(paymentMethodData);
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
        }
        const existingPaymentMethod = await paymentMethodModel_1.default.getPaymentMethodByCode(paymentMethodData.code);
        if (existingPaymentMethod) {
            return res
                .status(400)
                .json({ message: "Mã phương thức thanh toán đã tồn tại" });
        }
        const paymentMethod = await paymentMethodModel_1.default.createPaymentMethod(paymentMethodData);
        return res.status(201).json({
            message: "Tạo phương thức thanh toán thành công",
            data: paymentMethod,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const getAllPaymentMethods = async (req, res) => {
    try {
        const paymentMethods = await paymentMethodModel_1.default.getAllPaymentMethods();
        return res.status(200).json({
            message: "Lấy danh sách phương thức thanh toán thành công",
            data: paymentMethods,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const getActivePaymentMethods = async (req, res) => {
    try {
        const paymentMethods = await paymentMethodModel_1.default.getActivePaymentMethods();
        return res.status(200).json({
            message: "Lấy danh sách phương thức thanh toán hoạt động thành công",
            data: paymentMethods,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const getPaymentMethodById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (!id) {
            return res
                .status(400)
                .json({ message: "ID phương thức thanh toán không hợp lệ" });
        }
        const paymentMethod = await paymentMethodModel_1.default.getPaymentMethodById(id);
        if (!paymentMethod) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy phương thức thanh toán" });
        }
        return res.status(200).json({
            message: "Lấy thông tin phương thức thanh toán thành công",
            data: paymentMethod,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const updatePaymentMethodById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (!id) {
            return res
                .status(400)
                .json({ message: "ID phương thức thanh toán không hợp lệ" });
        }
        const existingPaymentMethod = await paymentMethodModel_1.default.getPaymentMethodById(id);
        if (!existingPaymentMethod) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy phương thức thanh toán" });
        }
        const { name, code, description, is_active } = req.body || {};
        const updateData = {};
        if (name !== undefined)
            updateData.name = name;
        if (code !== undefined)
            updateData.code = code.toUpperCase();
        if (description !== undefined)
            updateData.description = description;
        if (is_active !== undefined)
            updateData.is_active = Boolean(is_active);
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });
        }
        const errors = (0, paymentMethodValidation_1.updatePaymentMethodValidation)(updateData);
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
        }
        // Check if code exists (if updating code)
        if (updateData.code && updateData.code !== existingPaymentMethod.code) {
            const existingCode = await paymentMethodModel_1.default.getPaymentMethodByCode(updateData.code);
            if (existingCode) {
                return res
                    .status(400)
                    .json({ message: "Mã phương thức thanh toán đã tồn tại" });
            }
        }
        const paymentMethod = await paymentMethodModel_1.default.updatePaymentMethodById(id, updateData);
        return res.status(200).json({
            message: "Cập nhật phương thức thanh toán thành công",
            data: paymentMethod,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const deletePaymentMethodById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (!id) {
            return res
                .status(400)
                .json({ message: "ID phương thức thanh toán không hợp lệ" });
        }
        const existingPaymentMethod = await paymentMethodModel_1.default.getPaymentMethodById(id);
        if (!existingPaymentMethod) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy phương thức thanh toán" });
        }
        await paymentMethodModel_1.default.deletePaymentMethodById(id);
        return res
            .status(200)
            .json({ message: "Xóa phương thức thanh toán thành công" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const toggleActivePaymentMethod = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const paymentMethoodExist = await paymentMethodModel_1.default.getPaymentMethodById(id);
        if (!paymentMethoodExist) {
            return res
                .status(400)
                .json({ message: "Không tồn tại phương thức thanh toán này" });
        }
        await paymentMethodModel_1.default.toggleActivePaymentMethood(id);
        res.status(200).json({
            message: "Đã chuyển trạng thái của phương thức thanh toán",
            type: "success",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const paymentMethodController = {
    createPaymentMethod,
    getAllPaymentMethods,
    getPaymentMethodById,
    getActivePaymentMethods,
    updatePaymentMethodById,
    deletePaymentMethodById,
    toggleActivePaymentMethod,
};
exports.default = paymentMethodController;
