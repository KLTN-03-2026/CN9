"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const createOrder = async (data) => {
    const SHIPPING_DAYS = 4;
    const { item, ...orderData } = data;
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + SHIPPING_DAYS);
    return await PrismaClient_1.default.$transaction(async (tx) => {
        for (const orderItem of item) {
            const variant = await tx.productVariant.findUnique({
                where: { id: orderItem.variantId },
                select: { id: true, productId: true, stock: true },
            });
            if (!variant) {
                throw new Error("Variant not found");
            }
            if (variant.stock < orderItem.quantity) {
                throw new Error("Not enough stock");
            }
            // Trừ stock
            await tx.productVariant.update({
                where: { id: orderItem.variantId },
                data: {
                    stock: { decrement: orderItem.quantity },
                    sold: { increment: orderItem.quantity },
                },
            });
            await tx.product.update({
                where: { id: variant.productId },
                data: { sold: { increment: orderItem.quantity } },
            });
        }
        const order = await tx.order.create({
            data: {
                ...orderData,
                estimated_delivery_at: estimatedDate,
                items: {
                    create: item.map((orderItem) => ({
                        variantId: orderItem.variantId,
                        price: orderItem.price,
                        quantity: orderItem.quantity,
                    })),
                },
            },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                voucher: true,
                status: true,
                paymentMethod: true,
                items: {
                    include: {
                        variant: {
                            include: {
                                product: true,
                                color: true,
                                size: true,
                            },
                        },
                    },
                },
            },
        });
        return order;
    });
};
const getAllOrders = async (search, skip = 0, take = 10) => {
    const where = search
        ? {
            OR: [
                { receiver_name: { contains: search } },
                { receiver_email: { contains: search } },
            ],
        }
        : {};
    const [orders, total] = await Promise.all([
        PrismaClient_1.default.order.findMany({
            where,
            skip,
            take,
            include: { status: true },
            orderBy: { createdAt: "desc" },
        }),
        PrismaClient_1.default.order.count({ where }),
    ]);
    return {
        data: orders.map((order) => ({
            id: order.id,
            name: order.receiver_name,
            email: order.receiver_email,
            totalPrice: order.total_price,
            createdAt: order.createdAt,
            status: order.status,
        })),
        total,
    };
};
const getOrderById = async (id) => {
    const order = await PrismaClient_1.default.order.findUnique({
        where: { id },
        include: {
            status: true,
            payment: {
                orderBy: {
                    createdAt: "desc",
                },
                take: 1,
                select: {
                    id: true,
                    status: true,
                    method: { select: { id: true, code: true } },
                },
            },
            voucher: { select: { discount_value: true, discount_type: true } },
            items: {
                include: {
                    reviews: {
                        select: { id: true, comment: true, rating: true, images: true },
                    },
                    variant: {
                        select: {
                            product: { select: { name_product: true, id: true } },
                            image_url: true,
                            color: { select: { name_color: true } },
                            size: { select: { Symbol: true } },
                        },
                    },
                    returns: {
                        select: {
                            id: true,
                            reason: true,
                            imageUrl: true,
                            status: true,
                            adminNote: true,
                            refunds: {
                                take: 1,
                                select: { id: true },
                                orderBy: { createdAt: "asc" },
                            },
                        },
                    },
                },
            },
        },
    });
    if (!order)
        return null;
    const items = order.items.map((i) => {
        const reviewData = i.reviews;
        let review = null;
        if (reviewData) {
            let images = [];
            try {
                images = reviewData.images ? JSON.parse(reviewData.images) : [];
            }
            catch {
                images = [];
            }
            review = {
                id: reviewData.id,
                content: reviewData.comment,
                rating: reviewData.rating,
                images,
            };
        }
        const returnData = i.returns;
        let returns = null;
        if (returnData) {
            let imageReturn = [];
            try {
                imageReturn = returnData.imageUrl
                    ? JSON.parse(returnData.imageUrl)
                    : [];
            }
            catch {
                imageReturn = [];
            }
            returns = {
                id: returnData.id,
                reason: returnData.reason,
                status: returnData.status,
                imageReturn,
                adminNote: returnData.adminNote,
                refundId: returnData.refunds?.[0]?.id ?? null,
            };
        }
        return {
            id: i.id,
            imageVariant: i.variant.image_url,
            quantity: i.quantity,
            name: i.variant.product.name_product,
            price: i.price,
            review,
            size: i.variant.size?.Symbol,
            color: i.variant.color?.name_color,
            productId: i.variant.product.id,
            returns,
        };
    });
    const { is_final, is_cancelable, ...rest } = order.status;
    const status = { ...rest, isFinal: is_final, isCancelable: is_cancelable };
    return {
        id: order.id,
        totalPrice: order.total_price,
        items,
        status,
        createdAt: order.createdAt,
        payment: order.payment[0],
        email: order.receiver_email,
        name: order.receiver_name,
        phone: order.receiver_phone,
        address: order.receiver_address,
        voucher: order.voucher,
        pointDiscount: order.point_discount_amount,
    };
};
const getOrdersByUserId = async (userId) => {
    const orders = await PrismaClient_1.default.order.findMany({
        where: { userId },
        include: {
            status: {
                select: {
                    code: true,
                    id: true,
                    hex: true,
                    name: true,
                    is_cancelable: true,
                    is_final: true,
                },
            },
            payment: {
                orderBy: {
                    createdAt: "desc",
                },
                take: 1,
                select: {
                    id: true,
                    status: true,
                    method: { select: { id: true, code: true } },
                },
            },
            voucher: { select: { discount_value: true, discount_type: true } },
            items: {
                include: {
                    reviews: {
                        select: { id: true, comment: true, rating: true, images: true },
                    },
                    variant: {
                        select: {
                            product: { select: { id: true, name_product: true } },
                            image_url: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return orders.map((order) => {
        const items = order.items.map((i) => {
            const reviewData = i.reviews;
            let review = null;
            if (reviewData) {
                let images = [];
                try {
                    images = reviewData.images ? JSON.parse(reviewData.images) : [];
                }
                catch {
                    images = [];
                }
                review = {
                    id: reviewData.id,
                    content: reviewData.comment,
                    rating: reviewData.rating,
                    images,
                };
            }
            return {
                id: i.id,
                imageVariant: i.variant.image_url,
                quantity: i.quantity,
                name: i.variant.product.name_product,
                price: i.price,
                review,
                productId: i.variant.product.id,
            };
        });
        return {
            id: order.id,
            totalPrice: order.total_price,
            items,
            status: order.status,
            createdAt: order.createdAt,
            payment: order.payment[0],
            email: order.receiver_email,
            name: order.receiver_name,
            phone: order.receiver_phone,
            address: order.receiver_address,
            voucher: order.voucher,
            pointDiscount: order.point_discount_amount,
        };
    });
};
const updateOrderById = async (id, data) => {
    const { item, ...updateData } = data;
    return await PrismaClient_1.default.order.update({
        where: { id },
        data: updateData,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            voucher: true,
            status: true,
            paymentMethod: true,
            items: {
                include: {
                    variant: {
                        include: {
                            product: true,
                            color: true,
                            size: true,
                        },
                    },
                },
            },
        },
    });
};
const deleteOrderById = async (id) => await PrismaClient_1.default.order.delete({
    where: { id },
});
const cancelOrderByAdmin = async (id, reason) => {
    return await PrismaClient_1.default.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
            where: { id },
            include: {
                status: { select: { code: true } },
                items: true, // lấy order items để hoàn stock
            },
        });
        if (!order) {
            throw new Error("Order not found or not yours");
        }
        if (!["PENDING", "PROCESSING"].includes(order.status.code)) {
            throw new Error("Order is not eligible for cancel");
        }
        const cancelledStatus = await tx.orderStatus.findUnique({
            where: { code: "CANCELLED" },
        });
        if (!cancelledStatus) {
            throw new Error("Cancelled status not found");
        }
        // 🔥 Hoàn lại stock
        for (const item of order.items) {
            await tx.productVariant.update({
                where: { id: item.variantId },
                data: {
                    stock: { increment: item.quantity },
                    sold: { decrement: item.quantity },
                },
            });
        }
        // Update order status
        return await tx.order.update({
            where: { id: order.id },
            data: {
                statusId: cancelledStatus.id,
                cancel_reason: reason,
                cancelledAt: new Date(),
            },
        });
    });
};
const cancelOrderByUserId = async (id, userId, reason) => {
    return await PrismaClient_1.default.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
            where: { id },
            include: {
                status: { select: { code: true } },
                items: true, // lấy order items để hoàn stock
            },
        });
        if (!order || order.userId !== userId) {
            throw new Error("Order not found or not yours");
        }
        console.log(order.status.code);
        if (!["PENDING", "CONFIRMED", "PROCESSING"].includes(order.status.code)) {
            throw new Error("Order is not eligible for cancel");
        }
        const cancelledStatus = await tx.orderStatus.findUnique({
            where: { code: "CANCELLED" },
        });
        if (!cancelledStatus) {
            throw new Error("Cancelled status not found");
        }
        // 🔥 Hoàn lại stock
        for (const item of order.items) {
            await tx.productVariant.update({
                where: { id: item.variantId },
                data: {
                    stock: { increment: item.quantity },
                    sold: { decrement: item.quantity },
                },
            });
        }
        // Update order status
        return await tx.order.update({
            where: { id: order.id },
            data: {
                statusId: cancelledStatus.id,
                cancel_reason: reason,
                cancelledAt: new Date(),
            },
        });
    });
};
const returnOrderByUserId = async (orderItemId, userId, reason, image_url) => {
    return await PrismaClient_1.default.$transaction(async (tx) => {
        const orderItem = await tx.orderItem.findUnique({
            where: { id: orderItemId },
            include: {
                order: {
                    include: { status: true },
                },
            },
        });
        if (!orderItem || orderItem.order.userId !== userId) {
            throw new Error("Order item not found or not yours");
        }
        if (orderItem.order.status.code !== "DELIVERED") {
            throw new Error("Order is not eligible for return");
        }
        const existingReturn = await tx.return.findFirst({
            where: {
                orderItemId: orderItemId,
                status: {
                    in: ["PENDING", "APPROVED"],
                },
            },
        });
        if (existingReturn) {
            throw new Error("Return request already exists");
        }
        const newReturn = await tx.return.create({
            data: {
                reason,
                userId,
                orderItemId: orderItemId,
                imageUrl: image_url ?? null,
                status: "PENDING",
            },
        });
        const orderStatus = await tx.orderStatus.findUnique({
            where: { code: "RETURN_REQUESTED" },
        });
        if (!orderStatus) {
            throw new Error("RETURN_REQUESTED status not found");
        }
        await tx.order.update({
            where: { id: orderItem.order.id },
            data: { statusId: orderStatus.id },
        });
        return newReturn;
    });
};
const updateOrderStatusById = async (id) => {
    return await PrismaClient_1.default.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
            where: { id },
            include: { status: true },
        });
        if (!order) {
            throw new Error("Order not found");
        }
        if (order.status.is_final) {
            throw new Error("Cannot update final status");
        }
        const nextStatus = await tx.orderStatus.findFirst({
            where: {
                sort_order: {
                    gt: order.status.sort_order ?? 0,
                },
            },
            orderBy: {
                sort_order: "asc",
            },
        });
        if (!nextStatus) {
            throw new Error("No next status found");
        }
        const updateData = {
            statusId: nextStatus.id,
        };
        if (nextStatus.code === "SHIPPING") {
            updateData.shipped_at = new Date();
        }
        if (nextStatus.code === "DELIVERED") {
            updateData.delivered_at = new Date();
        }
        return await tx.order.update({
            where: { id },
            data: updateData,
            include: {
                status: true,
                user: { select: { name: true, email: true } },
                paymentMethod: { select: { name: true } },
            },
        });
    });
};
const confirmOrderReceived = async (orderId, userId) => {
    return await PrismaClient_1.default.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
            where: { id: orderId },
            include: { status: true },
        });
        if (!order || order.userId !== userId) {
            throw new Error("Order not found");
        }
        if (order.status.code === "DELIVERED") {
            return order;
        }
        if (order.status.code !== "SHIPPING") {
            throw new Error("Order is not in shipping state");
        }
        const statusDelivered = await tx.orderStatus.findUnique({
            where: { code: "DELIVERED" },
        });
        if (!statusDelivered) {
            throw new Error("DELIVERED status not found");
        }
        return await tx.order.update({
            where: { id: orderId },
            data: {
                statusId: statusDelivered.id,
                delivered_at: new Date(),
            },
        });
    });
};
const getTotalOrders = async (startDate, endDate) => {
    const result = await PrismaClient_1.default.order.aggregate({
        _count: true,
        where: {
            status: { code: "DELIVERED" },
            delivered_at: {
                gte: startDate,
                lte: endDate,
            },
        },
    });
    return result._count;
};
const getTotalSoldProducts = async (startDate, endDate) => {
    const { _sum } = await PrismaClient_1.default.orderItem.aggregate({
        _sum: { quantity: true },
        where: {
            order: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        },
    });
    return _sum.quantity ?? 0;
};
const getLatestPendingOrders = async () => {
    const orders = await PrismaClient_1.default.order.findMany({
        where: {
            status: {
                code: { notIn: ["DELIVERED", "CANCELLED", "RETURN_REJECTED"] },
            },
        },
        include: {
            status: true,
        },
        orderBy: { createdAt: "desc" },
        take: 10,
    });
    return orders.map((order) => ({
        id: order.id,
        name: order.receiver_name,
        email: order.receiver_email,
        totalPrice: order.total_price,
        createdAt: order.createdAt,
        status: order.status,
    }));
};
const orderModel = {
    createOrder,
    getAllOrders,
    getOrderById,
    getTotalOrders,
    updateOrderById,
    deleteOrderById,
    getOrdersByUserId,
    cancelOrderByAdmin,
    cancelOrderByUserId,
    returnOrderByUserId,
    confirmOrderReceived,
    getTotalSoldProducts,
    updateOrderStatusById,
    getLatestPendingOrders,
};
exports.default = orderModel;
