"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const createSize = async (data) => await PrismaClient_1.default.size.create({ data });
const getSizes = async () => {
    const sizes = await PrismaClient_1.default.size.findMany();
    return sizes.map((size) => {
        const { Symbol, name_size, id } = size;
        return { id, name: name_size, symbol: Symbol };
    });
};
const updateSizeById = async (id, data) => await PrismaClient_1.default.size.update({ where: { id }, data });
const deleteSizeById = async (id) => await PrismaClient_1.default.size.delete({ where: { id } });
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
const findSizeById = async (id) => {
    const existingSize = await PrismaClient_1.default.size.findUnique({
        where: { id },
    });
    return !!existingSize;
};
const sizeModel = {
    getSizes,
    checkName,
    createSize,
    findSizeById,
    updateSizeById,
    deleteSizeById,
    checkNameExcludeId,
};
exports.default = sizeModel;
