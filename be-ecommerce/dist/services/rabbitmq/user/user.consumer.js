"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("../connection");
const queues_1 = require("../queues");
const mail_service_1 = require("../../mail/mail.service");
const startVerifyEmailConsumer = async () => {
    const channel = (0, connection_1.getChannel)();
    await channel.assertQueue(queues_1.QUEUES.VERIFY_EMAIL, { durable: true });
    channel.consume(queues_1.QUEUES.VERIFY_EMAIL, async (msg) => {
        if (!msg)
            return;
        try {
            const payload = JSON.parse(msg.content.toString());
            await (0, mail_service_1.sendVerifyEmail)(payload);
            console.log(`✅ Sent verify email to ${payload.to}`);
            channel.ack(msg);
        }
        catch (error) {
            console.error("Verify email consumer error:", error);
            channel.nack(msg, false, false);
        }
    });
};
const userConsumer = {
    startVerifyEmailConsumer,
};
exports.default = userConsumer;
