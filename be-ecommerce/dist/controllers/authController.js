"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authModel_1 = __importDefault(require("../models/authModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
function createJWTAccount(accountId, username, role) {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    const token = jsonwebtoken_1.default.sign({ accountId, username, role }, JWT_SECRET, {
        expiresIn: "1h",
    });
    return token;
}
function createJWTUser(userId, username, avatar, points, email) {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    const token = jsonwebtoken_1.default.sign({ userId, username, avatar, points, email }, JWT_SECRET, {
        expiresIn: "1h",
    });
    return token;
}
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) {
            return res.status(400).json({
                message: "Email và mật khẩu là bắt buộc",
            });
        }
        const checkLogin = await authModel_1.default.loginUser({ email, password });
        if (!checkLogin.success) {
            return res.status(401).json(checkLogin.errors);
        }
        const token = createJWTUser(checkLogin.id, checkLogin.username, checkLogin.avatar ?? "", checkLogin.points, checkLogin.email);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60 * 60 * 1000,
        });
        return res.status(200).json({
            message: "Đăng nhập thành công",
            data: checkLogin,
            type: "success",
        });
    }
    catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: "Lỗi server",
        });
    }
};
const loginAccount = async (req, res) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) {
            return res.status(400).json({
                message: "Email và mật khẩu là bắt buộc",
            });
        }
        const checkLogin = await authModel_1.default.loginAccount({ email, password });
        if (!checkLogin.success) {
            return res.status(401).json(checkLogin);
        }
        const token = createJWTAccount(checkLogin.id, checkLogin.username, checkLogin.role);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60 * 60 * 1000,
        });
        return res.status(200).json({
            message: "Đăng nhập thành công",
            data: checkLogin,
            type: "success",
        });
    }
    catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: "Lỗi server",
        });
    }
};
const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
    });
    return res
        .status(200)
        .json({ message: "Đăng xuất thành công", type: "success" });
};
const getInfoAccount = async (req, res) => {
    try {
        const account = req.account;
        res.status(200).json({
            message: "Lấy thông tin thành công",
            data: account,
            type: "success",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const getInfoUser = async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({
            message: "Lấy thông tin thành công",
            data: user,
            type: "success",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        if (!token || typeof token !== "string") {
            return res.status(400).json({ message: "Token không hợp lệ", type: "error" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await userModel_1.default.getUserById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng", type: "error" });
        }
        if (user.is_verifyEmail) {
            return res.status(400).json({ message: "Email đã được xác minh trước đó", type: "error" });
        }
        await userModel_1.default.verifyUserEmail(decoded.userId);
        return res.status(200).json({ message: "Xác minh email thành công", type: "success" });
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return res.status(400).json({ message: "Link xác minh đã hết hạn", type: "error" });
        }
        return res.status(400).json({ message: "Token không hợp lệ", type: "error" });
    }
};
const authController = {
    logout,
    loginUser,
    verifyEmail,
    getInfoUser,
    loginAccount,
    getInfoAccount,
};
exports.default = authController;
