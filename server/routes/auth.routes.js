import express from "express"
import { body } from "express-validator"
import { getMe, login, refreshToken, register } from "../controllers/auth.controller.js";
import protect from "../middleware/auth.js";
import validate from "../middleware/validate.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 3 }).withMessage("Name must be at least 3 characters"),
    body("email").isEmail().withMessage("Enter a valid email").normalizeEmail(),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  validate,
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Enter a valid email").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  login
);

router.post("/refresh-token", refreshToken);
router.get("/me", protect, getMe);

export default router;
