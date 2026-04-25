"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("../connection");
const queues_1 = require("../queues");
const mail_service_1 = require("../../mail/mail.service");
const startOrderConfirmationEmailConsumer = async () => {
    const channel = (0, connection_1.getChannel)();
    await channel.assertQueue(queues_1.QUEUES.ORDER_CONFIRMATION_EMAIL, { durable: true });
    channel.consume(queues_1.QUEUES.ORDER_CONFIRMATION_EMAIL, async (msg) => {
        if (!msg)
            return;
        try {
            const payload = JSON.parse(msg.content.toString());
            await (0, mail_service_1.sendOrderConfirmationEmail)(payload);
            console.log(`✅ Sent order confirmation email to ${payload.to}`);
            channel.ack(msg);
        }
        catch (error) {
            console.error("Order email consumer error:", error);
            channel.nack(msg, false, false);
        }
    });
};
const startOrderStatusUpdateEmailConsumer = async () => {
    const channel = (0, connection_1.getChannel)();
    await channel.assertQueue(queues_1.QUEUES.ORDER_STATUS_UPDATE_EMAIL, {
        durable: true,
    });
    channel.consume(queues_1.QUEUES.ORDER_STATUS_UPDATE_EMAIL, async (msg) => {
        if (!msg)
            return;
        try {
            const payload = JSON.parse(msg.content.toString());
            await (0, mail_service_1.sendOrderStatusUpdateEmail)(payload);
            console.log(`✅ Sent order status update email to ${payload.to}`);
            channel.ack(msg);
        }
        catch (error) {
            console.error("Order status email consumer error:", error);
            channel.nack(msg, false, false);
        }
    });
};
const orderConsumer = {
    startOrderConfirmationEmailConsumer,
    startOrderStatusUpdateEmailConsumer,
};
exports.default = orderConsumer;
