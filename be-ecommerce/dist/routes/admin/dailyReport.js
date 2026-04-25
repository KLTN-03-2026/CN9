"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dailyReportController_1 = __importDefault(require("../../controllers/dailyReportController"));
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const router = express_1.default.Router();
router.post("/", verifyToken_1.default, dailyReportController_1.default.generateYesterdayReport);
router.get("/day", verifyToken_1.default, dailyReportController_1.default.getDailyReportsByDay);
router.get("/month", verifyToken_1.default, dailyReportController_1.default.getDailyReportsByMonth);
router.get("/year", verifyToken_1.default, dailyReportController_1.default.getRevenueByYear);
exports.default = router;
