"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const genderController_1 = __importDefault(require("../../controllers/genderController"));
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const router = (0, express_1.Router)();
router.get("/", verifyToken_1.default, genderController_1.default.getGenders);
router.post("/", verifyToken_1.default, genderController_1.default.createGender);
router.put("/:genderId", verifyToken_1.default, genderController_1.default.updateGenderById);
router.delete("/:genderId", verifyToken_1.default, genderController_1.default.deleteGenderById);
exports.default = router;
