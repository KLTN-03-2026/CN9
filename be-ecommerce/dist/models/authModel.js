"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const loginAccount = async (data) => {
    const existingAccount = await PrismaClient_1.default.account.findUnique({
        where: { email: data.email },
        select: {
            id: true,
            name: true,
            email: true,
            password: true,
            avatar: true,
            role: {
                select: {
                    name_role: true,
                    rolePermissions: {
                        select: { permission: { select: { name: true } } },
                    },
                },
            },
            is_active: true,
        },
    });
    if (!existingAccount) {
        return {
            success: false,
            errors: { email: "Bạn nhập email sai" },
        };
    }
    if (!existingAccount?.is_active) {
        return {
            success: false,
            errors: { email: "Tài khoản đã bị khóa" },
        };
    }
    const passwordMatch = await bcryptjs_1.default.compare(data.password, existingAccount.password);
    if (!passwordMatch) {
        return {
            success: false,
            errors: { password: "Bạn nhập mật khẩu sai" },
        };
    }
    const { password, ...safeAccount } = existingAccount;
    return {
        success: true,
        id: safeAccount.id,
        email: safeAccount.email,
        avatar: safeAccount.avatar,
        username: safeAccount.name,
        role: safeAccount.role.name_role,
        is_active: safeAccount.is_active,
        permissions: safeAccount.role.rolePermissions.map((permission) => permission.permission.name),
    };
};
const loginUser = async (data) => {
    const existingUser = await PrismaClient_1.default.user.findUnique({
        where: { email: data.email },
        select: {
            id: true,
            name: true,
            email: true,
            password: true,
            avatar: true,
            is_active: true,
            points: true,
        },
    });
    if (!existingUser) {
        return {
            success: false,
            errors: { email: "Bạn nhập email sai" },
        };
    }
    if (!existingUser?.is_active) {
        return {
            success: false,
            errors: { email: "Tài khoản đã bị khóa" },
        };
    }
    const passwordMatch = await bcryptjs_1.default.compare(data.password, existingUser.password);
    if (!passwordMatch) {
        return {
            success: false,
            errors: { password: "Bạn nhập mật khẩu sai" },
        };
    }
    const { password, ...safeUser } = existingUser;
    return {
        success: true,
        id: safeUser.id,
        email: safeUser.email,
        avatar: safeUser.avatar || "",
        username: safeUser.name,
        is_active: safeUser.is_active,
        points: safeUser.points,
    };
};
const authModel = { loginAccount, loginUser };
exports.default = authModel;
