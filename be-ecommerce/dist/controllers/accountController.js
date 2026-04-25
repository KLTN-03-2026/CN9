"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const accountModel_1 = __importDefault(require("../models/accountModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const updateAccountById = async (req, res) => {
    try {
        const id = req.user?.id;
        const accountExist = await accountModel_1.default.findAccountById(id);
        if (!accountExist) {
            return res.status(404).json({ message: "User không tồn tại" });
        }
        const { name, email, password, roleId } = req.body || {};
        const file = req.file;
        if (email) {
            const emailExist = await accountModel_1.default.checkEmailExcludeId(email, id);
            if (emailExist) {
                return res.status(400).json({ message: "Trùng email" });
            }
        }
        if (name) {
            const nameExist = await accountModel_1.default.checkNameExcludeId(name, id);
            if (nameExist) {
                return res.status(400).json({ message: "Trùng name" });
            }
        }
        const dataUpdate = {};
        if (file)
            dataUpdate.avatar = file.path;
        if (name !== undefined)
            dataUpdate.name = name;
        if (email !== undefined)
            dataUpdate.email = email;
        if (roleId !== undefined)
            dataUpdate.roleId = Number(roleId);
        if (password !== undefined) {
            dataUpdate.password = await bcryptjs_1.default.hash(password, 10);
        }
        if (Object.keys(dataUpdate).length === 0) {
            return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });
        }
        const account = await accountModel_1.default.updateAccountById(id, dataUpdate);
        res.status(200).json(account);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
const getAccountById = async (req, res) => {
    try {
        const id = req.user?.id;
        const account = await accountModel_1.default.getAccountById(id);
        if (!account) {
            return res.status(400).json("Không tồn tại tài khoản này");
        }
        res.status(200).json({ message: "Lấy dữ liệu thành công", data: account });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
const accountController = {
    getAccountById,
    updateAccountById,
};
exports.default = accountController;
