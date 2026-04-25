"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rolePermissionGroupModel_1 = __importDefault(require("../models/rolePermissionGroupModel"));
const assignPermissionGroupToRole = async (req, res) => {
    try {
        const { roleId, permissionGroupId, is_enabled } = req.body || {};
        if (!roleId || !permissionGroupId) {
            return res.status(400).json({
                message: "Thiếu thông tin roleId hoặc permissionGroupId",
                type: "error",
            });
        }
        const rolePermissionGroup = await rolePermissionGroupModel_1.default.assignPermissionGroupToRole({
            roleId: Number(roleId),
            permissionGroupId: Number(permissionGroupId),
            is_enabled: is_enabled ?? true,
        });
        res.status(201).json({
            message: "Gán nhóm quyền cho vai trò thành công",
            type: "success",
            data: rolePermissionGroup,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const getRolePermissionGroups = async (req, res) => {
    try {
        const roleId = Number(req.params.roleId);
        if (!roleId) {
            return res.status(400).json({
                message: "Thiếu thông tin roleId",
                type: "error",
            });
        }
        const rolePermissionGroups = await rolePermissionGroupModel_1.default.getRolePermissionGroups(roleId);
        res.status(200).json({
            message: "Lấy dữ liệu thành công",
            type: "success",
            data: rolePermissionGroups,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const getAllRolesWithPermissionGroups = async (req, res) => {
    try {
        const rolesWithPermissionGroups = await rolePermissionGroupModel_1.default.getAllRolesWithPermissionGroups();
        res.status(200).json({
            message: "Lấy dữ liệu thành công",
            type: "success",
            data: rolesWithPermissionGroups,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const updateRolePermissionGroup = async (req, res) => {
    try {
        const { roleId, permissionGroupId } = req.params;
        const { is_enabled } = req.body || {};
        if (!roleId || !permissionGroupId) {
            return res.status(400).json({
                message: "Thiếu thông tin roleId hoặc permissionGroupId",
                type: "error",
            });
        }
        const exists = await rolePermissionGroupModel_1.default.checkRolePermissionGroupExists(Number(roleId), Number(permissionGroupId));
        if (!exists) {
            return res.status(404).json({
                message: "Không tìm thấy mối quan hệ này",
                type: "error",
            });
        }
        const updatedRolePermissionGroup = await rolePermissionGroupModel_1.default.updateRolePermissionGroup(Number(roleId), Number(permissionGroupId), is_enabled);
        res.status(200).json({
            message: "Cập nhật thành công",
            type: "success",
            data: updatedRolePermissionGroup,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const removePermissionGroupFromRole = async (req, res) => {
    try {
        const { roleId, permissionGroupId } = req.params;
        if (!roleId || !permissionGroupId) {
            return res.status(400).json({
                message: "Thiếu thông tin roleId hoặc permissionGroupId",
                type: "error",
            });
        }
        const exists = await rolePermissionGroupModel_1.default.checkRolePermissionGroupExists(Number(roleId), Number(permissionGroupId));
        if (!exists) {
            return res.status(404).json({
                message: "Không tìm thấy mối quan hệ này",
                type: "error",
            });
        }
        await rolePermissionGroupModel_1.default.removePermissionGroupFromRole(Number(roleId), Number(permissionGroupId));
        res.status(200).json({
            message: "Xóa nhóm quyền khỏi vai trò thành công",
            type: "success",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const rolePermissionGroupController = {
    getRolePermissionGroups,
    updateRolePermissionGroup,
    assignPermissionGroupToRole,
    removePermissionGroupFromRole,
    getAllRolesWithPermissionGroups,
};
exports.default = rolePermissionGroupController;
