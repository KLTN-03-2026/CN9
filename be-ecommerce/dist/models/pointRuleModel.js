"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const createPointRule = async (data) => await PrismaClient_1.default.pointRule.create({ data });
const getAllPointRules = async () => {
    const pointRules = await PrismaClient_1.default.pointRule.findMany({
        where: { is_active: true },
    });
    return pointRules.map((pointRule) => {
        const { required_points, ...rest } = pointRule;
        return { ...rest, point: required_points };
    });
};
const getPointRuleById = async (id) => await PrismaClient_1.default.pointRule.findUnique({ where: { id } });
const updatePointRuleById = async (id, data) => await PrismaClient_1.default.pointRule.update({ where: { id }, data });
const deletePointRuleById = async (id) => await PrismaClient_1.default.pointRule.delete({ where: { id } });
const checkPoint = async (point) => {
    const pointExist = await PrismaClient_1.default.pointRule.findFirst({
        where: { required_points: point },
    });
    return !!pointExist;
};
const toggleActivePointRule = async (id) => {
    const pointRule = await PrismaClient_1.default.pointRule.findUnique({
        where: { id },
        select: { is_active: true },
    });
    if (!pointRule) {
        throw new Error("PointRule not found");
    }
    return PrismaClient_1.default.pointRule.update({
        where: { id },
        data: {
            is_active: !pointRule.is_active,
        },
    });
};
const pointRuleModel = {
    checkPoint,
    createPointRule,
    getAllPointRules,
    getPointRuleById,
    updatePointRuleById,
    deletePointRuleById,
    toggleActivePointRule,
};
exports.default = pointRuleModel;
