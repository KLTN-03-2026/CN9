import dotenv from "dotenv";

dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import apiRouter from "./routes/api";
import passport from "./config/passport.config";

import { initRabbitMQ } from "./services/rabbitmq/connection";
import orderConsumer from "./services/rabbitmq/order/order.consumer";
import { initCronJobs } from "./cron";
import { globalLimiter } from "./config/rateLimiter.config";
import userConsumer from "./services/rabbitmq/user/user.consumer";

const app = express();
const server = http.createServer(app);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use(
  cors({
    origin: [
      "http://localhost:5174",
      "http://localhost:5173",
      "http://localhost:5175",
      "http://localhost:3001",
    ],
    credentials: true,
  }),
);

app.use("/api", globalLimiter, apiRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

server.listen(process.env.PORT, () => {
  console.log(`✅ Server chạy tại: http://localhost:${process.env.PORT}`);
  initCronJobs();
});

async function bootstrap() {
  await initRabbitMQ();

  await orderConsumer.startOrderConfirmationEmailConsumer();
  await orderConsumer.startOrderStatusUpdateEmailConsumer();
  await userConsumer.startVerifyEmailConsumer();
}

bootstrap();
