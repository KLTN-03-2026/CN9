"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const createPayment = async (data) => {
    return await PrismaClient_1.default.payment.create({
        data,
        include: {
            order: {
                select: {
                    id: true,
                    userId: true,
                    total_price: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },
            method: true,
        },
    });
};
const getAllPayments = async () => {
    return await PrismaClient_1.default.payment.findMany({
        include: {
            order: {
                select: {
                    id: true,
                    userId: true,
                    total_price: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },
            method: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
const getPaymentById = async (id) => {
    const payment = await PrismaClient_1.default.payment.findUnique({
        where: { id },
        // include: {
        //   order: {
        //     include: {
        //       user: {
        //         select: {
        //           id: true,
        //           name: true,
        //           email: true,
        //           phone: true,
        //         },
        //       },
        //       items: {
        //         include: {
        //           variant: {
        //             include: {
        //               product: true,
        //               color: true,
        //               size: true,
        //             },
        //           },
        //         },
        //       },
        //     },
        //   },
        //   method: true,
        // },
    });
    if (!payment) {
        throw new Error("Payment not founded");
    }
    return payment;
};
const getPaymentByOrderId = async (orderId) => {
    return await PrismaClient_1.default.payment.findFirst({
        where: { orderId },
        select: { id: true, status: true, amount: true },
    });
};
const getPaymentsByStatus = async (status) => {
    return await PrismaClient_1.default.payment.findMany({
        where: { status },
        include: {
            order: {
                select: {
                    id: true,
                    userId: true,
                    total_price: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },
            method: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
const updatePaymentById = async (id, data) => {
    return await PrismaClient_1.default.payment.update({
        where: { id },
        data: {
            ...data,
            received_at: new Date(),
        },
        include: {
            order: {
                select: {
                    id: true,
                    userId: true,
                    total_price: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },
            method: true,
        },
    });
};
const deletePaymentById = async (id) => {
    return await PrismaClient_1.default.payment.delete({
        where: { id },
    });
};
const confirmCodPaymentReceived = async (id, adminId) => {
    const payment = await PrismaClient_1.default.payment.findUnique({
        where: { id },
    });
    if (!payment) {
        throw new Error("Payment not found");
    }
    if (payment.status === "success") {
        throw new Error("Payment already confirmed");
    }
    return await PrismaClient_1.default.payment.update({
        where: { id },
        data: {
            status: "success",
            collectedByAdminId: adminId,
            received_at: new Date(),
        },
    });
};
const getRevenueByDate = async (startDate, endDate) => {
    const result = await PrismaClient_1.default.payment.aggregate({
        _sum: {
            amount: true,
        },
        where: {
            status: "success",
            received_at: {
                gte: startDate,
                lte: endDate,
            },
        },
    });
    return result._sum.amount || 0;
};
const paymentModel = {
    createPayment,
    getAllPayments,
    getPaymentById,
    getRevenueByDate,
    updatePaymentById,
    deletePaymentById,
    getPaymentByOrderId,
    getPaymentsByStatus,
    confirmCodPaymentReceived,
};
exports.default = paymentModel;
