"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const productStatusModel_1 = __importDefault(require("../models/productStatusModel"));
const productStatusValidation_1 = require("../validation/productStatusValidation");
const createProductStatus = async (req, res) => {
    try {
        const { name, description, hex } = req.body || {};
        const productStatusData = {
            name,
            description,
            hex,
        };
        const errors = (0, productStatusValidation_1.productStatusValidation)(productStatusData);
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
        }
        // Check if name exists
        const existingProductStatus = await productStatusModel_1.default.getProductStatusByName(name);
        if (existingProductStatus) {
            return res
                .status(400)
                .json({ message: "Tên trạng thái sản phẩm đã tồn tại" });
        }
        const productStatus = await productStatusModel_1.default.createProductStatus(productStatusData);
        return res.status(201).json({
            message: "Tạo trạng thái sản phẩm thành công",
            data: productStatus,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const getAllProductStatuses = async (req, res) => {
    try {
        const productStatuses = await productStatusModel_1.default.getAllProductStatuses();
        return res.status(200).json({
            message: "Lấy danh sách trạng thái sản phẩm thành công",
            data: productStatuses,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const getProductStatusById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (!id) {
            return res
                .status(400)
                .json({ message: "ID trạng thái sản phẩm không hợp lệ" });
        }
        const productStatus = await productStatusModel_1.default.getProductStatusById(id);
        if (!productStatus) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy trạng thái sản phẩm" });
        }
        return res.status(200).json({
            message: "Lấy thông tin trạng thái sản phẩm thành công",
            data: productStatus,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const updateProductStatusById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (!id) {
            return res
                .status(400)
                .json({ message: "ID trạng thái sản phẩm không hợp lệ" });
        }
        const existingProductStatus = await productStatusModel_1.default.getProductStatusById(id);
        if (!existingProductStatus) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy trạng thái sản phẩm" });
        }
        const { name, description } = req.body || {};
        const updateData = {};
        if (name !== undefined)
            updateData.name = name;
        if (description !== undefined)
            updateData.description = description;
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });
        }
        const errors = (0, productStatusValidation_1.updateProductStatusValidation)(updateData);
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
        }
        // Check if name exists (if updating name)
        if (updateData.name && updateData.name !== existingProductStatus.name) {
            const duplicateProductStatus = await productStatusModel_1.default.getProductStatusByName(updateData.name);
            if (duplicateProductStatus) {
                return res
                    .status(400)
                    .json({ message: "Tên trạng thái sản phẩm đã tồn tại" });
            }
        }
        const productStatus = await productStatusModel_1.default.updateProductStatusById(id, updateData);
        return res.status(200).json({
            message: "Cập nhật trạng thái sản phẩm thành công",
            data: productStatus,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const deleteProductStatusById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (!id) {
            return res
                .status(400)
                .json({ message: "ID trạng thái sản phẩm không hợp lệ" });
        }
        const existingProductStatus = await productStatusModel_1.default.getProductStatusById(id);
        if (!existingProductStatus) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy trạng thái sản phẩm" });
        }
        await productStatusModel_1.default.deleteProductStatusById(id);
        return res
            .status(200)
            .json({ message: "Xóa trạng thái sản phẩm thành công" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const productStatusController = {
    createProductStatus,
    getAllProductStatuses,
    getProductStatusById,
    updateProductStatusById,
    deleteProductStatusById,
};
exports.default = productStatusController;
