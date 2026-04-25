"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const createRole = async (data) => {
    return await PrismaClient_1.default.$transaction(async (tx) => {
        const role = await tx.role.create({
            data: {
                name_role: data.name_role,
                description: data.description,
            },
        });
        const permissions = await tx.permission.findMany({
            where: {
                id: { in: data.permissions },
            },
            select: { id: true, name: true, groupId: true },
        });
        await tx.rolePermission.createMany({
            data: permissions.map((p) => ({
                roleId: role.id,
                permissionId: p.id,
            })),
        });
        const groupIds = [...new Set(permissions.map((p) => p.groupId))];
        const allGroups = await tx.permissionGroup.findMany({
            select: { id: true },
        });
        const enabledGroupSet = new Set(groupIds);
        await tx.rolePermissionGroup.createMany({
            data: allGroups.map((group) => ({
                roleId: role.id,
                permissionGroupId: group.id,
                is_enabled: enabledGroupSet.has(group.id),
            })),
        });
        return { ...role, permissions: permissions.map((per) => per.name) };
    });
};
const getRoles = async () => {
    const roles = await PrismaClient_1.default.role.findMany({
        include: {
            _count: { select: { accounts: true } },
        },
    });
    return roles.map(({ _count, name_role, ...rest }) => ({
        ...rest,
        name: name_role,
        roleCount: _count.accounts,
    }));
};
const updateRoleById = async (id, data) => {
    return await PrismaClient_1.default.role.update({ where: { id }, data });
};
const deleteRoleById = async (id) => {
    return await PrismaClient_1.default.role.delete({ where: { id } });
};
const getRoleById = async (id) => {
    const role = await PrismaClient_1.default.role.findUnique({
        where: { id },
        include: {
            rolePermissions: { select: { permissionId: true } },
        },
    });
    if (!role)
        return null;
    const { rolePermissions, name_role, ...rest } = role;
    return {
        ...rest,
        name: name_role,
        permissions: rolePermissions.map((per) => per.permissionId),
    };
};
const checkName = async (name) => {
    const existingName = await PrismaClient_1.default.permission.findFirst({ where: { name } });
    return !!existingName;
};
const checkNameExcludeId = async (name, id) => {
    const existingName = await PrismaClient_1.default.permission.findFirst({
        where: { name, NOT: { id } },
    });
    return !!existingName;
};
const roleModel = {
    getRoles,
    checkName,
    createRole,
    getRoleById,
    updateRoleById,
    deleteRoleById,
    checkNameExcludeId,
};
exports.default = roleModel;
