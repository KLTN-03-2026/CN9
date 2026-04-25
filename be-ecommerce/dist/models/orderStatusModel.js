"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const createOrderStatus = async (data) => await PrismaClient_1.default.orderStatus.create({
    data,
});
const getAllOrderStatuses = async () => {
    const orderStatuses = await PrismaClient_1.default.orderStatus.findMany({
        select: {
            id: true,
            name: true,
            hex: true,
            code: true,
            description: true,
            _count: { select: { orders: true } },
        },
        orderBy: [{ sort_order: "asc" }, { createdAt: "asc" }],
    });
    return orderStatuses.map((orderS) => {
        const { _count, ...rest } = orderS;
        return { ...rest, countNumber: _count.orders };
    });
};
const getOrderStatusById = async (id) => await PrismaClient_1.default.orderStatus.findUnique({
    where: { id },
});
const getOrderStatusByCode = async (code) => await PrismaClient_1.default.orderStatus.findUnique({
    where: { code },
});
const getOrderStatusByName = async (name) => await PrismaClient_1.default.orderStatus.findUnique({
    where: { name },
});
const updateOrderStatusById = async (id, data) => await PrismaClient_1.default.orderStatus.update({
    where: { id },
    data,
});
const deleteOrderStatusById = async (id) => await PrismaClient_1.default.orderStatus.delete({
    where: { id },
});
const orderStatusModel = {
    createOrderStatus,
    getAllOrderStatuses,
    getOrderStatusById,
    getOrderStatusByCode,
    getOrderStatusByName,
    updateOrderStatusById,
    deleteOrderStatusById,
};
exports.default = orderStatusModel;
