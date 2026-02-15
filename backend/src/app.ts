import express from "express";
import type { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morganMiddleware from "./logger/morgan.logger";

const app: Application = express();

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", limiter);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(cookieParser());

app.use(morganMiddleware);

import healthCheckRouter from "./routes/healthcheck.routes";
import userRouter from "./routes/auth/user.routes";
import todoRouter from "./routes/todo/todo.routes";
import categoryRouter from "./routes/category/category.routes";
import { errorHandler } from "./middlewares/error.middleware";


app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/todos", todoRouter);
app.use("/api/v1/categories", categoryRouter);

app.use(errorHandler);
export default app;
