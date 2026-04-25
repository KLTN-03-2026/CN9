"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const createCart = async (userId) => await PrismaClient_1.default.cart.create({ data: { userId } });
const addProductToCart = async (data) => {
    // Check if item already exists
    const existingItem = await PrismaClient_1.default.cartItem.findFirst({
        where: {
            cartId: data.cartId,
            variantId: data.variantId,
        },
    });
    if (existingItem) {
        // Update quantity if item exists
        return await PrismaClient_1.default.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + data.quantity },
        });
    }
    // Create new item if not exists
    return await PrismaClient_1.default.cartItem.create({ data });
};
const removeProductToCart = async (cartId, variantId) => {
    const item = await PrismaClient_1.default.cartItem.findFirst({
        where: { cartId, variantId },
    });
    if (!item) {
        return false;
    }
    return PrismaClient_1.default.cartItem.delete({
        where: { id: item.id },
    });
};
const getProductsToCart = async (cartId, userId) => {
    const cart = await PrismaClient_1.default.cart.findUnique({
        where: { id: cartId, userId },
        select: {
            items: {
                select: {
                    quantity: true,
                    variant: {
                        select: {
                            id: true,
                            image_url: true,
                            size: { select: { Symbol: true } },
                            color: { select: { name_color: true } },
                            product: {
                                select: {
                                    id: true,
                                    name_product: true,
                                    price: true,
                                    sale: {
                                        select: {
                                            discount_type: true,
                                            discount_value: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });
    const items = cart?.items.map((i) => ({
        variantId: i.variant.id,
        quantity: i.quantity,
        productId: i.variant.product.id,
        size: i.variant.size?.Symbol,
        color: i.variant.color?.name_color,
        image_url: i.variant.image_url,
        name: i.variant.product.name_product,
        price: i.variant.product.price,
        sale: i.variant.product.sale,
        isChecked: false,
    })) || [];
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    return {
        totalQuantity,
        items,
        voucher: null,
    };
};
const findCartByUserId = async (userId) => await PrismaClient_1.default.cart.findUnique({ where: { userId } });
const increaseQuantity = async (cartId, variantId) => {
    const item = await PrismaClient_1.default.cartItem.findFirst({
        where: { cartId, variantId },
        include: { variant: true },
    });
    if (!item)
        throw new Error("Item không tồn tại");
    // Check stock
    if (item.quantity >= item.variant.stock) {
        throw new Error("Không đủ hàng trong kho");
    }
    return PrismaClient_1.default.cartItem.update({
        where: { id: item.id },
        data: { quantity: { increment: 1 } },
    });
};
const decreaseQuantity = async (cartId, variantId) => {
    const item = await PrismaClient_1.default.cartItem.findFirst({
        where: { cartId, variantId },
    });
    if (!item)
        throw new Error("Item không tồn tại");
    if (item.quantity <= 1) {
        return PrismaClient_1.default.cartItem.delete({ where: { id: item.id } });
    }
    return PrismaClient_1.default.cartItem.update({
        where: { id: item.id },
        data: { quantity: { decrement: 1 } },
    });
};
const cartModel = {
    createCart,
    addProductToCart,
    findCartByUserId,
    decreaseQuantity,
    increaseQuantity,
    getProductsToCart,
    removeProductToCart,
};
exports.default = cartModel;
