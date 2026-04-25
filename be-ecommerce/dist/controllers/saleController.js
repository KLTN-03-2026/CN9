"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const saleModel_1 = __importDefault(require("../models/saleModel"));
const saleValidation_1 = require("../validation/saleValidation");
const paginate_1 = require("../utils/paginate");
const createSale = async (req, res) => {
    try {
        const { name, description, discount_type, discount_value, start_date, end_date, is_active, } = req.body || {};
        const saleData = {
            name_sale: name,
            description,
            discount_type,
            discount_value: parseFloat(discount_value),
            start_date: new Date(start_date),
            end_date: new Date(end_date),
            is_active: is_active !== undefined ? Boolean(is_active) : true,
        };
        const errors = (0, saleValidation_1.saleValidation)(saleData);
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
        }
        const sale = await saleModel_1.default.createSale(saleData);
        return res
            .status(201)
            .json({ message: "Tạo khuyến mãi thành công", data: sale });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const getAllSales = async (req, res) => {
    try {
        const { page, limit, skip } = (0, paginate_1.getPaginationParams)(req.query);
        const search = req.query.search;
        const { data, total } = await saleModel_1.default.getAllSales(search, skip, limit);
        return res.status(200).json({
            message: "Lấy danh sách khuyến mãi thành công",
            ...(0, paginate_1.buildPaginatedResponse)(data, total, page, limit),
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const getActiveSales = async (req, res) => {
    try {
        const sales = await saleModel_1.default.getActiveSales();
        return res.status(200).json({
            message: "Lấy danh sách khuyến mãi đang hoạt động thành công",
            data: sales,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const getSaleById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (!id) {
            return res.status(400).json({ message: "ID khuyến mãi không hợp lệ" });
        }
        const sale = await saleModel_1.default.getSaleById(id);
        if (!sale) {
            return res.status(404).json({ message: "Không tìm thấy khuyến mãi" });
        }
        return res
            .status(200)
            .json({ message: "Lấy thông tin khuyến mãi thành công", data: sale });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const updateSaleById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (!id) {
            return res.status(400).json({ message: "ID khuyến mãi không hợp lệ" });
        }
        const existingSale = await saleModel_1.default.getSaleById(id);
        if (!existingSale) {
            return res.status(404).json({ message: "Không tìm thấy khuyến mãi" });
        }
        const { name_sale, description, discount_type, discount_value, start_date, end_date, is_active, } = req.body || {};
        const updateData = {};
        if (name_sale !== undefined)
            updateData.name_sale = name_sale;
        if (description !== undefined)
            updateData.description = description;
        if (discount_type !== undefined)
            updateData.discount_type = discount_type;
        if (discount_value !== undefined)
            updateData.discount_value = parseFloat(discount_value);
        if (start_date !== undefined)
            updateData.start_date = start_date ? new Date(start_date) : undefined;
        if (end_date !== undefined)
            updateData.end_date = end_date ? new Date(end_date) : undefined;
        if (is_active !== undefined)
            updateData.is_active = Boolean(is_active);
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });
        }
        const errors = (0, saleValidation_1.updateSaleValidation)(updateData);
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
        }
        const sale = await saleModel_1.default.updateSaleById(id, updateData);
        return res
            .status(200)
            .json({ message: "Cập nhật khuyến mãi thành công", data: sale });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const deleteSaleById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (!id) {
            return res.status(400).json({ message: "ID khuyến mãi không hợp lệ" });
        }
        const existingSale = await saleModel_1.default.getSaleById(id);
        if (!existingSale) {
            return res.status(404).json({ message: "Không tìm thấy khuyến mãi" });
        }
        await saleModel_1.default.deleteSaleById(id);
        return res.status(200).json({ message: "Xóa khuyến mãi thành công" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const toggleSaleActive = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        if (typeof isActive !== "boolean") {
            res.status(400).json({ message: "isActive phải là boolean" });
            return;
        }
        const sale = await saleModel_1.default.toggleSaleActive(Number(id), isActive);
        res.status(200).json({
            message: isActive ? "Mở khóa sale thành công" : "Khóa sale thành công",
            data: sale,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
const saleController = {
    createSale,
    getAllSales,
    getSaleById,
    getActiveSales,
    updateSaleById,
    deleteSaleById,
    toggleSaleActive,
};
exports.default = saleController;
