import express from "express";
import type { Application, Request, Response } from "express";
import cors from "cors";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Home Renovation API");
});

export default app;