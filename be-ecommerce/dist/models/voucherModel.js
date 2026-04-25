"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const createVoucher = async (data) => await PrismaClient_1.default.voucher.create({ data });
const getVouchers = async (search, skip = 0, take = 10) => {
    const where = search ? { code: { contains: search.trim() } } : {};
    const [vouchers, total] = await Promise.all([
        PrismaClient_1.default.voucher.findMany({
            where,
            skip,
            take,
            include: { _count: { select: { orders: true } } },
            orderBy: { createdAt: "desc" },
        }),
        PrismaClient_1.default.voucher.count({ where }),
    ]);
    return {
        data: vouchers.map(({ _count, is_active, ...rest }) => ({
            ...rest,
            usedCount: _count.orders,
            isActive: is_active,
        })),
        total,
    };
};
const updateVoucherById = async (id, data) => await PrismaClient_1.default.voucher.update({ where: { id }, data });
const deleteVoucherById = async (id) => await PrismaClient_1.default.voucher.delete({ where: { id } });
const findVoucherById = async (id) => {
    const existingVoucher = await PrismaClient_1.default.voucher.findUnique({
        where: { id },
    });
    return !!existingVoucher;
};
const getVoucherById = async (id) => {
    return await PrismaClient_1.default.voucher.findUnique({
        where: { id },
        select: {
            id: true,
            code: true,
            description: true,
            min_order_value: true,
            usage_limit: true,
            discount_type: true,
            discount_value: true,
            start_date: true,
            end_date: true,
        },
    });
};
const checkCode = async (name) => {
    const existingCode = await PrismaClient_1.default.voucher.findFirst({
        where: { code: name },
    });
    return !!existingCode;
};
const checkCodeExcludeId = async (name, id) => {
    const existingCode = await PrismaClient_1.default.voucher.findFirst({
        where: { code: name, NOT: { id } },
    });
    return !!existingCode;
};
const getVoucherByCode = async (code, total, userId) => {
    const voucher = await PrismaClient_1.default.voucher.findUnique({
        where: { code },
        select: {
            id: true,
            discount_type: true,
            discount_value: true,
            min_order_value: true,
            usage_limit: true,
            start_date: true,
            end_date: true,
            is_active: true,
        },
    });
    if (!voucher) {
        throw new Error("Không có voucher");
    }
    if (!voucher.is_active) {
        throw new Error("Voucher không hoạt động");
    }
    const now = new Date();
    if (voucher.start_date && now < voucher.start_date) {
        throw new Error("Voucher chưa bắt đầu");
    }
    if (voucher.end_date && now > voucher.end_date) {
        throw new Error("Voucher đã hết hạn");
    }
    if (total < voucher.min_order_value.toNumber()) {
        throw new Error("Chưa đạt giá trị tối thiểu");
    }
    if (voucher.usage_limit !== null) {
        const usedCount = await PrismaClient_1.default.order.count({
            where: { voucherId: voucher.id },
        });
        if (usedCount >= voucher.usage_limit) {
            throw new Error("Voucher đã hết lượt sử dụng");
        }
    }
    const userUsed = await PrismaClient_1.default.order.findFirst({
        where: {
            voucherId: voucher.id,
            userId,
        },
    });
    if (userUsed) {
        throw new Error("Bạn đã sử dụng voucher này rồi");
    }
    return voucher;
};
const toggleVoucherActive = async (id, isActive) => {
    return await PrismaClient_1.default.voucher.update({
        where: { id },
        data: { is_active: isActive },
        select: {
            id: true,
            code: true,
        },
    });
};
const voucherModel = {
    checkCode,
    getVouchers,
    createVoucher,
    getVoucherById,
    findVoucherById,
    getVoucherByCode,
    updateVoucherById,
    deleteVoucherById,
    checkCodeExcludeId,
    toggleVoucherActive,
};
exports.default = voucherModel;
