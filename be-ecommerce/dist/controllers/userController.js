"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const userValidation_1 = require("../validation/userValidation");
const order_producer_1 = require("../services/rabbitmq/order/order.producer");
const createUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body || {};
        const userData = { name, email, password, phone };
        const errors = (0, userValidation_1.userValidation)(userData);
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ message: "Dữ liệu không hợp lệ", data: errors, type: "error" });
        }
        const existingEmail = await userModel_1.default.getUserByEmail(email);
        if (existingEmail) {
            return res.status(400).json({ message: "Email đã tồn tại", type: "error" });
        }
        const existingName = await userModel_1.default.getUserByName(name);
        if (existingName) {
            return res.status(400).json({ message: "Name đã tồn tại", type: "error" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        userData.password = hashedPassword;
        const user = await userModel_1.default.createUser(userData);
        // Tạo verify token hết hạn 24h
        const verifyToken = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "24h" });
        const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${verifyToken}`;
        (0, order_producer_1.publishVerifyEmail)({ to: user.email, name: user.name, verifyUrl });
        return res.status(201).json({
            message: "Tạo người dùng thành công. Vui lòng kiểm tra email để xác minh tài khoản.",
            type: "success",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const getUserById = async (req, res) => {
    try {
        const id = parseInt(req.user?.userId);
        if (!id) {
            return res
                .status(400)
                .json({ message: "ID người dùng không hợp lệ", type: "error" });
        }
        const user = await userModel_1.default.getUserById(id);
        if (!user) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy người dùng", type: "error" });
        }
        return res.status(200).json({
            message: "Lấy thông tin người dùng thành công",
            data: user,
            type: "success",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const updateUserById = async (req, res) => {
    try {
        const id = parseInt(req.user?.id);
        if (!id) {
            return res
                .status(400)
                .json({ message: "ID người dùng không hợp lệ", type: "error" });
        }
        const existingUser = await userModel_1.default.getUserById(id);
        if (!existingUser) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy người dùng", type: "error" });
        }
        const { name, phone, address, email, avatar, points } = req.body || {};
        const existingName = await userModel_1.default.checkNameExcludeId(name, id);
        if (!existingName) {
            return res
                .status(400)
                .json({ message: "Name đã tồn tại", type: "error" });
        }
        if (existingUser.points < 0 && points < 0) {
            return res
                .status(400)
                .json({ message: "không thể giảm point đi nữa", type: "error" });
        }
        const updateData = {};
        if (name !== undefined)
            updateData.name = name;
        if (phone !== undefined)
            updateData.phone = phone;
        if (email !== undefined)
            updateData.email = email;
        if (address !== undefined)
            updateData.address = address;
        if (avatar !== undefined)
            updateData.avatar = avatar;
        if (points !== undefined)
            updateData.points = points;
        if (Object.keys(updateData).length === 0) {
            return res
                .status(400)
                .json({ message: "Không có dữ liệu để cập nhật", type: "error" });
        }
        const errors = (0, userValidation_1.updateUserValidation)(updateData);
        if (Object.keys(errors).length > 0) {
            return res
                .status(400)
                .json({ message: "Dữ liệu không hợp lệ", errors, type: "error" });
        }
        const user = await userModel_1.default.updateUserById(id, updateData);
        return res.status(200).json({
            message: "Cập nhật người dùng thành công",
            data: user,
            type: "success",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const userController = {
    createUser,
    getUserById,
    updateUserById,
};
exports.default = userController;
