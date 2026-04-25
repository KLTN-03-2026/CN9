"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orderValidation_1 = require("../validation/orderValidation");
const orderModel_1 = __importDefault(require("../models/orderModel"));
const productModel_1 = __importDefault(require("../models/productModel"));
const orderStatusModel_1 = __importDefault(require("../models/orderStatusModel"));
const order_producer_1 = require("../services/rabbitmq/order/order.producer");
const paginate_1 = require("../utils/paginate");
const parseDateRange_1 = require("../utils/parseDateRange");
const createOrder = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { voucherId, totalPrice, shippingFee, address, email, name, note, phone, usedPoints, earnedPoints, paymentMethod, item, pointDiscount, } = req.body || {};
        if (!item || !Array.isArray(item) || item.length === 0) {
            return res
                .status(400)
                .json({ message: "Vui lòng thêm sản phẩm vào đơn hàng" });
        }
        const formattedItems = [];
        for (let i = 0; i < item.length; i++) {
            const orderItem = item[i];
            const variantId = parseInt(orderItem.variantId.toString());
            const price = parseFloat(orderItem.price.toString());
            const quantity = parseInt(orderItem.quantity.toString());
            if (!variantId || isNaN(variantId)) {
                return res.status(400).json({
                    message: `Sản phẩm ${i + 1}: variantId không hợp lệ`,
                });
            }
            if (!price || isNaN(price) || price <= 0) {
                return res.status(400).json({
                    message: `Sản phẩm ${i + 1}: price không hợp lệ`,
                });
            }
            if (!quantity || isNaN(quantity) || quantity <= 0) {
                return res.status(400).json({
                    message: `Sản phẩm ${i + 1}: quantity không hợp lệ`,
                });
            }
            const variant = await productModel_1.default.getProductVariantsById(variantId);
            if (!variant) {
                return res.status(400).json({
                    message: `Sản phẩm ${i + 1}: Không tìm thấy variant ${variantId}`,
                });
            }
            if (variant.stock < quantity) {
                return res.status(400).json({
                    message: `Sản phẩm ${i + 1}: Không đủ hàng trong kho`,
                });
            }
            formattedItems.push({
                variantId,
                price,
                quantity,
            });
        }
        const orderStatus = await orderStatusModel_1.default.getOrderStatusByCode("PENDING");
        if (!orderStatus) {
            return res
                .status(400)
                .json({ message: "Lỗi không tìm thấy trạng thái đơn hàng" });
        }
        const orderData = {
            receiver_address: address,
            receiver_email: email,
            receiver_phone: phone,
            receiver_name: name,
            receiver_note: note,
            userId,
            voucherId: voucherId ? parseInt(voucherId) : undefined,
            statusId: orderStatus.id,
            total_price: parseFloat(totalPrice),
            shipping_fee: shippingFee ? parseFloat(shippingFee) : 0,
            used_points: usedPoints ? parseInt(usedPoints) : 0,
            earned_points: earnedPoints ? parseInt(earnedPoints) : 0,
            payment_method: parseInt(paymentMethod),
            item: formattedItems,
            point_discount_amount: pointDiscount ? parseFloat(pointDiscount) : 0,
        };
        const errors = (0, orderValidation_1.orderValidation)(orderData);
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
        }
        const order = await orderModel_1.default.createOrder(orderData);
        (0, order_producer_1.publishOrderConfirmationEmail)({
            to: order.receiver_email,
            receiverName: order.receiver_name,
            orderId: order.id,
            totalPrice: Number(order.total_price),
            shippingFee: Number(order.shipping_fee),
            paymentMethod: order.paymentMethod.name,
            receiverAddress: order.receiver_address,
            items: order.items.map((item) => ({
                name: item.variant.product.name_product,
                quantity: item.quantity,
                price: Number(item.price),
            })),
        });
        return res.status(201).json({
            message: "Tạo đơn hàng thành công",
            totalPrice: order.total_price,
            orderId: order.id,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const getAllOrders = async (req, res) => {
    try {
        const { page, limit, skip } = (0, paginate_1.getPaginationParams)(req.query);
        const search = req.query.search;
        const { data, total } = await orderModel_1.default.getAllOrders(search, skip, limit);
        return res.status(200).json({
            message: "Lấy danh sách đơn hàng thành công",
            ...(0, paginate_1.buildPaginatedResponse)(data, total, page, limit),
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const getOrderById = async (req, res) => {
    try {
        const id = parseInt(req.params.orderId);
        if (!id) {
            return res.status(400).json({ message: "ID đơn hàng không hợp lệ" });
        }
        const order = await orderModel_1.default.getOrderById(id);
        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }
        return res
            .status(200)
            .json({ message: "Lấy thông tin đơn hàng thành công", data: order });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const getMyOrders = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Vui lòng đăng nhập" });
        }
        const orders = await orderModel_1.default.getOrdersByUserId(userId);
        return res
            .status(200)
            .json({ message: "Lấy danh sách đơn hàng thành công", data: orders });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const updateOrderById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (!id) {
            return res.status(400).json({ message: "ID đơn hàng không hợp lệ" });
        }
        const existingOrder = await orderModel_1.default.getOrderById(id);
        if (!existingOrder) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }
        const { voucherId, provinceId, statusId, total_price, shipping_fee, used_points, earned_points, payment_method, shipping_address, } = req.body || {};
        const updateData = {};
        if (voucherId !== undefined)
            updateData.voucherId = parseInt(voucherId);
        if (provinceId !== undefined)
            updateData.provinceId = parseInt(provinceId);
        if (statusId !== undefined)
            updateData.statusId = parseInt(statusId);
        if (total_price !== undefined)
            updateData.total_price = parseFloat(total_price);
        if (shipping_fee !== undefined)
            updateData.shipping_fee = parseFloat(shipping_fee);
        if (used_points !== undefined)
            updateData.used_points = parseInt(used_points);
        if (earned_points !== undefined)
            updateData.earned_points = parseInt(earned_points);
        if (payment_method !== undefined)
            updateData.payment_method = parseInt(payment_method);
        if (shipping_address !== undefined)
            updateData.shipping_address = shipping_address;
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });
        }
        const order = await orderModel_1.default.updateOrderById(id, updateData);
        return res
            .status(200)
            .json({ message: "Cập nhật đơn hàng thành công", data: order });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const deleteOrderById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (!id) {
            return res.status(400).json({ message: "ID đơn hàng không hợp lệ" });
        }
        const existingOrder = await orderModel_1.default.getOrderById(id);
        if (!existingOrder) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }
        await orderModel_1.default.deleteOrderById(id);
        return res.status(200).json({ message: "Xóa đơn hàng thành công" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const cancelOrderByAdmin = async (req, res) => {
    try {
        const account = req.account;
        if (!account) {
            return res.status(401).json({
                message: "Bạn chưa đăng nhập",
                type: "error",
            });
        }
        const { orderId, reason } = req.body;
        if (!orderId || isNaN(Number(orderId))) {
            return res.status(400).json({
                message: "orderId không hợp lệ",
                type: "error",
            });
        }
        const cancelOrder = await orderModel_1.default.cancelOrderByAdmin(Number(orderId), reason);
        if (cancelOrder) {
            return res
                .status(200)
                .json({ message: "Đã hủy đơn hàng thành công", type: "success" });
        }
        return res.status(404).json({ message: "Lỗi không hủy đơn hàng được" });
    }
    catch (error) {
        console.error(error);
        if (error.message === "Order not found") {
            return res.status(404).json({
                message: "Không tìm thấy đơn hàng",
                type: "error",
            });
        }
        if (error.message === "Order is not eligible for cancel") {
            return res.status(400).json({
                message: "Đơn hàng không thể hủy",
                type: "error",
            });
        }
        return res.status(500).json({
            message: "Lỗi server",
            type: "error",
        });
    }
};
const cancelOrderByUserId = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                message: "Bạn chưa đăng nhập",
                type: "error",
            });
        }
        const { orderId } = req.params;
        const { reason } = req.body;
        if (!orderId || isNaN(Number(orderId))) {
            return res.status(400).json({
                message: "orderId không hợp lệ",
                type: "error",
            });
        }
        const cancelOrder = await orderModel_1.default.cancelOrderByUserId(Number(orderId), userId, reason);
        if (cancelOrder) {
            return res
                .status(200)
                .json({ message: "Đã hủy đơn hàng thành công", type: "success" });
        }
        return res.status(404).json({ message: "Lỗi không hủy đơn hàng được" });
    }
    catch (error) {
        console.error(error);
        if (error.message === "Order not found") {
            return res.status(404).json({
                message: "Không tìm thấy đơn hàng",
                type: "error",
            });
        }
        if (error.message === "Order is not eligible for cancel") {
            return res.status(400).json({
                message: "Đơn hàng không thể hủy",
                type: "error",
            });
        }
        return res.status(500).json({
            message: "Lỗi server",
            type: "error",
        });
    }
};
const returnOrderByUserId = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                message: "Bạn chưa đăng nhập",
                type: "error",
            });
        }
        const { orderItemId } = req.params;
        const { reason } = req.body || {};
        const files = req.files;
        const image_urls = files.map((file) => file.path);
        if (!orderItemId || isNaN(Number(orderItemId))) {
            return res.status(400).json({
                message: "orderId không hợp lệ",
                type: "error",
            });
        }
        const updatedOrder = await orderModel_1.default.returnOrderByUserId(Number(orderItemId), userId, reason, JSON.stringify(image_urls));
        return res.status(201).json({
            message: "Đã gửi yêu cầu trả đơn hàng thành công",
            type: "success",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi server",
            type: "error",
        });
    }
};
const updateOrderStatusById = async (req, res) => {
    try {
        const { orderId } = req.params;
        if (!orderId || isNaN(Number(orderId))) {
            return res.status(400).json({ message: "Invalid orderId" });
        }
        const updatedOrder = await orderModel_1.default.updateOrderStatusById(Number(orderId));
        if (updatedOrder.receiver_email) {
            (0, order_producer_1.publishOrderStatusUpdateEmail)({
                to: updatedOrder.receiver_email,
                receiverName: updatedOrder.receiver_name,
                orderId: updatedOrder.id,
                statusName: updatedOrder.status.name,
                statusHex: updatedOrder.status.hex,
            });
        }
        return res.status(200).json({
            message: "Đã cập nhật trạng thái đơn hàng",
            data: updatedOrder,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Internal Server Error",
        });
    }
};
const confirmOrderReceived = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                message: "Bạn chưa đăng nhập",
                type: "error",
            });
        }
        const { orderId } = req.params;
        if (!orderId || isNaN(Number(orderId))) {
            return res.status(400).json({ message: "Invalid orderId" });
        }
        const OrderReceived = await orderModel_1.default.confirmOrderReceived(Number(orderId), userId);
        return res.status(200).json({
            message: "Nhận hàng thành công",
            data: OrderReceived,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Internal Server Error",
        });
    }
};
const getTotalOrders = async (req, res) => {
    try {
        const { start, end } = (0, parseDateRange_1.parseDateRange)(req.query);
        const orders = await orderModel_1.default.getTotalOrders(start, end);
        res.json({
            message: "Lấy số lượng đơn hàng thành công",
            data: orders,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
const getTotalSoldProducts = async (req, res) => {
    try {
        const { start, end } = (0, parseDateRange_1.parseDateRange)(req.query);
        const totalProductsSold = await orderModel_1.default.getTotalSoldProducts(start, end);
        return res.status(200).json({
            message: "Lấy tổng sản phẩm đã bán thành công",
            data: totalProductsSold,
            type: "success",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Lỗi server",
            type: "error",
        });
    }
};
const getLatestPendingOrders = async (req, res) => {
    try {
        const orders = await orderModel_1.default.getLatestPendingOrders();
        res.status(200).json({
            data: orders,
            message: "Lấy danh sách đơn hàng thành công",
            type: "success",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Lỗi server",
            type: "error",
        });
    }
};
const orderController = {
    getMyOrders,
    createOrder,
    getAllOrders,
    getOrderById,
    getTotalOrders,
    updateOrderById,
    deleteOrderById,
    cancelOrderByAdmin,
    cancelOrderByUserId,
    returnOrderByUserId,
    confirmOrderReceived,
    getTotalSoldProducts,
    updateOrderStatusById,
    getLatestPendingOrders,
};
exports.default = orderController;
