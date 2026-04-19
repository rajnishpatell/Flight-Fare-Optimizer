import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerification);

// Forgot + Reset Password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);



export default router;
