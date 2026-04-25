"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const pointRuleController_1 = __importDefault(require("../../controllers/pointRuleController"));
const router = (0, express_1.Router)();
router.get("/", verifyToken_1.default, pointRuleController_1.default.getPointRules);
router.post("/", verifyToken_1.default, pointRuleController_1.default.createPointRule);
router.get("/:id", verifyToken_1.default, pointRuleController_1.default.getPointRuleById);
router.put("/:id", verifyToken_1.default, pointRuleController_1.default.updatePointRuleById);
router.delete("/:id", verifyToken_1.default, pointRuleController_1.default.deletePointRuleById);
router.patch("/:id/toggle", verifyToken_1.default, pointRuleController_1.default.toggleActivePointRule);
exports.default = router;
