"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const createMeasurement = async (data) => await PrismaClient_1.default.measurementType.create({
    data,
});
const checkName = async (name) => await PrismaClient_1.default.measurementType.findUnique({ where: { name } });
const getMeasurementById = async (id) => await PrismaClient_1.default.measurementType.findUnique({ where: { id } });
const getAllMeasurement = async () => await PrismaClient_1.default.measurementType.findMany();
const updateMeasurementById = async (id, data) => PrismaClient_1.default.measurementType.update({
    where: { id },
    data,
});
const deleteMeasurementById = async (id) => await PrismaClient_1.default.measurementType.delete({
    where: { id },
});
const measurementModel = {
    checkName,
    createMeasurement,
    getAllMeasurement,
    getMeasurementById,
    updateMeasurementById,
    deleteMeasurementById,
};
exports.default = measurementModel;
