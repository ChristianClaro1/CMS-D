import { Router } from "express";
import { login, refresh, signup } from "../controllers/authController";

const router = Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/refresh", refresh);

export default router;
