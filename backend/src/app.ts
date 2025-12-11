import express from "express";
import type { Application, Request, Response } from "express";
import cors from "cors";
import healthcheckroute from "./modules/healthcheck/healthcheck.routes.js";
import authroutes from "./modules/auth/auth.routes.js";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
  })
);

app.use("/api/healthcheck", healthcheckroute);
app.use("/api/auth", authroutes);

export default app;
