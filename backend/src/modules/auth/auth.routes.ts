import { Router } from "express";
import { signin, signup } from "./auth.controller.js";

const router: Router = Router();

router.route("/signup").post(signup);
router.route("/signin").post(signin);

export default router;
