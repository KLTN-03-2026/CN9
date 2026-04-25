"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cartModel_1 = __importDefault(require("../models/cartModel"));
const createCart = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Vui lòng đăng nhập" });
        }
        const cartExist = await cartModel_1.default.findCartByUserId(userId);
        if (cartExist) {
            return res
                .status(200)
                .json({ message: "Bạn đã có cart", data: cartExist });
        }
        const cart = await cartModel_1.default.createCart(userId);
        return res
            .status(201)
            .json({ message: "Tạo giỏ hàng thành công", data: cart });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const addProductToCart = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Vui lòng đăng nhập" });
        }
        // Get or create cart
        let cart = await cartModel_1.default.findCartByUserId(userId);
        if (!cart) {
            cart = await cartModel_1.default.createCart(userId);
        }
        const variantId = Number(req.params.variantId);
        const quantity = Number(req.query.quantity);
        if (!variantId || !quantity) {
            return res.status(400).json({ message: "Thiếu variantId hoặc quantity" });
        }
        const addToCart = await cartModel_1.default.addProductToCart({
            cartId: cart.id,
            quantity,
            variantId,
        });
        return res
            .status(201)
            .json({ message: "Thêm vào giỏ hàng thành công", data: addToCart });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const removeProductToCart = async (req, res) => {
    try {
        const variantId = Number(req.params.variantId);
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Vui lòng đăng nhập" });
        }
        if (!variantId) {
            return res.status(400).json({ message: "Thiếu variantId" });
        }
        const cart = await cartModel_1.default.findCartByUserId(userId);
        if (!cart) {
            return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
        }
        const result = await cartModel_1.default.removeProductToCart(cart.id, variantId);
        if (!result) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy sản phẩm trong giỏ hàng" });
        }
        return res.status(200).json({ message: "Đã xóa sản phẩm khỏi giỏ hàng" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const getProductsToCart = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Vui lòng đăng nhập" });
        }
        const cart = await cartModel_1.default.findCartByUserId(userId);
        if (!cart) {
            return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
        }
        const products = await cartModel_1.default.getProductsToCart(cart.id, userId);
        return res
            .status(200)
            .json({ message: "Lấy dữ liệu thành công", data: products });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const increaseQuantity = async (req, res) => {
    try {
        const variantId = Number(req.params.variantId);
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Vui lòng đăng nhập" });
        }
        if (!variantId) {
            return res.status(400).json({ message: "Thiếu variantId" });
        }
        const cart = await cartModel_1.default.findCartByUserId(userId);
        if (!cart) {
            return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
        }
        const result = await cartModel_1.default.increaseQuantity(cart.id, variantId);
        return res
            .status(200)
            .json({ message: "Tăng số lượng thành công", data: result });
    }
    catch (error) {
        console.error(error);
        return res
            .status(400)
            .json({ message: error.message || "Không thể tăng số lượng" });
    }
};
const decreaseQuantity = async (req, res) => {
    try {
        const variantId = Number(req.params.variantId);
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Vui lòng đăng nhập" });
        }
        if (!variantId) {
            return res.status(400).json({ message: "Thiếu variantId" });
        }
        const cart = await cartModel_1.default.findCartByUserId(userId);
        if (!cart) {
            return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
        }
        const result = await cartModel_1.default.decreaseQuantity(cart.id, variantId);
        return res
            .status(200)
            .json({ message: "Giảm số lượng thành công", data: result });
    }
    catch (error) {
        console.error(error);
        return res
            .status(400)
            .json({ message: error.message || "Không thể giảm số lượng" });
    }
};
const cartController = {
    createCart,
    addProductToCart,
    increaseQuantity,
    decreaseQuantity,
    getProductsToCart,
    removeProductToCart,
};
exports.default = cartController;
