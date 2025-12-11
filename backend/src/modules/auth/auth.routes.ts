import { Router } from "express";
import { signin, signup, checkEmail } from "./auth.controller.js";

const router: Router = Router();

router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/check-email").post(checkEmail);

export default router;
