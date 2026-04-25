"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDateRange = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
const TZ = "Asia/Ho_Chi_Minh";
const parseDateRange = (query) => {
    const { day, month, year } = query;
    let start;
    let end;
    if (day && month && year) {
        const d = Number(day);
        const m = Number(month);
        const y = Number(year);
        const date = dayjs_1.default.tz(`${y}-${m}-${d}`, TZ);
        start = date.startOf("day").toDate();
        end = date.endOf("day").toDate();
    }
    else if (month && year) {
        const m = Number(month);
        const y = Number(year);
        const date = dayjs_1.default.tz(`${y}-${m}-01`, TZ);
        start = date.startOf("month").toDate();
        end = date.endOf("month").toDate();
    }
    else if (year) {
        const y = Number(year);
        const date = dayjs_1.default.tz(`${y}-01-01`, TZ);
        start = date.startOf("year").toDate();
        end = date.endOf("year").toDate();
    }
    else {
        throw new Error("Missing date parameters");
    }
    return { start, end };
};
exports.parseDateRange = parseDateRange;
