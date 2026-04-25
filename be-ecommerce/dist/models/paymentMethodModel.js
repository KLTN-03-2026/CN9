"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const createPaymentMethod = async (data) => await PrismaClient_1.default.paymentMethod.create({
    data,
});
const getAllPaymentMethods = async () => await PrismaClient_1.default.paymentMethod.findMany({
    orderBy: {
        createdAt: "desc",
    },
});
const getActivePaymentMethods = async () => await PrismaClient_1.default.paymentMethod.findMany({
    where: { is_active: true },
    orderBy: {
        name: "asc",
    },
});
const getPaymentMethodById = async (id) => await PrismaClient_1.default.paymentMethod.findUnique({
    where: { id },
});
const getPaymentMethodByCode = async (code) => {
    const method = await PrismaClient_1.default.paymentMethod.findUnique({
        where: { code },
    });
    if (!method) {
        throw new Error("Payment method not found");
    }
    return method;
};
const updatePaymentMethodById = async (id, data) => await PrismaClient_1.default.paymentMethod.update({
    where: { id },
    data,
});
const deletePaymentMethodById = async (id) => await PrismaClient_1.default.paymentMethod.delete({
    where: { id },
});
const toggleActivePaymentMethood = async (id) => {
    const paymentMethood = await PrismaClient_1.default.paymentMethod.findUnique({
        where: { id },
    });
    if (!paymentMethood) {
        throw new Error("PaymentMethood not found");
    }
    return PrismaClient_1.default.paymentMethod.update({
        where: { id },
        data: { is_active: !paymentMethood.is_active },
    });
};
const paymentMethodModel = {
    createPaymentMethod,
    getAllPaymentMethods,
    getPaymentMethodById,
    getPaymentMethodByCode,
    getActivePaymentMethods,
    updatePaymentMethodById,
    deletePaymentMethodById,
    toggleActivePaymentMethood,
};
exports.default = paymentMethodModel;
