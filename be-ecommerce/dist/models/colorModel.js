"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const createColor = async (data) => await PrismaClient_1.default.color.create({ data });
const updateColorById = async (id, data) => await PrismaClient_1.default.color.update({ where: { id }, data });
const deleteColorById = async (id) => await PrismaClient_1.default.color.delete({ where: { id } });
const getColors = async () => {
    const colors = await PrismaClient_1.default.color.findMany();
    return colors.map((color) => {
        const { name_color, ...rest } = color;
        return { ...rest, name: name_color };
    });
};
const findColorById = async (id) => {
    const existingColor = await PrismaClient_1.default.color.findUnique({
        where: { id },
    });
    return !!existingColor;
};
const checkName = async (name) => {
    const existingName = await PrismaClient_1.default.color.findFirst({
        where: { name_color: name },
    });
    return !!existingName;
};
const checkNameExcludeId = async (name, id) => {
    const existingName = await PrismaClient_1.default.color.findFirst({
        where: { name_color: name, NOT: { id } },
    });
    return !!existingName;
};
const checkHex = async (hex) => {
    const existingHex = await PrismaClient_1.default.color.findFirst({
        where: { hex },
    });
    return !!existingHex;
};
const checkHexExcludeId = async (hex, id) => {
    const existingHex = await PrismaClient_1.default.color.findFirst({
        where: { hex, NOT: { id } },
    });
    return !!existingHex;
};
const colorModel = {
    checkHex,
    getColors,
    checkName,
    createColor,
    findColorById,
    deleteColorById,
    updateColorById,
    checkHexExcludeId,
    checkNameExcludeId,
};
exports.default = colorModel;
