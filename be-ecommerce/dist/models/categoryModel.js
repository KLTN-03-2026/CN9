"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const createCategory = async (data) => await PrismaClient_1.default.category.create({ data });
const updateCategoryById = async (id, data) => await PrismaClient_1.default.category.update({ where: { id }, data });
const deleteCategoryById = async (id) => await PrismaClient_1.default.category.delete({ where: { id } });
const getCategories = async (search, skip = 0, take = 10) => {
    const where = search ? { name_category: { contains: search } } : {};
    const [categories, total] = await Promise.all([
        PrismaClient_1.default.category.findMany({ where, skip, take }),
        PrismaClient_1.default.category.count({ where }),
    ]);
    return {
        data: categories.map(({ name_category, image_category, ...rest }) => ({
            ...rest,
            name: name_category,
            imageCategory: image_category,
        })),
        total,
    };
};
const getCategoryById = async (id) => await PrismaClient_1.default.category.findUnique({ where: { id } });
const checkName = async (name) => {
    const existingName = await PrismaClient_1.default.category.findFirst({
        where: { name_category: name },
    });
    return !!existingName;
};
const checkNameExcludeId = async (name, id) => {
    const existingName = await PrismaClient_1.default.category.findFirst({
        where: { name_category: name, NOT: { id } },
    });
    return !!existingName;
};
const getProductBySlugCategory = async (slug) => {
    const categoryWithProduct = await PrismaClient_1.default.category.findUnique({
        where: { slug },
        select: {
            products: {
                select: {
                    id: true,
                    name_product: true,
                    image_url: true,
                    slug: true,
                    price: true,
                    createdAt: true,
                    status: {
                        select: { id: true, name: true, hex: true },
                    },
                    category: {
                        select: { id: true, name_category: true },
                    },
                    sale: {
                        select: {
                            discount_type: true,
                            discount_value: true,
                        },
                    },
                    variants: {
                        select: {
                            id: true,
                            image_url: true,
                            stock: true,
                            color: {
                                select: { id: true, hex: true, name_color: true },
                            },
                            size: {
                                select: { id: true, Symbol: true },
                            },
                        },
                    },
                },
            },
        },
    });
    return categoryWithProduct?.products.map((pro) => {
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
        const { name_product, category, status, image_url, variants, ...rest } = pro;
        const image = JSON.parse(image_url || "[]");
        return {
            ...rest,
            name: name_product,
            image_url: image[0],
            category: {
                id: category?.id,
                name: category?.name_category,
            },
            status: {
                id: status?.id,
                name: status?.name,
                hex: status?.hex,
            },
            variants: pro.variants,
            sumStock: variants.reduce((sum, v) => sum + v.stock, 0),
            colors,
            sizes,
            variantMap: {
                colorToSizes,
                sizeToColors,
                colorImageMap,
            },
        };
    });
};
const searchCategory = async (nameCategory) => {
    const categories = await PrismaClient_1.default.category.findMany({
        where: { name_category: { contains: nameCategory } },
    });
    return categories.map((category) => {
        const { name_category, image_category, ...rest } = category;
        return { ...rest, name: name_category, imageCategory: image_category };
    });
};
const getTopSellingCategories = async () => {
    const result = await PrismaClient_1.default.category.findMany({
        select: {
            id: true,
            name_category: true,
            _count: { select: { products: { where: { sold: { gt: 0 } } } } },
            products: {
                select: {
                    sold: true,
                },
            },
        },
    });
    return result
        .map(({ name_category, products, id, _count }) => ({
        id,
        name: name_category,
        totalSold: products.reduce((sum, p) => sum + p.sold, 0),
        totalProducts: _count.products,
    }))
        .sort((a, b) => b.totalSold - a.totalSold)
        .slice(0, 5);
};
const categoryModel = {
    checkName,
    getCategories,
    searchCategory,
    createCategory,
    getCategoryById,
    updateCategoryById,
    deleteCategoryById,
    checkNameExcludeId,
    getTopSellingCategories,
    getProductBySlugCategory,
};
exports.default = categoryModel;
