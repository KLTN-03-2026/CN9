"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orderStatusModel_1 = __importDefault(require("../models/orderStatusModel"));
const orderStatusValidation_1 = require("../validation/orderStatusValidation");
const createOrderStatus = async (req, res) => {
    try {
        const { name, sequence, is_final, is_cancelable, code, description, hex } = req.body || {};
        const orderStatusData = {
            name,
            sort_order: sequence ? parseInt(sequence) : undefined,
            is_final: is_final !== undefined ? Boolean(is_final) : false,
            is_cancelable: is_cancelable !== undefined ? Boolean(is_cancelable) : true,
            code,
            description,
            hex,
        };
        const errors = (0, orderStatusValidation_1.orderStatusValidation)(orderStatusData);
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
        }
        // Check if name exists
        const existingOrderStatus = await orderStatusModel_1.default.getOrderStatusByName(orderStatusData.name);
        if (existingOrderStatus) {
            return res
                .status(400)
                .json({ message: "Tên trạng thái đơn hàng đã tồn tại" });
        }
        const orderStatus = await orderStatusModel_1.default.createOrderStatus(orderStatusData);
        return res.status(201).json({
            message: "Tạo trạng thái đơn hàng thành công",
            data: orderStatus,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const getAllOrderStatuses = async (req, res) => {
    try {
        const orderStatuses = await orderStatusModel_1.default.getAllOrderStatuses();
        return res.status(200).json({
            message: "Lấy danh sách trạng thái đơn hàng thành công",
            data: orderStatuses,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const getOrderStatusById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (!id) {
            return res
                .status(400)
                .json({ message: "ID trạng thái đơn hàng không hợp lệ" });
        }
        const orderStatus = await orderStatusModel_1.default.getOrderStatusById(id);
        if (!orderStatus) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy trạng thái đơn hàng" });
        }
        return res.status(200).json({
            message: "Lấy thông tin trạng thái đơn hàng thành công",
            data: orderStatus,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const updateOrderStatusById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (!id) {
            return res
                .status(400)
                .json({ message: "ID trạng thái đơn hàng không hợp lệ" });
        }
        const existingOrderStatus = await orderStatusModel_1.default.getOrderStatusById(id);
        if (!existingOrderStatus) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy trạng thái đơn hàng" });
        }
        const { name, sequence, is_final, is_cancelable, code, description, hex } = req.body || {};
        const updateData = {};
        if (name !== undefined)
            updateData.name = name;
        if (sequence !== undefined)
            updateData.sort_order = parseInt(sequence);
        if (code !== undefined)
            updateData.code = code;
        if (hex !== undefined)
            updateData.hex = hex;
        if (is_final !== undefined)
            updateData.is_final = Boolean(is_final);
        if (description !== undefined)
            updateData.description = description;
        if (is_cancelable !== undefined)
            updateData.is_cancelable = Boolean(is_cancelable);
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });
        }
        const errors = (0, orderStatusValidation_1.updateOrderStatusValidation)(updateData);
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
        }
        // Check if name exists (if updating name)
        if (updateData.name && updateData.name !== existingOrderStatus.name) {
            const existingName = await orderStatusModel_1.default.getOrderStatusByName(updateData.name);
            if (existingName) {
                return res
                    .status(400)
                    .json({ message: "Tên trạng thái đơn hàng đã tồn tại" });
            }
        }
        const orderStatus = await orderStatusModel_1.default.updateOrderStatusById(id, updateData);
        return res.status(200).json({
            message: "Cập nhật trạng thái đơn hàng thành công",
            data: orderStatus,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const deleteOrderStatusById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (!id) {
            return res
                .status(400)
                .json({ message: "ID trạng thái đơn hàng không hợp lệ" });
        }
        const existingOrderStatus = await orderStatusModel_1.default.getOrderStatusById(id);
        if (!existingOrderStatus) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy trạng thái đơn hàng" });
        }
        await orderStatusModel_1.default.deleteOrderStatusById(id);
        return res
            .status(200)
            .json({ message: "Xóa trạng thái đơn hàng thành công" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const orderStatusController = {
    createOrderStatus,
    getAllOrderStatuses,
    getOrderStatusById,
    updateOrderStatusById,
    deleteOrderStatusById,
};
exports.default = orderStatusController;
