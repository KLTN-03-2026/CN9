"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const productModel_1 = __importDefault(require("../models/productModel"));
const slugify_1 = __importDefault(require("slugify"));
const paginate_1 = require("../utils/paginate");
const createProduct = async (req, res) => {
    try {
        const { name, description, price, categoryId, saleId, season } = req.body || {};
        const slug = (0, slugify_1.default)(name, { lower: true, strict: true });
        const files = req.files;
        const image_urls = files.map((file) => file.path);
        const product = await productModel_1.default.createProduct({
            season: season,
            name_product: name,
            description,
            image_url: JSON.stringify(image_urls),
            price,
            categoryId: Number(categoryId),
            saleId: Number(saleId),
            slug,
        });
        res.status(201).json({ message: "Tạo dữ liệu thành công", data: product });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
const getAllProducts = async (req, res) => {
    try {
        const { page, limit, skip } = (0, paginate_1.getPaginationParams)(req.query);
        const search = req.query.search;
        const { data, total } = await productModel_1.default.getAllProducts(search, skip, limit);
        return res.status(200).json({
            type: "success",
            message: "Lấy dữ liệu thành công",
            ...(0, paginate_1.buildPaginatedResponse)(data, total, page, limit),
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const getFeaturedProducts = async (req, res) => {
    try {
        const { page, limit, skip } = (0, paginate_1.getPaginationParams)(req.query);
        const { minPrice, maxPrice, color, size, sort } = req.query;
        const filters = {
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            color: color ? Number(color) : undefined,
            size: size ? Number(size) : undefined,
        };
        const { data, total } = await productModel_1.default.getFeaturedProducts(skip, limit, filters, sort);
        res.status(200).json({
            message: "Lấy các sản phẩm nỗi bật thành công",
            type: "success",
            ...(0, paginate_1.buildPaginatedResponse)(data, total, page, limit),
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
const getProductBySlug = async (req, res) => {
    try {
        const slug = req.params.slug;
        const product = await productModel_1.default.getProductBySlug(slug);
        if (!product) {
            return res.status(404).json({ message: "Product này không tồn tại" });
        }
        res.status(200).json({
            message: "Lấy chi tiết sản phẩm thành công",
            data: product,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
const getSaleProducts = async (req, res) => {
    try {
        const { page, limit, skip } = (0, paginate_1.getPaginationParams)(req.query);
        const { minPrice, maxPrice, color, size, sort } = req.query;
        const filters = {
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            color: color ? Number(color) : undefined,
            size: size ? Number(size) : undefined,
        };
        const { data, total } = await productModel_1.default.getSaleProducts(skip, limit, filters, sort);
        if (!data) {
            return res.status(404).json({ message: "không có sản phẩm" });
        }
        res.status(200).json({
            message: "Lấy các sản phẩm đang sale thành công",
            type: "success",
            ...(0, paginate_1.buildPaginatedResponse)(data, total, page, limit),
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
const getProductById = async (req, res) => {
    try {
        const productId = Number(req.params.productId);
        const product = await productModel_1.default.getProductById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product này không tồn tại" });
        }
        res.status(200).json({ message: "Lấy dữ liệu thành công", data: product });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
const updateProductById = async (req, res) => {
    try {
        const productId = Number(req.params.productId);
        const productExist = await productModel_1.default.getProductById(productId);
        if (!productExist) {
            return res.status(404).json({ message: "Product này không tồn tại" });
        }
        const { name, description, price, categoryId, saleId, season } = req.body || {};
        const files = req.files;
        const image_urls = files.map((file) => file.path);
        const dataUpdate = {};
        if (name !== undefined)
            dataUpdate.name_product = name;
        if (description !== undefined)
            dataUpdate.description = description;
        if (price !== undefined)
            dataUpdate.price = price;
        if (categoryId !== undefined)
            dataUpdate.categoryId = Number(categoryId);
        if (saleId !== undefined)
            dataUpdate.saleId = Number(saleId);
        if (season !== undefined)
            dataUpdate.season = season;
        if (image_urls.length !== 0)
            dataUpdate.image_url = JSON.stringify(image_urls);
        if (Object.keys(dataUpdate).length === 0) {
            return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });
        }
        const product = await productModel_1.default.updateProductById(productId, dataUpdate);
        res
            .status(200)
            .json({ message: "Cập nhật product thành công", data: product });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
const deleteProductById = async (req, res) => {
    try {
        const productId = Number(req.params.productId);
        const productExist = await productModel_1.default.getProductById(productId);
        if (!productExist) {
            return res.status(404).json({ message: "Product này không tồn tại" });
        }
        await productModel_1.default.deleteProductById(productId);
        const remainingProducts = await productModel_1.default.getAllProducts();
        res
            .status(200)
            .json({ message: "Xóa thành công", data: remainingProducts });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
const createProductVariant = async (req, res) => {
    try {
        const productId = Number(req.params.productId);
        const productExist = await productModel_1.default.getProductById(productId);
        if (!productExist) {
            return res.status(404).json({ message: "Product này không tồn tại" });
        }
        const file = req.file;
        const image = file ? file.path : "";
        const { colorId, sizeId, stock } = req.body || {};
        const variant = await productModel_1.default.createProductVariant({
            productId,
            colorId: Number(colorId),
            sizeId: Number(sizeId),
            stock: Number(stock),
            image_url: image,
        });
        res.status(201).json({ message: "Tạo dữ liệu thành công", data: variant });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
const getProductVariants = async (req, res) => {
    try {
        const productId = Number(req.params.productId);
        const productExist = await productModel_1.default.getProductById(productId);
        if (!productExist) {
            return res.status(404).json({ message: "Product này không tồn tại" });
        }
        const variants = await productModel_1.default.getProductVariants(productId);
        res.status(200).json({ message: "Lấy dữ liệu thành công", data: variants });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
const updateProductVariantById = async (req, res) => {
    try {
        const productId = Number(req.params.productId);
        const productExist = await productModel_1.default.getProductById(productId);
        if (!productExist) {
            return res.status(404).json({ message: "Product này không tồn tại" });
        }
        const variantId = Number(req.params.variantId);
        const variantExist = await productModel_1.default.getProductVariants(variantId);
        if (!variantExist) {
            return res.status(404).json({ message: "Product này không tồn tại" });
        }
        const { colorId, sizeId, stock } = req.body || {};
        const file = req.file;
        const image = file ? file.path : "";
        const dataUpdate = {};
        if (colorId !== undefined && colorId !== 0)
            dataUpdate.colorId = colorId;
        if (sizeId !== undefined && sizeId !== 0)
            dataUpdate.sizeId = sizeId;
        if (stock !== undefined && stock > 0)
            dataUpdate.stock = stock;
        if (image !== undefined)
            dataUpdate.image_url = image;
        if (Object.keys(dataUpdate).length === 0) {
            return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });
        }
        const variant = await productModel_1.default.updateProductVariantById(variantId, dataUpdate);
        res
            .status(200)
            .json({ message: "Cập nhật variant thành công", data: variant });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
const deleteProductVariantById = async (req, res) => {
    try {
        const productId = Number(req.params.productId);
        const productExist = await productModel_1.default.getProductById(productId);
        if (!productExist) {
            return res.status(404).json({ message: "Product này không tồn tại" });
        }
        const variantId = Number(req.params.variantId);
        const variantExist = await productModel_1.default.getProductVariantsById(variantId);
        if (!variantExist) {
            return res.status(404).json({ message: "Product này không tồn tại" });
        }
        await productModel_1.default.deleteProductVariantById(variantId);
        const remainingVariants = await productModel_1.default.getProductVariants(productId);
        res
            .status(200)
            .json({ message: "Xóa thành công", data: remainingVariants });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
const createProductView = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                message: "Bạn chưa đăng nhập",
                type: "error",
            });
        }
        const productId = Number(req.params.productId);
        if (!productId || isNaN(productId)) {
            return res.status(400).json({
                message: "productId không hợp lệ",
                type: "error",
            });
        }
        const productView = await productModel_1.default.createProductView(userId, productId);
        return res.status(200).json({
            message: "Đã ghi nhận lượt xem",
            data: productView,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Lỗi server",
        });
    }
};
const searchProduct = async (req, res) => {
    try {
        const keyword = req.query.keyword;
        if (!keyword || keyword.trim() === "") {
            return res.status(400).json({
                message: "Thiếu từ khóa tìm kiếm",
            });
        }
        const products = await productModel_1.default.searchProduct(keyword);
        return res.status(200).json({
            message: "Tìm kiếm thành công",
            data: products,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Lỗi server",
        });
    }
};
const productController = {
    searchProduct,
    createProduct,
    getAllProducts,
    getProductById,
    getSaleProducts,
    getProductBySlug,
    createProductView,
    updateProductById,
    deleteProductById,
    getProductVariants,
    getFeaturedProducts,
    createProductVariant,
    updateProductVariantById,
    deleteProductVariantById,
};
exports.default = productController;
