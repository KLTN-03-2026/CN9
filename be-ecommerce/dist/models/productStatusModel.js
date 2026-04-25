"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const createProductStatus = async (data) => {
    return await PrismaClient_1.default.productStatus.create({
        data,
    });
};
const getAllProductStatuses = async () => {
    const productStatuses = await PrismaClient_1.default.productStatus.findMany({
        include: {
            _count: {
                select: { products: true },
            },
        },
    });
    return productStatuses.map((productS) => {
        const { _count, ...rest } = productS;
        return { ...rest, countNumber: _count.products };
    });
};
const getProductStatusById = async (id) => {
    return await PrismaClient_1.default.productStatus.findUnique({
        where: { id },
        include: {
            _count: {
                select: { products: true },
            },
        },
    });
};
const getProductStatusByName = async (name) => {
    return await PrismaClient_1.default.productStatus.findUnique({
        where: { name },
    });
};
const updateProductStatusById = async (id, data) => {
    return await PrismaClient_1.default.productStatus.update({
        where: { id },
        data,
    });
};
const deleteProductStatusById = async (id) => {
    return await PrismaClient_1.default.productStatus.delete({
        where: { id },
    });
};
const productStatusModel = {
    createProductStatus,
    getAllProductStatuses,
    getProductStatusById,
    getProductStatusByName,
    updateProductStatusById,
    deleteProductStatusById,
};
exports.default = productStatusModel;
