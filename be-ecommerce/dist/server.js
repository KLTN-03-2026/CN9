"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = __importDefault(require("http"));
const api_1 = __importDefault(require("./routes/api"));
const connection_1 = require("./services/rabbitmq/connection");
const order_consumer_1 = __importDefault(require("./services/rabbitmq/order/order.consumer"));
const cron_1 = require("./cron");
const rateLimiter_config_1 = require("./config/rateLimiter.config");
const user_consumer_1 = __importDefault(require("./services/rabbitmq/user/user.consumer"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5174",
        "http://localhost:5173",
        "http://localhost:5175",
        "http://localhost:3001",
    ],
    credentials: true,
}));
app.use("/api", rateLimiter_config_1.globalLimiter, api_1.default);
app.get("/", (req, res) => {
    res.send("Hello World");
});
server.listen(process.env.PORT, () => {
    console.log(`✅ Server chạy tại: http://localhost:${process.env.PORT}`);
    (0, cron_1.initCronJobs)();
});
async function bootstrap() {
    await (0, connection_1.initRabbitMQ)();
    await order_consumer_1.default.startOrderConfirmationEmailConsumer();
    await order_consumer_1.default.startOrderStatusUpdateEmailConsumer();
    await user_consumer_1.default.startVerifyEmailConsumer();
}
bootstrap();
