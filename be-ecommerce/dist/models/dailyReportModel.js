"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDailyReportsByRange = void 0;
const date_fns_1 = require("date-fns");
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const isValidDate = (d) => d instanceof Date && !Number.isNaN(d.getTime());
const generateYesterdayReport = async () => {
    const start = (0, date_fns_1.startOfYesterday)();
    const end = (0, date_fns_1.endOfYesterday)();
    const totalOrders = await PrismaClient_1.default.order.count({
        where: {
            createdAt: {
                gte: start,
                lte: end,
            },
            status: {
                is_final: true, // hoặc status.name = 'completed'
            },
        },
    });
    const revenueResult = await PrismaClient_1.default.payment.aggregate({
        _sum: {
            amount: true,
        },
        where: {
            status: "success",
            payment_date: {
                gte: start,
                lte: end,
            },
        },
    });
    const totalRevenue = revenueResult._sum.amount || 0;
    const newUsers = await PrismaClient_1.default.user.count({
        where: {
            createdAt: {
                gte: start,
                lte: end,
            },
        },
    });
    return await PrismaClient_1.default.dailyReport.upsert({
        where: {
            report_date: start,
        },
        update: {
            total_orders: totalOrders,
            total_revenue: totalRevenue,
            new_users: newUsers,
        },
        create: {
            report_date: start,
            total_orders: totalOrders,
            total_revenue: totalRevenue,
            new_users: newUsers,
        },
    });
};
const getDailyReportsByRange = async (start, end) => {
    // Guard: tránh Prisma throw khi start/end bị parse lỗi (Invalid Date).
    if (!isValidDate(start) || !isValidDate(end)) {
        return [];
    }
    const rangeStart = start.getTime() <= end.getTime() ? start : end;
    const rangeEnd = start.getTime() <= end.getTime() ? end : start;
    const dailyReports = await PrismaClient_1.default.dailyReport.findMany({
        where: {
            report_date: { gte: rangeStart, lte: rangeEnd },
        },
    });
    return dailyReports.map((report) => {
        return {
            totalOrders: report.total_orders,
            totalUsers: report.new_users,
            totalRevenue: report.total_revenue,
            totalProductsSold: report.total_products_sold,
        };
    });
};
exports.getDailyReportsByRange = getDailyReportsByRange;
const getRevenueByYear = async (year) => {
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31, 23, 59, 59, 999);
    const reports = await PrismaClient_1.default.dailyReport.findMany({
        where: {
            report_date: {
                gte: start,
                lte: end,
            },
        },
    });
    const monthlyRevenue = Array(12).fill(0);
    reports.forEach((report) => {
        const month = new Date(report.report_date).getMonth();
        monthlyRevenue[month] += Number(report.total_revenue) || 0;
    });
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-based, 0 = Jan
    const maxMonth = year === currentYear ? currentMonth : 11;
    return monthlyRevenue
        .map((value, index) => ({ month: index + 1, revenue: value }))
        .filter((item) => item.month - 1 <= maxMonth); // loại bỏ tháng tương lai
};
const deleteDailyReportById = async (id) => await PrismaClient_1.default.dailyReport.delete({ where: { id } });
const dailyReportModel = {
    getRevenueByYear,
    deleteDailyReportById,
    getDailyReportsByRange: exports.getDailyReportsByRange,
    generateYesterdayReport,
};
exports.default = dailyReportModel;
