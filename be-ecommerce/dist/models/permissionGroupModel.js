"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const createPermissionGroup = async (data) => {
    const maxSort = await PrismaClient_1.default.permissionGroup.aggregate({
        _max: { sort_order: true },
    });
    const nextSortOrder = (maxSort._max.sort_order ?? 0) + 1;
    return PrismaClient_1.default.permissionGroup.create({
        data: {
            ...data,
            sort_order: nextSortOrder,
        },
    });
};
const updatePermissionGroupById = async (id, data) => await PrismaClient_1.default.permissionGroup.update({ where: { id }, data });
const getPermissionGroups = async () => {
    const permissionGroups = await PrismaClient_1.default.permissionGroup.findMany({
        include: {
            rolePermissionGroups: true,
            permissions: true,
            _count: {
                select: { permissions: true },
            },
        },
        orderBy: { sort_order: "asc" },
    });
    return permissionGroups.map(({ _count, ...rest }) => ({
        ...rest,
        permissionCount: _count.permissions,
    }));
};
const deletePermissionGroupById = async (id) => await PrismaClient_1.default.permissionGroup.delete({ where: { id } });
const getPermissionGroupById = async (id) => await PrismaClient_1.default.permissionGroup.findUnique({ where: { id } });
const checkName = async (name) => await PrismaClient_1.default.permissionGroup.findUnique({ where: { name } });
const checkNameExcludeId = async (name, id) => await PrismaClient_1.default.permissionGroup.findUnique({ where: { name, NOT: { id } } });
const checkLabel = async (label) => await PrismaClient_1.default.permissionGroup.findFirst({ where: { label } });
const checkLabelExcludeId = async (label, id) => await PrismaClient_1.default.permissionGroup.findFirst({ where: { label, NOT: { id } } });
const permissionGroupModel = {
    checkName,
    checkLabel,
    checkNameExcludeId,
    checkLabelExcludeId,
    getPermissionGroups,
    createPermissionGroup,
    getPermissionGroupById,
    deletePermissionGroupById,
    updatePermissionGroupById,
};
exports.default = permissionGroupModel;
