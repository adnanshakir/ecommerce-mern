import { Router } from "express";
import passport from "passport";
import {
  validateRegisterUser,
  validateLoginUser,
} from "../validator/auth.validator.js";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
const router = Router();

/*
 * @description Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
router.post("/register", validateRegisterUser, registerUser);

/*
 * @description Login a user
 * @route POST /api/auth/login
 * @access Public
 */
router.post("/login", validateLoginUser, loginUser);

/*
 * @description Google OAuth login
 * @route GET /api/auth/google
 * @access Public
 */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

/*
 * @description Google OAuth callback
 * @route GET /api/auth/google/callback
 * @access Public
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
);

export default router;
