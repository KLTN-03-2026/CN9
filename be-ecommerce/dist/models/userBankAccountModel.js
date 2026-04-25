"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const createUserBankAccount = async (data) => await PrismaClient_1.default.userBankAccount.create({
    data,
});
const togglePrimaryUserbankAccount = async (id, userId) => {
    return await PrismaClient_1.default.$transaction([
        PrismaClient_1.default.userBankAccount.updateMany({
            where: {
                userId,
                is_primary: true,
            },
            data: { is_primary: false },
        }),
        PrismaClient_1.default.userBankAccount.update({
            where: { id },
            data: { is_primary: true },
        }),
    ]);
};
const getAllUserBankAccount = async (userId) => await PrismaClient_1.default.userBankAccount.findMany({
    where: { userId },
    orderBy: {
        is_primary: "desc",
    },
});
const userBankAccountModel = {
    createUserBankAccount,
    getAllUserBankAccount,
    togglePrimaryUserbankAccount,
};
exports.default = userBankAccountModel;
