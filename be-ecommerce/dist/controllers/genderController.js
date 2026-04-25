"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const genderModel_1 = __importDefault(require("../models/genderModel"));
const slugify_1 = __importDefault(require("slugify"));
const createGender = async (req, res) => {
    try {
        const { name_gender } = req.body || {};
        const slug = (0, slugify_1.default)(name_gender, { lower: true, strict: true });
        const nameExist = await genderModel_1.default.checkName(name_gender);
        if (nameExist) {
            return res.status(400).json({ message: "Trùng name" });
        }
        const gender = await genderModel_1.default.createGender({
            name_gender,
            slug,
        });
        res.status(201).json({ message: "Tạo dữ liệu thành công", data: gender });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
const getGenders = async (req, res) => {
    try {
        const genders = await genderModel_1.default.getGenders();
        res.status(200).json({ message: "Lấy dữ liệu thành công", data: genders });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
const updateGenderById = async (req, res) => {
    try {
        const genderId = Number(req.params.genderId);
        const genderExist = await genderModel_1.default.findGenderById(genderId);
        if (!genderExist) {
            return res.status(404).json({ messsage: "Gender không tồn tại" });
        }
        const { name_gender } = req.body || {};
        if (name_gender) {
            const nameExist = await genderModel_1.default.checkNameExcludeId(name_gender, genderId);
            if (nameExist) {
                return res.status(400).json({ message: "Trùng name" });
            }
        }
        const dataUpdate = {};
        if (name_gender !== undefined)
            dataUpdate.name_gender = name_gender;
        if (Object.keys(dataUpdate).length === 0) {
            return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });
        }
        const gender = await genderModel_1.default.updateGenderById(genderId, dataUpdate);
        res
            .status(200)
            .json({ message: "Cập nhật gender thành công", data: gender });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
const deleteGenderById = async (req, res) => {
    try {
        const genderId = Number(req.params.genderId);
        const genderExist = await genderModel_1.default.findGenderById(genderId);
        if (!genderExist) {
            return res.status(404).json({ messsage: "Gender không tồn tại" });
        }
        await genderModel_1.default.deleteGenderById(genderId);
        const remainingGenders = await genderModel_1.default.getGenders();
        res.status(200).json({ message: "Xóa thành công", data: remainingGenders });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
const getCategoriesBySlugGender = async (req, res) => {
    try {
        const slug = req.params.slug;
        const gender = await genderModel_1.default.getCategoriesBySlugGender(slug);
        if (!gender) {
            return res
                .status(404)
                .json({ messsage: "Gender không tồn tại", type: "error" });
        }
        res.status(200).json({
            message: "lấy dữ liệu gender thành công",
            data: gender,
            type: "succes",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
const genderController = {
    getGenders,
    createGender,
    updateGenderById,
    deleteGenderById,
    getCategoriesBySlugGender,
};
exports.default = genderController;
