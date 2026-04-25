"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const assignPermissionGroupToRole = async (data) => {
    return PrismaClient_1.default.rolePermissionGroup.upsert({
        where: {
            roleId_permissionGroupId: {
                roleId: data.roleId,
                permissionGroupId: data.permissionGroupId,
            },
        },
        update: { is_enabled: data.is_enabled },
        create: data,
    });
};
const getRolePermissionGroups = async (roleId) => {
    return PrismaClient_1.default.rolePermissionGroup.findMany({
        where: { roleId },
        select: { permissionGroupId: true, is_enabled: true },
    });
};
const getAllRolesWithPermissionGroups = async () => {
    return PrismaClient_1.default.role.findMany({
        include: {
            rolePermissionGroups: {
                include: {
                    permissionGroup: true,
                },
            },
        },
    });
};
const updateRolePermissionGroup = async (roleId, permissionGroupId, is_enabled) => {
    return PrismaClient_1.default.rolePermissionGroup.update({
        where: {
            roleId_permissionGroupId: { roleId, permissionGroupId },
        },
        data: { is_enabled },
    });
};
const removePermissionGroupFromRole = async (roleId, permissionGroupId) => {
    return PrismaClient_1.default.rolePermissionGroup.delete({
        where: {
            roleId_permissionGroupId: { roleId, permissionGroupId },
        },
    });
};
const checkRolePermissionGroupExists = async (roleId, permissionGroupId) => {
    return PrismaClient_1.default.rolePermissionGroup.findUnique({
        where: {
            roleId_permissionGroupId: { roleId, permissionGroupId },
        },
    });
};
const rolePermissionGroupModel = {
    getRolePermissionGroups,
    updateRolePermissionGroup,
    assignPermissionGroupToRole,
    removePermissionGroupFromRole,
    checkRolePermissionGroupExists,
    getAllRolesWithPermissionGroups,
};
exports.default = rolePermissionGroupModel;
