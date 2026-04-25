"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const createSizeGuide = async (data) => {
    let sizeGuide = await PrismaClient_1.default.sizeGuide.findFirst({
        where: {
            categoryId: data.categoryId,
            sizeId: data.sizeId,
        },
    });
    if (!sizeGuide) {
        sizeGuide = await PrismaClient_1.default.sizeGuide.create({
            data: {
                categoryId: data.categoryId,
                sizeId: data.sizeId,
            },
        });
    }
    const sizeMeasurement = await PrismaClient_1.default.sizeMeasurement.create({
        data: {
            sizeGuideId: sizeGuide.id,
            measurementTypeId: data.measurementId,
            min: data.min,
            max: data.max,
        },
    });
    return sizeMeasurement;
};
const updateSizeGuideById = async (sizeGuideId, sizeMeasurementId, data) => {
    return await PrismaClient_1.default.$transaction(async (tx) => {
        const sizeGuide = await tx.sizeGuide.update({
            where: { id: sizeGuideId },
            data: {
                ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
                ...(data.sizeId !== undefined && { sizeId: data.sizeId }),
            },
        });
        const sizeMeasurement = await tx.sizeMeasurement.update({
            where: { id: sizeMeasurementId, sizeGuideId },
            data: {
                ...(data.min !== undefined && { min: data.min }),
                ...(data.max !== undefined && { max: data.max }),
                ...(data.measurementId !== undefined && {
                    measurementTypeId: data.measurementId,
                }),
            },
        });
        return { sizeGuide, sizeMeasurement };
    });
};
const getSizeGuideByCategory = async (categoryId) => {
    const data = await PrismaClient_1.default.sizeGuide.findMany({
        where: { categoryId },
        include: {
            size: {
                select: {
                    id: true,
                    Symbol: true,
                },
            },
            measurements: {
                include: {
                    measurementType: {
                        select: {
                            id: true,
                            name: true,
                            unit: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            sizeId: "asc",
        },
    });
    const result = {};
    const sizes = [];
    data.forEach((item) => {
        const sizeSymbol = item.size.Symbol;
        if (!sizes.includes(sizeSymbol)) {
            sizes.push(sizeSymbol);
        }
        item.measurements.forEach((m) => {
            const measurementName = `${m.measurementType.name} (${m.measurementType.unit})`;
            if (!result[measurementName]) {
                result[measurementName] = {
                    measurementType: measurementName,
                };
            }
            result[measurementName][sizeSymbol] = {
                id: m.id,
                min: m.min,
                max: m.max,
            };
        });
    });
    return {
        sizes,
        data: Object.values(result),
    };
};
const getSizeGuideById = async (sizeGuideId, sizeMeasurementId) => {
    return await PrismaClient_1.default.sizeGuide.findFirst({
        where: {
            id: sizeGuideId,
            measurements: {
                some: {
                    id: sizeMeasurementId,
                },
            },
        },
        include: {
            size: true,
            category: true,
            measurements: {
                where: {
                    id: sizeMeasurementId,
                },
                include: {
                    measurementType: true,
                },
            },
        },
    });
};
const getSizeGuideByIdSizeMeasurement = async (sizeMeasurementId) => {
    const sizeGuides = await PrismaClient_1.default.sizeMeasurement.findUnique({
        where: { id: sizeMeasurementId },
        select: {
            measurementTypeId: true,
            max: true,
            min: true,
            sizeGuideId: true,
            sizeGuide: { select: { sizeId: true, categoryId: true } },
        },
    });
    if (!sizeGuides) {
        throw new Error("");
    }
    const { sizeGuide, measurementTypeId, ...rest } = sizeGuides;
    return {
        ...rest,
        measurementId: measurementTypeId,
        categoryId: sizeGuide.categoryId,
        sizeId: sizeGuide.sizeId,
    };
};
const sizeGuideModel = {
    createSizeGuide,
    getSizeGuideById,
    updateSizeGuideById,
    getSizeGuideByCategory,
    getSizeGuideByIdSizeMeasurement,
};
exports.default = sizeGuideModel;
