"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sizeModel_1 = __importDefault(require("../models/sizeModel"));
const createSize = async (req, res) => {
    try {
        const { name, symbol } = req.body || {};
        const nameExist = await sizeModel_1.default.checkName(name);
        if (nameExist) {
            return res.status(400).json({ message: "Trùng name" });
        }
        const size = await sizeModel_1.default.createSize({
            name_size: name,
            Symbol: symbol,
        });
        res.status(201).json({ message: "Tạo dữ liệu thành công", data: size });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
};
const getSizes = async (req, res) => {
    try {
        const sizes = await sizeModel_1.default.getSizes();
        res.status(200).json({ message: "Lấy dữ liệu thành công", data: sizes });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
};
const updateSizeById = async (req, res) => {
    try {
        const sizeId = Number(req.params.sizeId);
        const { name, Symbol } = req.body || {};
        if (name) {
            const nameExist = await sizeModel_1.default.checkNameExcludeId(name, sizeId);
            if (nameExist) {
                return res.status(400).json({ message: "Trùng name" });
            }
        }
        const dataUpdate = {};
        if (name !== undefined)
            dataUpdate.name_size = name;
        if (Symbol !== undefined)
            dataUpdate.Symbol = Symbol;
        if (Object.keys(dataUpdate).length === 0) {
            return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });
        }
        const size = await sizeModel_1.default.updateSizeById(sizeId, dataUpdate);
        res.status(200).json({ message: "Cập nhật size thành công", data: size });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
};
const deleteSizeById = async (req, res) => {
    try {
        const sizeId = Number(req.params.sizeId);
        const sizeExist = await sizeModel_1.default.findSizeById(sizeId);
        if (!sizeExist) {
            return res.status(404).json({ message: "size Không tồn tại" });
        }
        await sizeModel_1.default.deleteSizeById(sizeId);
        const remainingSize = await sizeModel_1.default.getSizes();
        res.status(200).json({ message: "Xóa thành công ", data: remainingSize });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
};
const sizeController = { getSizes, createSize, updateSizeById, deleteSizeById };
exports.default = sizeController;
