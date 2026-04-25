"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const permissionModel_1 = __importDefault(require("../models/permissionModel"));
const createPermission = async (req, res) => {
    try {
        const { name, description, groupId, label } = req.body || {};
        const nameExist = await permissionModel_1.default.checkName(name);
        if (nameExist) {
            return res.status(400).json({ message: "Trùng name" });
        }
        const intGroupId = parseInt(groupId);
        const permission = await permissionModel_1.default.createPermission({
            name,
            description,
            groupId: intGroupId,
            label,
        });
        res.status(201).json({
            message: "Tạo dữ liệu thành công",
            data: permission,
            type: "success",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const getPermissions = async (req, res) => {
    try {
        const search = req.query.search;
        const permissions = await permissionModel_1.default.getPermissions(search);
        res.status(200).json({
            message: "Lấy dữ liệu các quyền thành công",
            data: permissions,
            type: "success",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Lỗi server",
            type: "error",
        });
    }
};
const updatePermissionById = async (req, res) => {
    try {
        const permissionId = Number(req.params.permissionId);
        const permissionExist = await permissionModel_1.default.getPermissionById(permissionId);
        if (!permissionExist) {
            return res
                .status(404)
                .json({ message: "Permission không tồn tại", type: "error" });
        }
        const { name, description } = req.body || {};
        if (name) {
            const nameExist = await permissionModel_1.default.checkNameExcludeId(name, permissionId);
            if (nameExist) {
                return res.status(400).json({ message: "Trùng name", type: "error" });
            }
        }
        const dataUpdate = {};
        if (name !== undefined)
            dataUpdate.name = name;
        if (description !== undefined)
            dataUpdate.description = description;
        if (Object.keys(dataUpdate).length === 0) {
            return res
                .status(400)
                .json({ message: "Không có dữ liệu để cập nhật", type: "error" });
        }
        const permission = await permissionModel_1.default.updatePermissionById(permissionId, dataUpdate);
        res.status(200).json({
            message: "Cập nhật permission thành công",
            data: permission,
            type: "success",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const deletePermissionById = async (req, res) => {
    try {
        const permissionId = Number(req.params.permissionId);
        const permissionExist = await permissionModel_1.default.getPermissionById(permissionId);
        if (!permissionExist) {
            return res
                .status(404)
                .json({ message: "Permission không tồn tại", type: "error" });
        }
        await permissionModel_1.default.deletePermissionById(permissionId);
        const remainingPermissions = await permissionModel_1.default.getPermissions();
        res.status(200).json({
            message: "Xóa thành công",
            data: remainingPermissions,
            type: "success",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const getPermissionById = async (req, res) => {
    try {
        const permissionId = Number(req.params.permissionId);
        const permission = await permissionModel_1.default.getPermissionById(permissionId);
        if (!permission) {
            return res
                .status(404)
                .json({ message: "Permission không tồn tại", type: "error" });
        }
        res.status(200).json({
            message: "Lấy dữ liệu thành công",
            data: permission,
            type: "success",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const permissionController = {
    getPermissions,
    createPermission,
    getPermissionById,
    deletePermissionById,
    updatePermissionById,
};
exports.default = permissionController;
