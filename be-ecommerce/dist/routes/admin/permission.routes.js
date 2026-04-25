"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const permissionController_1 = __importDefault(require("../../controllers/permissionController"));
const checkRole_1 = require("../../middlewares/checkRole");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const router = (0, express_1.Router)();
router.post("/", verifyToken_1.default, 
// checkRole(["admin"]),
permissionController_1.default.createPermission);
router.put("/:permissionId", verifyToken_1.default, (0, checkRole_1.checkRole)(["admin"]), permissionController_1.default.updatePermissionById);
router.delete("/:permissionId", verifyToken_1.default, (0, checkRole_1.checkRole)(["admin"]), permissionController_1.default.deletePermissionById);
router.get("/", verifyToken_1.default, 
// checkRole(["admin"]),
permissionController_1.default.getPermissions);
router.get("/:permissionId", verifyToken_1.default, 
// checkRole(["admin"]),
permissionController_1.default.getPermissionById);
exports.default = router;
