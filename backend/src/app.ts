import express from "express";
import type { Application, Request, Response } from "express";
import cors from "cors";
import healthcheckroute from "./modules/healthcheck/healthcheck.routes.js";
import authroutes from "./modules/auth/auth.routes.js";
import { prisma } from "./lib/db.js";
import { redis } from "./lib/redis.js";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);

app.use("/api/healthcheck", healthcheckroute);
app.use("/api/auth", authroutes);

app.get("/test/user", async (req: Request, res: Response) => {
  const cache = await redis.get("user");
  if (cache) {
    // console.log("hit");
    return res.json(JSON.parse(cache));
  }
  // console.log("miss");
  const user = await prisma.user.findMany();
  await redis.set("user", JSON.stringify(user));
  return res.json(user);
});

export default app;
