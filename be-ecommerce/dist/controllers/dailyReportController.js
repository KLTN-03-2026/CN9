"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dailyReportModel_1 = __importDefault(require("../models/dailyReportModel"));
const isValidDate = (d) => d instanceof Date && !Number.isNaN(d.getTime());
const generateYesterdayReport = async (req, res) => {
    try {
        const report = await dailyReportModel_1.default.generateYesterdayReport();
        return res.status(201).json({
            message: "Tạo DailyReport thành công",
            data: report,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const getDailyReportsByDay = async (req, res) => {
    try {
        const { date } = req.query;
        if (!date || typeof date !== "string") {
            return res.status(400).json({ message: "Thiếu tham số date" });
        }
        const targetDate = new Date(date);
        if (!isValidDate(targetDate)) {
            return res.status(400).json({ message: "date không hợp lệ" });
        }
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);
        const reports = await dailyReportModel_1.default.getDailyReportsByRange(startOfDay, endOfDay);
        return res.status(200).json({ data: reports });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const getDailyReportsByMonth = async (req, res) => {
    try {
        const { year, month } = req.query;
        if (!year ||
            !month ||
            typeof year !== "string" ||
            typeof month !== "string") {
            return res.status(400).json({ message: "Thiếu tham số year hoặc month" });
        }
        const y = parseInt(year, 10);
        const mInput = parseInt(month, 10);
        if (Number.isNaN(y) || Number.isNaN(mInput)) {
            return res.status(400).json({ message: "year hoặc month không hợp lệ" });
        }
        if (mInput < 1 || mInput > 12) {
            return res.status(400).json({ message: "month phải từ 1 đến 12" });
        }
        const m = mInput - 1;
        const startOfMonth = new Date(y, m, 1);
        const endOfMonth = new Date(y, m + 1, 0, 23, 59, 59, 999);
        const reports = await dailyReportModel_1.default.getDailyReportsByRange(startOfMonth, endOfMonth);
        return res.status(200).json({ data: reports });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const getRevenueByYear = async (req, res) => {
    try {
        const { year } = req.query;
        if (!year || typeof year !== "string") {
            return res.status(400).json({ message: "Thiếu tham số year" });
        }
        const y = parseInt(year, 10);
        const fullYearData = await dailyReportModel_1.default.getRevenueByYear(y);
        return res.status(200).json({
            message: "Dữ liệu năm " + year,
            data: fullYearData,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
const dailyReportController = {
    getRevenueByYear,
    getDailyReportsByDay,
    getDailyReportsByMonth,
    generateYesterdayReport,
};
exports.default = dailyReportController;
