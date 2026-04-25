"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const categoryModel_1 = __importDefault(require("../models/categoryModel"));
const slugify_1 = __importDefault(require("slugify"));
const paginate_1 = require("../utils/paginate");
const createCategory = async (req, res) => {
    try {
        const { name, genderId, description } = req.body || {};
        const slug = (0, slugify_1.default)(name, { lower: true, strict: true });
        const file = req.file;
        const image_category = file ? file.path : "";
        const nameExist = await categoryModel_1.default.checkName(name);
        if (nameExist) {
            return res.status(400).json({ message: "Trùng name" });
        }
        const categoryData = {
            name_category: name,
            genderId: Number(genderId) || null,
            description: description || "",
            image_category,
            slug,
        };
        const category = await categoryModel_1.default.createCategory(categoryData);
        res.status(201).json({
            message: "Tạo dữ liệu thành công",
            data: category,
            type: "success",
        });
    }
    catch (error) {
        res.status(500).json({
            message: error?.message || "Lỗi server",
            error: {
                name: error?.name,
                code: error?.code,
                message: error?.message,
                stack: error?.stack,
            },
            type: "error",
        });
    }
};
const getCategories = async (req, res) => {
    try {
        const { page, limit, skip } = (0, paginate_1.getPaginationParams)(req.query);
        const search = req.query.search;
        const { data, total } = await categoryModel_1.default.getCategories(search, skip, limit);
        return res.status(200).json({
            message: "Lấy dữ liệu category thành công",
            type: "success",
            ...(0, paginate_1.buildPaginatedResponse)(data, total, page, limit),
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const updateCategoryById = async (req, res) => {
    try {
        const categoryId = Number(req.params.categoryId);
        const categoryExist = await categoryModel_1.default.getCategoryById(categoryId);
        if (!categoryExist) {
            return res
                .status(404)
                .json({ message: "Category không tồn tại", type: "error" });
        }
        const { name, genderId, description } = req.body || {};
        const file = req.file;
        const image_category = file ? file.path : "";
        if (name) {
            const nameExist = await categoryModel_1.default.checkNameExcludeId(name, categoryId);
            if (nameExist) {
                return res.status(400).json({ message: "Trùng name", type: "error" });
            }
        }
        const dataUpdate = {};
        if (name !== undefined && name)
            dataUpdate.name_category = name;
        if (genderId !== undefined && genderId !== 0)
            dataUpdate.genderId = Number(genderId);
        if (description !== undefined && description)
            dataUpdate.description = description;
        if (image_category !== "")
            dataUpdate.image_category = image_category;
        if (Object.keys(dataUpdate).length === 0) {
            return res
                .status(400)
                .json({ message: "Không có dữ liệu để cập nhật", type: "error" });
        }
        const category = await categoryModel_1.default.updateCategoryById(categoryId, dataUpdate);
        res.status(200).json({
            message: "Cập nhật category thành công",
            data: category,
            type: "success",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const deleteCategoryById = async (req, res) => {
    try {
        const categoryId = Number(req.params.categoryId);
        await categoryModel_1.default.deleteCategoryById(categoryId);
        return res.status(200).json({ message: "Xóa thành công", type: "success" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const getCategoryById = async (req, res) => {
    try {
        const categoryId = Number(req.params.categoryId);
        const category = await categoryModel_1.default.getCategoryById(categoryId);
        if (!category) {
            return res
                .status(404)
                .json({ message: "Category không tồn tại", type: "error" });
        }
        res.status(200).json({
            message: "Lấy dữ liệu của category thành công",
            data: category,
            type: "success",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const getProductBySlugCategory = async (req, res) => {
    try {
        const slug = req.params.slug;
        const products = await categoryModel_1.default.getProductBySlugCategory(slug);
        if (!products) {
            return res
                .status(404)
                .json({ message: "Không có tồn tại thể loại này", type: "error" });
        }
        res.status(200).json({
            message: "Lấy dữ liệu của category thành công",
            data: products,
            type: "success",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const searchCategory = async (req, res) => {
    try {
        const nameCategory = req.query.nameCategory?.trim();
        if (!nameCategory) {
            return res.status(400).json({
                message: "Tên thể loại không hợp lệ",
                type: "error",
            });
        }
        const categories = await categoryModel_1.default.searchCategory(nameCategory);
        return res.status(200).json({
            message: "Tìm kiếm thành công",
            type: "success",
            data: categories,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Lỗi server",
            type: "error",
        });
    }
};
const getTopSellingCategories = async (req, res) => {
    try {
        const data = await categoryModel_1.default.getTopSellingCategories();
        return res.status(200).json({
            message: "Lấy top thể loại bán chạy thành công",
            data,
            type: "success",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const categoryController = {
    getCategories,
    searchCategory,
    createCategory,
    getCategoryById,
    updateCategoryById,
    deleteCategoryById,
    getTopSellingCategories,
    getProductBySlugCategory,
};
exports.default = categoryController;
