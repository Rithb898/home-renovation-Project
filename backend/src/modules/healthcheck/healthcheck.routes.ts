import { Router } from "express";
import { healthcheck } from "./healthcheck.controller.js";

const router: Router = Router();

router.route("/").get(healthcheck);

export default router;