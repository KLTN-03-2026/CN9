"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const measurementModel_1 = __importDefault(require("../models/measurementModel"));
const createMeasurement = async (req, res) => {
    try {
        const { name, unit } = req.body || {};
        if (!name || !unit) {
            return res.status(400).json({
                message: "Thiếu name hoặc unit",
            });
        }
        const nameExist = await measurementModel_1.default.checkName(name);
        if (nameExist) {
            return res.status(400).json({
                message: "Tên đo lường đã tồn tại",
            });
        }
        const measurement = await measurementModel_1.default.createMeasurement({
            name,
            unit,
        });
        return res
            .status(200)
            .json({ message: "Thêm tên đo lường mới thành công", data: measurement });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Lỗi" });
    }
};
const getAllMeasurement = async (req, res) => {
    try {
        const measurements = await measurementModel_1.default.getAllMeasurement();
        return res.status(200).json({
            message: "Lấy danh sách đo lường thành công",
            data: measurements || [],
        });
    }
    catch (error) {
        console.error("getAllMeasurement error:", error);
        return res.status(500).json({
            message: "Lỗi server",
        });
    }
};
const updateMeasurementById = async (req, res) => {
    try {
        const id = parseInt(req.params.measurementId);
        if (isNaN(id)) {
            return res.status(400).json({
                message: "ID đo lường không hợp lệ",
            });
        }
        const measurementExist = await measurementModel_1.default.getMeasurementById(id);
        if (!measurementExist) {
            return res.status(404).json({
                message: "Measurement không tồn tại",
            });
        }
        const { name, unit } = req.body || {};
        const updateData = {};
        if (name !== undefined)
            updateData.name = name;
        if (unit !== undefined)
            updateData.unit = unit;
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });
        }
        if (name !== undefined) {
            const nameExist = await measurementModel_1.default.checkName(name);
            if (nameExist && nameExist.id !== id) {
                return res.status(400).json({
                    message: "Tên đo lường đã tồn tại",
                });
            }
        }
        const measurement = await measurementModel_1.default.updateMeasurementById(id, {
            name,
            unit,
        });
        return res.status(200).json({
            message: "Cập nhật đo lường thành công",
            data: measurement,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Lỗi server",
        });
    }
};
const deleteMeasurementById = async (req, res) => {
    try {
        const id = parseInt(req.params.measurementId);
        if (!id) {
            return res.status(400).json({
                message: "ID đo lường không hợp lệ",
            });
        }
        const measurementExist = await measurementModel_1.default.getMeasurementById(id);
        if (!measurementExist) {
            return res.status(404).json({
                message: "Measurement không tồn tại",
            });
        }
        await measurementModel_1.default.deleteMeasurementById(id);
        return res.status(200).json({
            message: "Xóa đo lường thành công",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Lỗi server",
        });
    }
};
const getMeasurementById = async (req, res) => {
    try {
        const id = parseInt(req.params.measurementId);
        if (!id) {
            return res.status(400).json({
                message: "ID đo lường không hợp lệ",
            });
        }
        const measurement = await measurementModel_1.default.getMeasurementById(id);
        if (!measurement) {
            return res.status(404).json({
                message: "Measurement không tồn tại",
            });
        }
        return res
            .status(200)
            .json({ message: "Lấy dữ liệu thành công", data: measurement });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Lỗi server",
        });
    }
};
const measurementController = {
    createMeasurement,
    getAllMeasurement,
    getMeasurementById,
    updateMeasurementById,
    deleteMeasurementById,
};
exports.default = measurementController;
