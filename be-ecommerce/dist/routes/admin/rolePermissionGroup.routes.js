"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rolePermissionGroupController_1 = __importDefault(require("../../controllers/rolePermissionGroupController"));
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const router = express_1.default.Router();
router.post("/", verifyToken_1.default, rolePermissionGroupController_1.default.assignPermissionGroupToRole);
router.get("/", verifyToken_1.default, rolePermissionGroupController_1.default.getAllRolesWithPermissionGroups);
router.get("/role/:roleId", verifyToken_1.default, rolePermissionGroupController_1.default.getRolePermissionGroups);
router.put("/:roleId/:permissionGroupId", verifyToken_1.default, rolePermissionGroupController_1.default.updateRolePermissionGroup);
router.delete("/:roleId/:permissionGroupId", verifyToken_1.default, rolePermissionGroupController_1.default.removePermissionGroupFromRole);
exports.default = router;
