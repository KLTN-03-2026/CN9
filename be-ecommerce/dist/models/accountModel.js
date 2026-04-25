"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const createAccount = async (data) => await PrismaClient_1.default.account.create({ data });
const updateAccountById = async (id, data) => await PrismaClient_1.default.account.update({ where: { id }, data });
const getAccounts = async (search, skip = 0, take = 10) => {
    const where = search ? { name: { contains: search } } : {};
    const [accounts, total] = await Promise.all([
        PrismaClient_1.default.account.findMany({
            where,
            skip,
            take,
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                avatar: true,
                is_active: true,
                createdAt: true,
                updatedAt: true,
                role: { select: { name_role: true } },
            },
        }),
        PrismaClient_1.default.account.count({ where }),
    ]);
    return {
        data: accounts.map(({ role, is_active, ...rest }) => ({
            ...rest,
            nameRole: role.name_role,
            isActive: is_active,
        })),
        total,
    };
};
const deleteAccountById = async (id) => await PrismaClient_1.default.account.delete({ where: { id } });
const findAccountById = async (id) => {
    const existingAccount = await PrismaClient_1.default.account.findUnique({
        where: { id },
    });
    return !!existingAccount;
};
const checkEmail = async (email) => {
    const existingEmail = await PrismaClient_1.default.account.findUnique({ where: { email } });
    return !!existingEmail;
};
const checkName = async (name) => {
    const existingName = await PrismaClient_1.default.account.findFirst({ where: { name } });
    return !!existingName;
};
const checkEmailExcludeId = async (email, id) => {
    const existingEmail = await PrismaClient_1.default.account.findFirst({
        where: { email, NOT: { id } },
    });
    return !!existingEmail;
};
const checkNameExcludeId = async (name, id) => {
    const existingName = await PrismaClient_1.default.account.findFirst({
        where: { name, NOT: { id } },
    });
    return !!existingName;
};
const getAccountById = async (id) => {
    const account = await PrismaClient_1.default.account.findUnique({ where: { id } });
    if (!account) {
        return null;
    }
    const { password, ...safeAccount } = account;
    return safeAccount;
};
const toggleAccountActive = async (id, isActive) => {
    return await PrismaClient_1.default.account.update({
        where: { id },
        data: { is_active: isActive },
        select: {
            id: true,
            name: true,
            email: true,
        },
    });
};
const accountModel = {
    checkName,
    checkEmail,
    getAccounts,
    createAccount,
    getAccountById,
    findAccountById,
    updateAccountById,
    deleteAccountById,
    checkNameExcludeId,
    checkEmailExcludeId,
    toggleAccountActive,
};
exports.default = accountModel;
