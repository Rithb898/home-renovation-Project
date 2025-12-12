import { Router } from "express";
import {
  signin,
  signup,
  checkEmail,
  userSession,
  signout,
} from "./auth.controller.js";

const router: Router = Router();

router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/signout").get(signout);
router.route("/check-email").post(checkEmail);
router.route("/session").get(userSession);

export default router;
