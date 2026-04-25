"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const createSale = async (data) => {
    return await PrismaClient_1.default.sale.create({
        data,
    });
};
const getAllSales = async (search, skip = 0, take = 10) => {
    const where = search ? { name_sale: { contains: search } } : {};
    const [sales, total] = await Promise.all([
        PrismaClient_1.default.sale.findMany({
            where,
            skip,
            take,
            include: { _count: { select: { products: true } } },
            orderBy: { createdAt: "desc" },
        }),
        PrismaClient_1.default.sale.count({ where }),
    ]);
    return {
        data: sales.map(({ name_sale, is_active, ...rest }) => ({
            ...rest,
            name: name_sale,
            isActive: is_active,
        })),
        total,
    };
};
const getActiveSales = async () => {
    const now = new Date();
    return await PrismaClient_1.default.sale.findMany({
        where: {
            is_active: true,
            OR: [
                {
                    start_date: null,
                    end_date: null,
                },
                {
                    start_date: { lte: now },
                    end_date: { gte: now },
                },
                {
                    start_date: { lte: now },
                    end_date: null,
                },
                {
                    start_date: null,
                    end_date: { gte: now },
                },
            ],
        },
        include: {
            _count: {
                select: { products: true },
            },
        },
    });
};
const getSaleById = async (id) => {
    const sale = await PrismaClient_1.default.sale.findUnique({
        where: { id },
        include: {
            _count: {
                select: { products: true },
            },
        },
    });
    if (!sale) {
        throw new Error("Sale not found");
    }
    const { name_sale, ...rest } = sale;
    return { ...rest, name: name_sale };
};
const updateSaleById = async (id, data) => {
    return await PrismaClient_1.default.sale.update({
        where: { id },
        data,
    });
};
const deleteSaleById = async (id) => {
    return await PrismaClient_1.default.sale.delete({
        where: { id },
    });
};
const toggleSaleActive = async (id, isActive) => {
    return await PrismaClient_1.default.sale.update({
        where: { id },
        data: { is_active: isActive },
        select: { id: true },
    });
};
const saleModel = {
    createSale,
    getAllSales,
    getSaleById,
    getActiveSales,
    updateSaleById,
    deleteSaleById,
    toggleSaleActive,
};
exports.default = saleModel;
