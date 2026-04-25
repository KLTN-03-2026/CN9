"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = __importDefault(require("../../controllers/adminController"));
const checkRole_1 = require("../../middlewares/checkRole");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const upload_1 = require("../../middlewares/upload");
const router = (0, express_1.Router)();
router.get("/", verifyToken_1.default, adminController_1.default.getAccounts);
router.post("/", verifyToken_1.default, (0, checkRole_1.checkRole)(["admin"]), adminController_1.default.createAccount);
router.put("/:id", verifyToken_1.default, (0, checkRole_1.checkRole)(["admin"]), upload_1.uploadAvatarAccount.single("avatarAccount"), adminController_1.default.updateAccountById);
router.delete("/:id", verifyToken_1.default, (0, checkRole_1.checkRole)(["admin"]), adminController_1.default.deleteAccountById);
router.patch("/:id/active", verifyToken_1.default, adminController_1.default.toggleAccountActive);
//users
router.get("/users/search", verifyToken_1.default, adminController_1.default.searchUser);
router.get("/users/count", verifyToken_1.default, adminController_1.default.getTotalUsers);
router.post("/users/", verifyToken_1.default, upload_1.uploadAvatarUser.single("avatarUser"), adminController_1.default.createUser);
router.get("/users/", verifyToken_1.default, adminController_1.default.getAllUsers);
router.get("/users/:id", verifyToken_1.default, adminController_1.default.getUserById);
router.put("/users/:id", verifyToken_1.default, upload_1.uploadAvatarUser.single("avatarUser"), adminController_1.default.updateUserById);
router.patch("/users/:id/active", verifyToken_1.default, adminController_1.default.toggleUserActive);
router.delete("/users/:id", verifyToken_1.default, adminController_1.default.deleteUserById);
exports.default = router;
