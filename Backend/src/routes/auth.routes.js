import { Router } from "express";
import { validateRegisterUser, validateLoginUser } from "../validator/auth.validator.js";
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
router.post("/login", validateLoginUser, loginUser)

export default router;