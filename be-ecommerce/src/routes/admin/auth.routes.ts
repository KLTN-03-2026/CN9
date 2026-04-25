import { Router } from "express";
import authController from "../../controllers/authController";
import verifyToken from "../../middlewares/verifyToken";
import passport from "../../config/passport.config";

const router = Router();

router.post("/login", authController.loginAccount);

router.post("/logout", authController.logout);

router.get("/me", verifyToken, authController.getInfoAccount);

// Google OAuth for Admin
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`, session: false }),
  authController.googleAdminCallback,
);

export default router;
