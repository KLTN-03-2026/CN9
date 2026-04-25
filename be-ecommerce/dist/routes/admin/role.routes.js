"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roleController_1 = __importDefault(require("../../controllers/roleController"));
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const router = (0, express_1.Router)();
router.post("/", roleController_1.default.createRole);
router.put("/:roleId", 
// verifyToken,
// checkRole(["admin"]),
roleController_1.default.updateRoleById);
router.delete("/:roleId", 
// verifyToken,
//   checkRole(["admin"]),
roleController_1.default.deleteRoleById);
router.get("/", verifyToken_1.default, roleController_1.default.getRoles);
router.get("/:roleId", verifyToken_1.default, roleController_1.default.getRoleById);
exports.default = router;
