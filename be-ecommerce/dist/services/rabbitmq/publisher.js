"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publish = publish;
const connection_1 = require("./connection");
function publish(queue, payload) {
    const channel = (0, connection_1.getChannel)();
    channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), {
        persistent: true,
    });
}
