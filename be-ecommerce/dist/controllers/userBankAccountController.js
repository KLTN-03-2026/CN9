"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userBankAccountModel_1 = __importDefault(require("../models/userBankAccountModel"));
const createUserBankAccount = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Vui lòng đăng nhập" });
        }
        const { bankCode, bankName, accountNo, accountName } = req.body;
        if (!bankCode || !bankName || !accountNo || !accountName) {
            return res.status(400).json({
                message: "Thiếu thông tin tài khoản ngân hàng",
            });
        }
        const bank = await userBankAccountModel_1.default.createUserBankAccount({
            accountName,
            accountNo,
            bankCode,
            bankName,
            userId,
        });
        return res.status(200).json({
            message: "Tạo ngân hàng thành công",
            data: bank,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi server",
        });
    }
};
const togglePrimaryUserbankAccount = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Vui lòng đăng nhập" });
        }
        const { id } = req.params;
        const bank = await userBankAccountModel_1.default.togglePrimaryUserbankAccount(Number(id), userId);
        return res.status(200).json({
            message: "Chuyển đổi thành công",
            data: bank,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi server",
        });
    }
};
const getAllUserBankAccount = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Vui lòng đăng nhập" });
        }
        const banks = await userBankAccountModel_1.default.getAllUserBankAccount(userId);
        return res.status(200).json({
            message: "Lấy danh sách tài khoản ngân hàng thành công",
            data: banks ?? [],
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi server",
        });
    }
};
const userBankAccountController = {
    createUserBankAccount,
    getAllUserBankAccount,
    togglePrimaryUserbankAccount,
};
exports.default = userBankAccountController;
