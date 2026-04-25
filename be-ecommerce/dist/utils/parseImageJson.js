"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseImageJson = void 0;
const parseImageJson = (value) => {
    if (!value)
        return [];
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
    }
    catch {
        return [];
    }
};
exports.parseImageJson = parseImageJson;
