"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initRabbitMQ = initRabbitMQ;
exports.getChannel = getChannel;
const amqplib_1 = __importDefault(require("amqplib"));
let channel;
async function initRabbitMQ() {
    const conn = await amqplib_1.default.connect(process.env.RABBITMQ_URL);
    channel = await conn.createChannel();
}
function getChannel() {
    if (!channel)
        throw new Error("RabbitMQ not initialized");
    return channel;
}
