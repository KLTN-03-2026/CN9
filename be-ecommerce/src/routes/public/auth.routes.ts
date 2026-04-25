import { Router } from "express";
import authController from "../../controllers/authController";
import verifyToken from "../../middlewares/verifyToken";
import { authLimiter, verifyEmailLimiter } from "../../config/rateLimiter.config";
import passport from "../../config/passport.config";

const router = Router();

router.post("/login", authLimiter, authController.loginUser);

router.post("/logout", authController.logout);

router.get("/me", verifyToken, authController.getInfoUser);

router.get("/verify-email", verifyEmailLimiter, authController.verifyEmail);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`, session: false }),
  authController.googleCallback,
);

// Google OAuth Register
router.get(
  "/google/register",
  passport.authenticate("google", { scope: ["profile", "email"], session: false }),
);

router.get(
  "/google/register/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.CLIENT_URL}/register?error=google_failed`, session: false }),
  authController.googleRegisterCallback,
);

export default router;
