"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../generated/prisma");
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const updateRefundByVNPAY = async (id, adminId, reason, vnp_TransactionNo) => {
    return await PrismaClient_1.default.refund.update({
        where: { id },
        data: {
            processedByAdmin: { connect: { id: adminId } },
            reason,
            transaction_reference: vnp_TransactionNo,
            status: "success",
            refundedAt: new Date(),
        },
    });
};
const processManualRefund = async (id, adminId, reason, image) => {
    await PrismaClient_1.default.$transaction(async (tx) => {
        const refund = await tx.refund.update({
            where: { id },
            data: {
                processedByAdminId: adminId,
                reason,
                refundProofImage: image,
                status: "success",
                refundedAt: new Date(),
            },
        });
        const payment = await tx.payment.findUnique({
            where: { id: refund.paymentId },
        });
        if (!payment)
            throw new Error("Payment not found");
        const totalRefunded = await tx.refund.aggregate({
            where: {
                paymentId: refund.paymentId,
                status: "success",
            },
            _sum: {
                amount: true,
            },
        });
        const refundedAmount = Number(totalRefunded._sum.amount || 0);
        let status = prisma_1.PaymentStatus.success;
        if (refundedAmount === Number(payment.amount)) {
            status = prisma_1.PaymentStatus.refunded;
        }
        else if (refundedAmount > 0) {
            status = prisma_1.PaymentStatus.partially_refunded;
        }
        await tx.payment.update({
            where: { id: refund.paymentId },
            data: { status },
        });
        const returnedStatus = await tx.orderStatus.findUnique({
            where: { code: "RETURNED" },
        });
        if (!returnedStatus) {
            throw new Error("Order status RETURNED not found");
        }
        const partiallyReturnedStatus = await tx.orderStatus.findUnique({
            where: { code: "PARTIALLY_RETURNED" },
        });
        if (!partiallyReturnedStatus) {
            throw new Error("Order status PARTIALLY_RETURNED not found");
        }
        if (status === prisma_1.PaymentStatus.refunded) {
            await tx.order.update({
                where: { id: payment.orderId },
                data: { statusId: returnedStatus.id },
            });
        }
        else if (status === prisma_1.PaymentStatus.partially_refunded) {
            await tx.order.update({
                where: { id: payment.orderId },
                data: { statusId: partiallyReturnedStatus.id },
            });
        }
    });
};
const refundModel = { updateRefundByVNPAY, processManualRefund };
exports.default = refundModel;
