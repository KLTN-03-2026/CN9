"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiSearch = void 0;
const ai_service_1 = require("../services/ai/ai.service");
const aiSearch = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ message: "Thiếu nội dung tin nhắn." });
        }
        const userId = req.user?.id;
        const { message: msg, data, type } = await (0, ai_service_1.parseUserQuery)(message, userId);
        res.json({ success: true, message: msg, data, role: "assistant", type });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "AI error" });
    }
};
exports.aiSearch = aiSearch;
