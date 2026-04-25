"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const parseImageJson_1 = require("../utils/parseImageJson");
const sortMap = {
    price_asc: { price: "asc" },
    price_desc: { price: "desc" },
    best_seller: { sold: "desc" },
    newest: { createdAt: "desc" },
};
const createProduct = async (data) => await PrismaClient_1.default.product.create({
    data,
    include: {
        category: true,
        sale: true,
        status: true,
        variants: {
            include: {
                color: true,
                size: true,
            },
        },
    },
});
const getAllProducts = async (search, skip = 0, take = 10) => {
    const where = search ? { name_product: { contains: search.trim() } } : {};
    const [products, total] = await Promise.all([
        PrismaClient_1.default.product.findMany({
            where,
            skip,
            take,
            select: {
                name_product: true,
                id: true,
                image_url: true,
                price: true,
                slug: true,
                status: { select: { id: true, name: true, hex: true } },
                sale: { select: { discount_type: true, discount_value: true } },
                variants: { select: { stock: true } },
                category: { select: { id: true, name_category: true } },
                createdAt: true,
            },
            orderBy: { createdAt: "desc" },
        }),
        PrismaClient_1.default.product.count({ where }),
    ]);
    return {
        data: products.map(({ name_product, category, status, variants, ...rest }) => ({
            ...rest,
            name: name_product,
            category: { id: category?.id, name: category?.name_category },
            status: { id: status?.id, name: status?.name, hex: status?.hex },
            sumStock: variants.reduce((sum, v) => sum + v.stock, 0),
        })),
        total,
    };
};
const getProductById = async (id) => {
    const product = await PrismaClient_1.default.product.findUnique({
        where: { id },
        select: {
            id: true,
            name_product: true,
            categoryId: true,
            statusId: true,
            price: true,
            saleId: true,
            description: true,
            image_url: true,
            variants: { include: { color: true, size: true } },
            season: true,
        },
    });
    if (!product) {
        throw new Error("Product not found");
    }
    const { name_product, ...rest } = product;
    return { name: name_product, ...rest };
};
const updateProductById = async (id, data) => await PrismaClient_1.default.product.update({
    where: { id },
    data,
});
const deleteProductById = async (id) => await PrismaClient_1.default.product.delete({
    where: { id },
});
const getFeaturedProducts = async (skip = 0, take = 10, filters, sort) => {
    const orderBy = sort && sort in sortMap ? sortMap[sort] : { createdAt: "desc" };
    const { minPrice, maxPrice, color, size } = filters;
    const [products, total] = await Promise.all([
        PrismaClient_1.default.product.findMany({
            where: {
                price: { gte: minPrice ?? 0, lte: maxPrice ?? 999999999 },
                ...(color || size
                    ? {
                        variants: {
                            some: {
                                ...(color && { colorId: color }),
                                ...(size && { sizeId: size }),
                            },
                        },
                    }
                    : {}),
            },
            skip,
            take,
            select: {
                id: true,
                name_product: true,
                description: true,
                image_url: true,
                slug: true,
                price: true,
                createdAt: true,
                category: { select: { name_category: true } },
                variants: {
                    where: { colorId: { equals: color }, sizeId: { equals: size } },
                    select: {
                        id: true,
                        image_url: true,
                        color: { select: { id: true, hex: true, name_color: true } },
                        size: { select: { id: true, Symbol: true } },
                        stock: true,
                    },
                },
                sale: {
                    select: {
                        discount_type: true,
                        discount_value: true,
                    },
                },
            },
            orderBy,
        }),
        PrismaClient_1.default.product.count(),
    ]);
    return {
        data: products.map((pro) => {
            const colorMap = new Map();
            pro.variants.forEach((v) => {
                if (v.color && !colorMap.has(v.color.id)) {
                    colorMap.set(v.color.id, v.color);
                }
            });
            const colors = Array.from(colorMap.values());
            const sizeMap = new Map();
            pro.variants.forEach((v) => {
                if (v.size && !sizeMap.has(v.size.id)) {
                    sizeMap.set(v.size.id, v.size);
                }
            });
            const sizes = Array.from(sizeMap.values());
            const colorToSizes = {};
            const sizeToColors = {};
            const colorImageMap = {};
            pro.variants.forEach((v) => {
                const c = v.color?.id;
                const s = v.size?.id;
                if (!c || !s)
                    return;
                if (!colorToSizes[c])
                    colorToSizes[c] = [];
                if (!colorToSizes[c].includes(s)) {
                    colorToSizes[c].push(s);
                }
                if (!sizeToColors[s])
                    sizeToColors[s] = [];
                if (!sizeToColors[s].includes(c)) {
                    sizeToColors[s].push(c);
                }
                if (!colorImageMap[c]) {
                    colorImageMap[c] = v.image_url || "";
                }
            });
            const { name_product, category, image_url, ...rest } = pro;
            const image = JSON.parse(image_url || "[]");
            return {
                ...rest,
                name: name_product,
                image_url: image[0],
                category: { name: category?.name_category },
                colors,
                sizes,
                variantMap: {
                    colorToSizes,
                    sizeToColors,
                    colorImageMap,
                },
            };
        }),
        total,
    };
};
const getProductBySlug = async (slug) => {
    const product = await PrismaClient_1.default.product.findUnique({
        where: { slug },
        select: {
            id: true,
            name_product: true,
            description: true,
            image_url: true,
            price: true,
            reviews: { select: { rating: true, user: true, comment: true } },
            variants: {
                select: {
                    id: true,
                    image_url: true,
                    color: { select: { id: true, hex: true, name_color: true } },
                    size: { select: { id: true, Symbol: true } },
                    stock: true,
                },
            },
            sale: { select: { discount_type: true, discount_value: true } },
            _count: { select: { variants: { where: { stock: { gt: 0 } } } } },
        },
    });
    if (!product) {
        throw new Error("Không có sản phẩm này!");
    }
    const productImages = (0, parseImageJson_1.parseImageJson)(product.image_url);
    const variantImages = product.variants.flatMap((v) => v.image_url);
    const mergedImages = Array.from(new Set([...productImages, ...variantImages]));
    const colorMap = new Map();
    product.variants.forEach((v) => {
        if (!colorMap.has(v.color?.id || 0)) {
            colorMap.set(v.color?.id || 0, v.color);
        }
    });
    const colors = Array.from(colorMap.values());
    const sizeMap = new Map();
    product.variants.forEach((v) => {
        if (!sizeMap.has(v.size?.id || 0)) {
            sizeMap.set(v.size?.id || 0, v.size);
        }
    });
    const sizes = Array.from(sizeMap.values());
    const ratingSummary = {
        total: product.reviews.length,
        average: 0,
        stars: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
    let ratingSum = 0;
    product.reviews.forEach((r) => {
        ratingSummary.stars[r.rating]++;
        ratingSum += r.rating;
    });
    ratingSummary.average =
        ratingSummary.total > 0
            ? Number((ratingSum / ratingSummary.total).toFixed(1))
            : 0;
    // ---------- Return ----------
    return {
        id: product.id,
        name: product.name_product,
        description: product.description,
        price: product.price ?? 0,
        image_url: mergedImages,
        variants: product.variants,
        colors,
        sizes,
        sale: product.sale,
        ratingSummary,
        reviews: product.reviews.map(({ user, comment, ...rest }) => ({
            ...rest,
            username: user.name,
            avatar: user.avatar,
            content: comment,
        })),
        countStock: product._count.variants,
    };
};
const getSaleProducts = async (skip = 0, take = 10, filters, sort) => {
    const orderBy = sort && sort in sortMap ? sortMap[sort] : { createdAt: "desc" };
    const { minPrice, maxPrice, color, size } = filters;
    const [products, total] = await Promise.all([
        PrismaClient_1.default.product.findMany({
            orderBy,
            take,
            skip,
            where: {
                sale: { isNot: null },
                price: { gte: minPrice ?? 0, lte: maxPrice ?? 999999999 },
                ...(color || size
                    ? {
                        variants: {
                            some: {
                                ...(color && { colorId: color }),
                                ...(size && { sizeId: size }),
                            },
                        },
                    }
                    : {}),
            },
            select: {
                id: true,
                name_product: true,
                description: true,
                image_url: true,
                slug: true,
                price: true,
                createdAt: true,
                category: { select: { name_category: true } },
                variants: {
                    select: {
                        id: true,
                        image_url: true,
                        color: { select: { id: true, hex: true, name_color: true } },
                        size: { select: { id: true, Symbol: true } },
                        stock: true,
                    },
                },
                sale: {
                    select: {
                        discount_type: true,
                        discount_value: true,
                    },
                },
            },
        }),
        PrismaClient_1.default.product.count({
            where: {
                sale: { isNot: null },
            },
        }),
    ]);
    return {
        data: products.map((pro) => {
            // ===== COLORS =====
            const colorMap = new Map();
            pro.variants.forEach((v) => {
                if (v.color && !colorMap.has(v.color.id)) {
                    colorMap.set(v.color.id, v.color);
                }
            });
            const colors = Array.from(colorMap.values());
            // ===== SIZES =====
            const sizeMap = new Map();
            pro.variants.forEach((v) => {
                if (v.size && !sizeMap.has(v.size.id)) {
                    sizeMap.set(v.size.id, v.size);
                }
            });
            const sizes = Array.from(sizeMap.values());
            // ===== VARIANT MAP =====
            const colorToSizes = {};
            const sizeToColors = {};
            const colorImageMap = {};
            pro.variants.forEach((v) => {
                const c = v.color?.id;
                const s = v.size?.id;
                if (!c || !s)
                    return;
                // color -> sizes
                if (!colorToSizes[c])
                    colorToSizes[c] = [];
                if (!colorToSizes[c].includes(s)) {
                    colorToSizes[c].push(s);
                }
                // size -> colors
                if (!sizeToColors[s])
                    sizeToColors[s] = [];
                if (!sizeToColors[s].includes(c)) {
                    sizeToColors[s].push(c);
                }
                // color -> image
                if (!colorImageMap[c]) {
                    colorImageMap[c] = v.image_url || "";
                }
            });
            const { name_product, category, image_url, ...rest } = pro;
            const image = JSON.parse(image_url || "[]");
            return {
                ...rest,
                name: name_product,
                image_url: image[0],
                category: { name: category?.name_category },
                colors,
                sizes,
                variantMap: {
                    colorToSizes,
                    sizeToColors,
                    colorImageMap,
                },
            };
        }),
        total,
    };
};
const createProductVariant = async (data) => await PrismaClient_1.default.$transaction(async (tx) => {
    const variant = await tx.productVariant.create({
        data,
    });
    const product = await tx.product.findUnique({
        where: { id: variant.productId },
        include: { variants: true },
    });
    if (!product)
        throw new Error("Product not found");
    const sumStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
    const statuses = await tx.productStatus.findMany();
    const statusMap = Object.fromEntries(statuses.map((s) => [s.name, s.id]));
    let newStatusId;
    if (sumStock === 0) {
        newStatusId = statusMap["Tạm hết hàng"];
    }
    else if (sumStock < 50) {
        newStatusId = statusMap["Sắp hết hàng"];
    }
    else {
        newStatusId = statusMap["Còn hàng"];
    }
    if (!newStatusId) {
        throw new Error("Product status not configured correctly");
    }
    await tx.product.update({
        where: { id: product.id },
        data: { statusId: newStatusId },
    });
    return variant;
});
const updateProductVariantById = async (id, data) => await PrismaClient_1.default.productVariant.update({
    where: { id },
    data,
    include: {
        color: true,
        size: true,
        product: true,
    },
});
const deleteProductVariantById = async (id) => await PrismaClient_1.default.productVariant.delete({
    where: { id },
});
const getProductVariants = async (productId) => {
    const variants = await PrismaClient_1.default.productVariant.findMany({
        where: { productId },
        select: {
            id: true,
            image_url: true,
            color: { select: { hex: true, name_color: true } },
            size: { select: { Symbol: true } },
            stock: true,
        },
    });
    return variants.map((variant) => {
        const { color, size, ...rest } = variant;
        return {
            ...rest,
            name_color: color?.name_color,
            hex_color: color?.hex,
            symbol_size: size?.Symbol,
        };
    });
};
const getProductVariantsById = async (variantId) => await PrismaClient_1.default.productVariant.findUnique({
    where: { id: variantId },
});
const updateProductStatusById = async (id, statusId) => {
    await PrismaClient_1.default.product.update({ where: { id }, data: { statusId } });
};
const decreaseStockProductById = async (variantId, quantity) => {
    return await PrismaClient_1.default.productVariant.update({
        where: { id: variantId },
        data: {
            stock: {
                decrement: quantity,
            },
            sold: {
                increment: quantity,
            },
        },
    });
};
const increaseStockProductById = async (variantId, quantity) => {
    return await PrismaClient_1.default.productVariant.update({
        where: { id: variantId },
        data: {
            stock: {
                increment: quantity,
            },
            sold: {
                decrement: quantity,
            },
        },
    });
};
const createProductView = async (userId, productId) => await PrismaClient_1.default.productView.upsert({
    where: {
        userId_productId: {
            userId,
            productId,
        },
    },
    update: {
        viewedAt: new Date(),
        viewCount: { increment: 1 },
    },
    create: {
        userId,
        productId,
    },
});
const getAllProductViewByUserId = async (userId) => await PrismaClient_1.default.productView.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { viewedAt: "desc" },
    take: 20,
});
const searchProduct = async (keyword) => {
    const products = await PrismaClient_1.default.product.findMany({
        where: {
            name_product: {
                contains: keyword,
            },
        },
        select: {
            id: true,
            name_product: true,
            image_url: true,
            price: true,
            category: { select: { name_category: true } },
            slug: true,
        },
    });
    return products.map((product) => {
        return {
            id: product.id,
            name: product.name_product,
            image_url: (0, parseImageJson_1.parseImageJson)(product.image_url),
            price: product.price,
            slug: product.slug,
            categoryName: product.category?.name_category,
        };
    });
};
const productModel = {
    createProduct,
    searchProduct,
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
    getProductVariantsById,
    updateProductStatusById,
    updateProductVariantById,
    deleteProductVariantById,
    decreaseStockProductById,
    increaseStockProductById,
    getAllProductViewByUserId,
};
exports.default = productModel;
