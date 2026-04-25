"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userModel_1 = __importDefault(require("../models/userModel"));
const accountModel_1 = __importDefault(require("../models/accountModel"));
const accountValidation_1 = __importDefault(require("../validation/accountValidation"));
const userValidation_1 = require("../validation/userValidation");
const parseDateRange_1 = require("../utils/parseDateRange");
const paginate_1 = require("../utils/paginate");
const createAccount = async (req, res) => {
    try {
        const { name, phone, email, password, roleId } = req.body || {};
        const accountVali = (0, accountValidation_1.default)({
            name,
            phone,
            email,
            password,
            roleId,
        });
        if (Object.keys(accountVali).length > 0) {
            return res.status(404).json(accountVali);
        }
        const emailExist = await accountModel_1.default.checkEmail(email);
        if (emailExist) {
            return res.status(500).json({ message: "Trùng email" });
        }
        const nameExist = await accountModel_1.default.checkName(name);
        if (nameExist) {
            return res.status(500).json({ message: "Trùng name" });
        }
        const intRoleId = parseInt(roleId);
        const passwordCrypto = await bcryptjs_1.default.hash(String(password), 10);
        const account = await accountModel_1.default.createAccount({
            name,
            email,
            phone,
            password: passwordCrypto,
            roleId: intRoleId,
        });
        res.status(200).json({
            message: "Tạo tài khoản thành công",
            data: account,
            type: "success",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const updateAccountById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const accountExist = await accountModel_1.default.findAccountById(id);
        if (!accountExist) {
            return res
                .status(404)
                .json({ message: "User không tồn tại", type: "error" });
        }
        const { name, email, password, roleId } = req.body || {};
        const file = req.file;
        if (email) {
            const emailExist = await accountModel_1.default.checkEmailExcludeId(email, id);
            if (emailExist) {
                return res.status(400).json({ message: "Trùng email", type: "error" });
            }
        }
        if (name) {
            const nameExist = await accountModel_1.default.checkNameExcludeId(name, id);
            if (nameExist) {
                return res.status(400).json({ message: "Trùng name", type: "error" });
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
            return res
                .status(400)
                .json({ message: "Không có dữ liệu để cập nhật", type: "error" });
        }
        const account = await accountModel_1.default.updateAccountById(id, dataUpdate);
        res.status(200).json({
            message: "Cập nhật tài khoản thành công",
            data: account,
            type: "success",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const deleteAccountById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const accountExist = await accountModel_1.default.findAccountById(id);
        if (!accountExist) {
            return res
                .status(404)
                .json({ message: "User không tồn tại", type: "error" });
        }
        await accountModel_1.default.deleteAccountById(id);
        const remainingAccounts = await accountModel_1.default.getAccounts();
        res.status(200).json({
            message: "Xóa tài khoản thành công",
            data: remainingAccounts,
            type: "success",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const getAccounts = async (req, res) => {
    try {
        const { page, limit, skip } = (0, paginate_1.getPaginationParams)(req.query);
        const search = req.query.search;
        const { data, total } = await accountModel_1.default.getAccounts(search, skip, limit);
        res.status(200).json({
            message: "Lấy dữ liệu tài khoản thành công",
            type: "success",
            ...(0, paginate_1.buildPaginatedResponse)(data, total, page, limit),
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const createUser = async (req, res) => {
    try {
        const { name, email, password, phone, address, avatar } = req.body || {};
        const userData = {
            name,
            email,
            password,
            phone,
            address,
            avatar,
        };
        const errors = (0, userValidation_1.userValidation)(userData);
        if (Object.keys(errors).length > 0) {
            return res
                .status(400)
                .json({ message: "Dữ liệu không hợp lệ", data: errors, type: "error" });
        }
        const existingEmail = await userModel_1.default.getUserByEmail(email);
        if (existingEmail) {
            return res
                .status(400)
                .json({ message: "Email đã tồn tại", type: "error" });
        }
        const existingName = await userModel_1.default.getUserByName(name);
        if (existingName) {
            return res
                .status(400)
                .json({ message: "Name đã tồn tại", type: "error" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        userData.password = hashedPassword;
        const user = await userModel_1.default.createUser(userData);
        return res.status(201).json({
            message: "Tạo người dùng thành công",
            data: user,
            type: "success",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const getAllUsers = async (req, res) => {
    try {
        const { page, limit, skip } = (0, paginate_1.getPaginationParams)(req.query);
        const search = req.query.search;
        const { data, total } = await userModel_1.default.getAllUsers(search, skip, limit);
        return res.status(200).json({
            message: "Lấy danh sách người dùng thành công",
            type: "success",
            ...(0, paginate_1.buildPaginatedResponse)(data, total, page, limit),
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const getUserById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
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
        const id = parseInt(req.params.id);
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
        const { name, phone, address, email, avatar, points, description, type } = req.body || {};
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
        if (description !== undefined)
            updateData.description = description;
        if (type !== undefined)
            updateData.type = type;
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
const deleteUserById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
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
        await userModel_1.default.deleteUserById(id);
        return res
            .status(200)
            .json({ message: "Xóa người dùng thành công", type: "success" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const searchUser = async (req, res) => {
    try {
        const nameUser = req.query.nameUser;
        if (!nameUser) {
            return res.status(400).json({
                message: "Không có tên người dùng cần tìm",
                type: "error",
            });
        }
        const users = await userModel_1.default.searchUser(nameUser);
        return res.status(200).json({
            message: "Tìm kiếm thành công",
            type: "success",
            data: users,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Lỗi server",
            type: "error",
        });
    }
};
const getTotalUsers = async (req, res) => {
    try {
        const { start, end } = (0, parseDateRange_1.parseDateRange)(req.query);
        const users = await userModel_1.default.getTotalUsers(start, end);
        res.json({
            message: "Lấy số lượng user thành công",
            data: users,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
const toggleUserActive = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        if (typeof isActive !== "boolean") {
            res.status(400).json({ message: "isActive phải là boolean" });
            return;
        }
        const user = await userModel_1.default.toggleUserActive(Number(id), isActive);
        res.status(200).json({
            message: isActive
                ? "Mở khóa tài khoản thành công"
                : "Khóa tài khoản thành công",
            data: user,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
const toggleAccountActive = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        if (typeof isActive !== "boolean") {
            res.status(400).json({ message: "isActive phải là boolean" });
            return;
        }
        const account = await accountModel_1.default.toggleAccountActive(Number(id), isActive);
        res.status(200).json({
            message: isActive
                ? "Mở khóa tài khoản thành công"
                : "Khóa tài khoản thành công",
            data: account,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
const adminController = {
    createUser,
    searchUser,
    getAccounts,
    getUserById,
    getAllUsers,
    getTotalUsers,
    createAccount,
    updateUserById,
    deleteUserById,
    toggleUserActive,
    updateAccountById,
    deleteAccountById,
    toggleAccountActive,
};
exports.default = adminController;
