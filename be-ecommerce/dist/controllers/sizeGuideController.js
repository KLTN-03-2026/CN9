"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sizeGuideModel_1 = __importDefault(require("../models/sizeGuideModel"));
const createSizeGuide = async (req, res) => {
    try {
        const { categoryId, sizeId, measurementId, min, max } = req.body;
        if (!categoryId || !sizeId || !measurementId) {
            return res.status(400).json({
                message: "Thiếu categoryId, sizeId hoặc measurementId",
            });
        }
        if (min == null || max == null) {
            return res.status(400).json({
                message: "Thiếu min hoặc max",
            });
        }
        if (min > max) {
            return res.status(400).json({
                message: "Min không được lớn hơn Max",
            });
        }
        const sizeGuide = await sizeGuideModel_1.default.createSizeGuide({
            categoryId: Number(categoryId),
            sizeId: Number(sizeId),
            measurementId: Number(measurementId),
            min: Number(min),
            max: Number(max),
        });
        return res.status(201).json({
            message: "Tạo size guide thành công",
            data: sizeGuide,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Lỗi server",
        });
    }
};
const updateSizeGuideById = async (req, res) => {
    try {
        const { sizeGuideId, sizeMeasurementId } = req.params;
        if (!sizeGuideId || !sizeMeasurementId) {
            return res.status(400).json({
                message: "Thiếu sizeGuideId hoặc sizeMeasurementId",
            });
        }
        const sizeGuideExist = await sizeGuideModel_1.default.getSizeGuideById(Number(sizeGuideId), Number(sizeMeasurementId));
        if (!sizeGuideExist) {
            return res.status(404).json({
                message: "Size guide hoặc measurement không tồn tại",
            });
        }
        const { categoryId, sizeId, measurementId, min, max } = req.body;
        const result = await sizeGuideModel_1.default.updateSizeGuideById(Number(sizeGuideId), Number(sizeMeasurementId), {
            categoryId,
            sizeId,
            measurementId,
            min,
            max,
        });
        return res.status(200).json({
            message: "Cập nhật size guide thành công",
            data: result,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi server",
        });
    }
};
const getSizeGuideByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        if (!categoryId) {
            return res.status(400).json({
                message: "Thiếu categoryId",
            });
        }
        const sizeGuides = await sizeGuideModel_1.default.getSizeGuideByCategory(Number(categoryId));
        return res.status(200).json({
            message: "Lấy size guide thành công",
            data: sizeGuides,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi server",
        });
    }
};
const getSizeGuideByIdSizeMeasurement = async (req, res) => {
    try {
        const sizeGuideId = Number(req.params.sizeGuideId);
        if (isNaN(sizeGuideId)) {
            return res.status(400).json({
                message: "ID không hợp lệ",
            });
        }
        const sizeGuide = await sizeGuideModel_1.default.getSizeGuideByIdSizeMeasurement(sizeGuideId);
        if (!sizeGuide) {
            return res.status(404).json({
                message: "Size guide không tồn tại",
            });
        }
        return res
            .status(200)
            .json({ message: "Lấy dữ liệu thành công", data: sizeGuide });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Lỗi server",
        });
    }
};
const sizeGuideController = {
    createSizeGuide,
    updateSizeGuideById,
    getSizeGuideByCategory,
    getSizeGuideByIdSizeMeasurement,
};
exports.default = sizeGuideController;
