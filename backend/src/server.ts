import express from "express";
import type { Application } from "express";

const app: Application = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API running..." });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
