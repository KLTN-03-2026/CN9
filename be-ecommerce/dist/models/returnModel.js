"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const approveReturnByAdminId = async (id, status, adminNote) => {
    return PrismaClient_1.default.$transaction(async (tx) => {
        const existing = await tx.return.findUnique({
            where: { id },
            include: {
                orderItems: true,
            },
        });
        if (!existing)
            throw new Error("Return not found");
        if (existing.status !== "PENDING") {
            throw new Error("Return already processed");
        }
        const updatedReturn = await tx.return.update({
            where: { id },
            data: { status, adminNote },
        });
        const orderId = existing.orderItems.orderId;
        if (status === "APPROVED") {
            const payment = await tx.payment.findFirst({
                where: { orderId },
                take: 1,
                orderBy: { createdAt: "asc" },
            });
            if (!payment) {
                throw new Error("Payment not found for this order");
            }
            await tx.refund.create({
                data: {
                    orderItemId: existing.orderItemId,
                    paymentId: payment.id,
                    returnId: existing.id,
                    amount: Number(existing.orderItems.price) * existing.orderItems.quantity,
                    reason: "",
                },
            });
        }
        if (status === "REJECTED") {
            const rejectedStatus = await tx.orderStatus.findUnique({
                where: { code: "RETURN_REJECTED" },
            });
            if (!rejectedStatus) {
                throw new Error("Order status RETURN_REJECTED not found");
            }
            await tx.order.update({
                where: { id: orderId },
                data: {
                    statusId: rejectedStatus.id,
                },
            });
        }
        return updatedReturn;
    });
};
const returnModel = { approveReturnByAdminId };
exports.default = returnModel;
