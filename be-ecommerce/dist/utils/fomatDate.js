"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDateToString = void 0;
const formatDateToString = (date) => {
    return date
        .toISOString()
        .replace(/[-:.TZ]/g, "")
        .slice(0, 14);
};
exports.formatDateToString = formatDateToString;
