"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colorModel_1 = __importDefault(require("../models/colorModel"));
const createColor = async (req, res) => {
    try {
        const { name, hex } = req.body || {};
        const nameExist = await colorModel_1.default.checkName(name);
        if (nameExist) {
            return res.status(400).json({ message: "Trùng name" });
        }
        const hexExist = await colorModel_1.default.checkHex(hex);
        if (hexExist) {
            return res.status(400).json({ message: "Trùng màu" });
        }
        const color = await colorModel_1.default.createColor({ name_color: name, hex });
        res.status(201).json({ message: "Tạo dữ liệu thành công", data: color });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
const getColors = async (req, res) => {
    try {
        const colors = await colorModel_1.default.getColors();
        res.status(200).json({ message: "Lấy dữ liệu thành công", data: colors });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
const updateColorById = async (req, res) => {
    try {
        const colorId = Number(req.params.colorId);
        const colorExist = await colorModel_1.default.findColorById(colorId);
        if (!colorExist) {
            return res.status(404).json({ messsage: "Color không tồn tại" });
        }
        const { name, hex } = req.body || {};
        if (name) {
            const nameExist = await colorModel_1.default.checkNameExcludeId(name, colorId);
            if (nameExist) {
                return res.status(400).json({ message: "Trùng name" });
            }
        }
        if (hex) {
            const hexExist = await colorModel_1.default.checkHexExcludeId(hex, colorId);
            if (hexExist) {
                return res.status(400).json({ message: "Trùng màu" });
            }
        }
        const dataUpdate = {};
        if (name !== undefined)
            dataUpdate.name_color = name;
        if (hex !== undefined)
            dataUpdate.hex = hex;
        if (Object.keys(dataUpdate).length === 0) {
            return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });
        }
        const color = await colorModel_1.default.updateColorById(colorId, dataUpdate);
        res.status(200).json({ message: "Cập nhật color thành công", data: color });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
const deleteColorById = async (req, res) => {
    try {
        const colorId = Number(req.params.colorId);
        const colorExist = await colorModel_1.default.findColorById(colorId);
        if (!colorExist) {
            return res.status(404).json({ messsage: "Color không tồn tại" });
        }
        await colorModel_1.default.deleteColorById(colorId);
        const remainingColors = await colorModel_1.default.getColors();
        res.status(200).json({ message: "Xóa thành công", data: remainingColors });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
const colorController = {
    getColors,
    createColor,
    updateColorById,
    deleteColorById,
};
exports.default = colorController;
