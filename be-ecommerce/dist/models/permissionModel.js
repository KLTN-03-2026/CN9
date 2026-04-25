"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const createPermission = async (data) => await PrismaClient_1.default.permission.create({
    data: {
        name: data.name,
        description: data.description,
        groupId: data.groupId,
        label: data.label,
    },
});
const updatePermissionById = async (id, data) => await PrismaClient_1.default.permission.update({ where: { id }, data });
const deletePermissionById = async (id) => await PrismaClient_1.default.permission.delete({ where: { id } });
const getPermissions = async (search) => {
    return await PrismaClient_1.default.permission.findMany({
        where: search
            ? {
                label: {
                    contains: search,
                },
            }
            : {},
    });
};
const getPermissionById = async (id) => await PrismaClient_1.default.permission.findUnique({
    where: { id },
});
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
const permissionModel = {
    checkName,
    getPermissions,
    createPermission,
    getPermissionById,
    checkNameExcludeId,
    updatePermissionById,
    deletePermissionById,
};
exports.default = permissionModel;
