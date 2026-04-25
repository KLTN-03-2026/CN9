"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const roleModel_1 = __importDefault(require("../models/roleModel"));
const roleValidation_1 = __importDefault(require("../validation/roleValidation"));
const prisma_1 = require("../generated/prisma");
const createRole = async (req, res) => {
    try {
        const { name, description, permissions } = req.body || {};
        let permissionArr;
        if (Array.isArray(permissions)) {
            permissionArr = permissions.map(Number);
        }
        else {
            permissionArr = JSON.parse(permissions);
        }
        const roleVali = (0, roleValidation_1.default)({
            name_role: name,
            description,
            permissions: permissionArr,
        });
        if (Object.keys(roleVali).length > 0) {
            return res.status(404).json(roleVali);
        }
        const nameExist = await roleModel_1.default.checkName(name);
        if (nameExist) {
            return res.status(400).json({ message: "Trùng name", type: "error" });
        }
        const role = await roleModel_1.default.createRole({
            name_role: name,
            description,
            permissions: permissionArr,
        });
        res
            .status(200)
            .json({ message: "Tạo thành công", data: role, type: "success" });
    }
    catch (error) {
        if (error instanceof prisma_1.Prisma.PrismaClientValidationError) {
            return res.status(400).json({
                message: "Dữ liệu không hợp lệ",
                type: "error",
            });
        }
        if (error instanceof prisma_1.Prisma.PrismaClientKnownRequestError) {
            return res.status(400).json({
                message: error.meta?.cause || "Lỗi database",
                type: "error",
            });
        }
        return res.status(500).json({
            message: "Internal server error",
            type: "error",
        });
    }
};
const getRoles = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 4;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const roles = await roleModel_1.default.getRoles();
        const paginatedRoles = roles.slice(startIndex, endIndex);
        res.status(200).json({
            message: "Lấy dữ liệu các role thành công",
            data: paginatedRoles,
            page,
            limit,
            total: roles.length,
            totalPages: Math.ceil(roles.length / limit),
            type: "success",
        });
    }
    catch (error) {
        res.status(500).json({ message: error, type: "error" });
    }
};
const updateRoleById = async (req, res) => {
    try {
        const roleId = Number(req.params.roleId);
        if (isNaN(roleId)) {
            return res
                .status(400)
                .json({ message: "roleId không hợp lệ", type: "error" });
        }
        const roleExist = await roleModel_1.default.getRoleById(roleId);
        if (!roleExist) {
            return res
                .status(404)
                .json({ message: "Role không tồn tại", type: "error" });
        }
        const { name, description } = req.body || {};
        const nameExist = await roleModel_1.default.checkNameExcludeId(name, roleId);
        if (nameExist) {
            return res.status(400).json({ message: "Trùng name", type: "error" });
        }
        const dataUpdate = {};
        if (name !== undefined)
            dataUpdate.name_role = name;
        if (description !== undefined)
            dataUpdate.description = description;
        if (Object.keys(dataUpdate).length === 0) {
            return res
                .status(400)
                .json({ message: "Không có dữ liệu để cập nhật", type: "error" });
        }
        const role = await roleModel_1.default.updateRoleById(roleId, dataUpdate);
        res.status(200).json({
            message: "Cập nhật role thành công",
            data: role,
            type: "success",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const deleteRoleById = async (req, res) => {
    try {
        const { roleId } = req.params;
        const intRoleId = parseInt(roleId);
        const roleExist = await roleModel_1.default.getRoleById(intRoleId);
        if (!roleExist) {
            return res
                .status(404)
                .json({ message: "Role không tồn tại", type: "error" });
        }
        await roleModel_1.default.deleteRoleById(intRoleId);
        const role = await roleModel_1.default.getRoles();
        res
            .status(200)
            .json({ message: "Xóa thành công", data: role, type: "success" });
    }
    catch (error) {
        res.status(500).json({ message: error, type: "error" });
    }
};
const getRoleById = async (req, res) => {
    try {
        const { roleId } = req.params;
        const intRoleId = parseInt(roleId);
        const role = await roleModel_1.default.getRoleById(intRoleId);
        if (!role) {
            return res
                .status(404)
                .json({ message: "Role không tồn tại", type: "error" });
        }
        res.status(200).json({
            message: "Lấy dữ liệu của role thành công",
            data: role,
            type: "success",
        });
    }
    catch (error) {
        res.status(500).json({ message: error, type: "error" });
    }
};
const roleController = {
    getRoles,
    createRole,
    getRoleById,
    updateRoleById,
    deleteRoleById,
};
exports.default = roleController;
