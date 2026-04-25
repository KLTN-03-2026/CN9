"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const permissionGroupController_1 = __importDefault(require("../../controllers/permissionGroupController"));
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const router = (0, express_1.Router)();
router.post("/", verifyToken_1.default, permissionGroupController_1.default.createPermissionGroup);
router.get("/", verifyToken_1.default, permissionGroupController_1.default.getPermissionGroups);
router.get("/:id", verifyToken_1.default, permissionGroupController_1.default.getPermissionGroupById);
router.put("/:id", verifyToken_1.default, permissionGroupController_1.default.updatePermissionGroupById);
router.delete("/:id", verifyToken_1.default, permissionGroupController_1.default.deletePermissionGroupById);
exports.default = router;
