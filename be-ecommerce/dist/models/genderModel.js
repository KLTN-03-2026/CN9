"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PrismaClient_1 = __importDefault(require("../PrismaClient"));
const createGender = async (data) => await PrismaClient_1.default.gender.create({ data });
const getGenders = async () => await PrismaClient_1.default.gender.findMany();
const updateGenderById = async (id, data) => await PrismaClient_1.default.gender.update({ where: { id }, data });
const deleteGenderById = async (id) => await PrismaClient_1.default.gender.delete({ where: { id } });
const findGenderById = async (id) => {
    const existingGender = await PrismaClient_1.default.gender.findUnique({
        where: { id },
    });
    return !!existingGender;
};
const checkName = async (name) => {
    const existingName = await PrismaClient_1.default.permission.findFirst({ where: { name } });
    return !!existingName;
};
const checkNameExcludeId = async (name, id) => {
    const existingName = await PrismaClient_1.default.permission.findFirst({
        where: { name, NOT: { id } },
    });
    return !!existingName;
};
const getCategoriesBySlugGender = async (slug) => {
    const genderWithCategories = await PrismaClient_1.default.gender.findUnique({
        where: { slug },
        include: {
            categories: {
                select: {
                    id: true,
                    name_category: true,
                    image_category: true,
                    slug: true,
                },
            },
        },
    });
    if (!genderWithCategories)
        return [];
    return genderWithCategories.categories.map((cat) => ({
        id: cat.id,
        slug: cat.slug,
        name: cat.name_category,
        imageCategory: cat.image_category,
    }));
};
const genderModel = {
    checkName,
    getGenders,
    createGender,
    findGenderById,
    updateGenderById,
    deleteGenderById,
    checkNameExcludeId,
    getCategoriesBySlugGender,
};
exports.default = genderModel;
