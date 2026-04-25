"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pointRuleModel_1 = __importDefault(require("../models/pointRuleModel"));
const createPointRule = async (req, res) => {
    try {
        const { point, discount_type, discount_value } = req.body || {};
        const pointNum = Number(point);
        const pointExist = await pointRuleModel_1.default.checkPoint(pointNum);
        if (pointExist) {
            return res
                .status(400)
                .json({ message: "Lỗi: đã có quy tắc về point này", type: "error" });
        }
        const data = {
            discount_type,
            discount_value,
            required_points: pointNum,
        };
        const pointRule = await pointRuleModel_1.default.createPointRule(data);
        res.status(201).json({
            message: "Tạo dữ liệu thành công",
            type: "success",
            data: pointRule,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const getPointRules = async (req, res) => {
    try {
        const pointRules = await pointRuleModel_1.default.getAllPointRules();
        res.status(200).json({
            message: "Lấy dữ liệu các quy tắc điểm thưởng thành công",
            type: "success",
            data: pointRules,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const updatePointRuleById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const pointRuleExist = await pointRuleModel_1.default.getPointRuleById(id);
        if (!pointRuleExist) {
            return res.status(400).json({ message: "Không tồn tại điểm thưởng này" });
        }
        const { point, discount_type, discount_value, is_active } = req.body || {};
        const updateData = {};
        if (point !== undefined)
            updateData.required_points = point;
        if (discount_type !== undefined)
            updateData.discount_type = discount_type;
        if (discount_value !== undefined)
            updateData.discount_value = discount_value;
        if (Object.keys(updateData).length === 0) {
            return res
                .status(400)
                .json({ message: "Không có dữ liệu để cập nhật", type: "error" });
        }
        const pointRule = await pointRuleModel_1.default.updatePointRuleById(id, updateData);
        return res.status(200).json({
            message: "Cập nhật quy tắc điểm thưởng thành công",
            type: "success",
            data: pointRule,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const deletePointRuleById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const pointRuleExist = await pointRuleModel_1.default.getPointRuleById(id);
        if (!pointRuleExist) {
            return res.status(400).json({ message: "Không tồn tại điểm thưởng này" });
        }
        await pointRuleModel_1.default.deletePointRuleById(id);
        const pointRules = await pointRuleModel_1.default.getAllPointRules();
        res.status(200).json({
            message: "Xóa dữ liệu các quy tắc điểm thưởng thành công",
            type: "success",
            data: pointRules,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const getPointRuleById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const pointRule = await pointRuleModel_1.default.getPointRuleById(id);
        if (!pointRule) {
            return res.status(400).json({ message: "Không tồn tại điểm thưởng này" });
        }
        res.status(200).json({
            message: "Lấy dữ liệu quy tắc điểm thưởng thành công",
            type: "success",
            data: pointRule,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const toggleActivePointRule = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const pointRuleExist = await pointRuleModel_1.default.getPointRuleById(id);
        if (!pointRuleExist) {
            return res.status(400).json({ message: "Không tồn tại điểm thưởng này" });
        }
        await pointRuleModel_1.default.toggleActivePointRule(id);
        res.status(200).json({
            message: "Đã chuyển trạng thái của điểm thưởng",
            type: "success",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server", type: "error" });
    }
};
const pointRuleController = {
    getPointRules,
    createPointRule,
    getPointRuleById,
    updatePointRuleById,
    deletePointRuleById,
    toggleActivePointRule,
};
exports.default = pointRuleController;
