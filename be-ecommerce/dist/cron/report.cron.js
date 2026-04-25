"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dailyReportCron = void 0;
const prisma_1 = require("../generated/prisma");
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const node_cron_1 = __importDefault(require("node-cron"));
const dailyReportCron = () => {
    node_cron_1.default.schedule("0 0 * * *", async () => {
        const reportDate = new Date();
        reportDate.setDate(reportDate.getDate() - 1);
        reportDate.setHours(0, 0, 0, 0);
        const startOfDay = new Date(reportDate);
        const endOfDay = new Date(reportDate);
        endOfDay.setHours(23, 59, 59, 999);
        const [users, orders, totalRevenueResult, productsSold] = await Promise.all([
            PrismaClient_1.default.user.count({
                where: { createdAt: { gte: startOfDay, lte: endOfDay } },
            }),
            PrismaClient_1.default.order.count({
                where: {
                    status: { code: "DELIVERED" },
                    createdAt: { gte: startOfDay, lte: endOfDay },
                },
            }),
            PrismaClient_1.default.payment.aggregate({
                _sum: { amount: true },
                where: {
                    status: "success",
                    received_at: { gte: startOfDay, lte: endOfDay },
                },
            }),
            PrismaClient_1.default.orderItem.aggregate({
                where: {
                    createdAt: { gte: startOfDay, lte: endOfDay },
                },
                _sum: { quantity: true },
            }),
        ]);
        const totalRevenue = totalRevenueResult._sum.amount ?? new prisma_1.Prisma.Decimal(0);
        const dailyReport = await PrismaClient_1.default.dailyReport.upsert({
            where: {
                report_date: reportDate,
            },
            update: {
                new_users: users,
                total_orders: orders,
                total_revenue: totalRevenue,
                total_products_sold: productsSold._sum.quantity || 0,
            },
            create: {
                report_date: reportDate,
                new_users: users,
                total_orders: orders,
                total_revenue: totalRevenue,
                total_products_sold: productsSold._sum.quantity || 0,
            },
        });
        console.log(`Daily report ${reportDate.toISOString()} saved, id=${dailyReport.id}`);
    }, { timezone: "Asia/Ho_Chi_Minh" });
};
exports.dailyReportCron = dailyReportCron;
