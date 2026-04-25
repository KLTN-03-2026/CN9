"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const permissionGroupModel_1 = __importDefault(require("../models/permissionGroupModel"));
const createPermissionGroup = async (req, res) => {
    try {
        const { name, label, description } = req.body || {};
        const nameExist = await permissionGroupModel_1.default.checkName(name);
        if (nameExist) {
            return res
                .status(400)
                .json({ message: "Lỗi: trùng tên quyền", type: "error" });
        }
        const labelExist = await permissionGroupModel_1.default.checkLabel(label);
        if (labelExist) {
            return res
                .status(400)
                .json({ message: "Lỗi: trùng tên nhóm quyền", type: "error" });
        }
        const permissionGroup = await permissionGroupModel_1.default.createPermissionGroup({
            name,
            label,
            description,
        });
        res.status(201).json({
            message: "Tạo dữ liệu thành công",
            type: "success",
            data: permissionGroup,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const getPermissionGroups = async (req, res) => {
    try {
        const permissionGroups = await permissionGroupModel_1.default.getPermissionGroups();
        res.status(200).json({
            message: "Lấy dữ liệu các nhóm quyền thành công",
            type: "success",
            data: permissionGroups,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const updatePermissionGroupById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const permissionGroupExist = await permissionGroupModel_1.default.getPermissionGroupById(id);
        if (!permissionGroupExist) {
            return res
                .status(400)
                .json({ message: "Không tồn tại nhóm permission này" });
        }
        const { name, label, description, sort_order } = req.body || {};
        const updateData = {};
        if (name !== undefined)
            updateData.name = name;
        if (label !== undefined)
            updateData.label = label;
        if (description !== undefined)
            updateData.description = description;
        if (sort_order !== undefined)
            updateData.sort_order = sort_order;
        if (Object.keys(updateData).length === 0) {
            return res
                .status(400)
                .json({ message: "Không có dữ liệu để cập nhật", type: "error" });
        }
        const permissionGroup = await permissionGroupModel_1.default.updatePermissionGroupById(id, updateData);
        return res.status(200).json({
            message: "Cập nhật nhóm permission thành công",
            type: "success",
            data: permissionGroup,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const deletePermissionGroupById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const permissionGroupExist = await permissionGroupModel_1.default.getPermissionGroupById(id);
        if (!permissionGroupExist) {
            return res
                .status(400)
                .json({ message: "Không tồn tại nhóm permission này" });
        }
        await permissionGroupModel_1.default.deletePermissionGroupById(id);
        const permissionGroup = await permissionGroupModel_1.default.getPermissionGroups();
        return res.status(200).json({
            message: "Xóa dữ liệu thành công",
            data: permissionGroup,
            type: "success",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const getPermissionGroupById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const permissionGroup = await permissionGroupModel_1.default.getPermissionGroupById(id);
        if (!permissionGroup) {
            return res
                .status(400)
                .json({ message: "Không tồn tại nhóm permission này" });
        }
        res.status(200).json({
            message: "Lấy dữ liệu các nhóm quyền thành công",
            type: "success",
            data: permissionGroup,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const permissionGroupController = {
    getPermissionGroups,
    createPermissionGroup,
    getPermissionGroupById,
    updatePermissionGroupById,
    deletePermissionGroupById,
};
exports.default = permissionGroupController;
