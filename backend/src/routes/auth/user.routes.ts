import { Router } from "express";
import {
  changeCurrentPassword,
  forgotPasswordRequest,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  resendEmailVerification,
  resetForgottenPassword,
  verifyEmail,
} from "../../controllers/auth/user.controller";
import { verifyJWT } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validation.middleware";
import {
  registerUserSchema,
  loginUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  refreshTokenSchema,
} from "../../validations/user.validation";

const router = Router();

// Unsecured routes
router.route("/register").post(validate(registerUserSchema), registerUser);
router.route("/login").post(validate(loginUserSchema), loginUser);
router.route("/refresh-token").post(validate(refreshTokenSchema), refreshAccessToken);
router.route("/verify-email/:verificationToken").get(verifyEmail);
router.route("/forgot-password").post(validate(forgotPasswordSchema), forgotPasswordRequest);
router.route("/reset-password/:resetToken").post(validate(resetPasswordSchema), resetForgottenPassword);

// Secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/change-password").post(verifyJWT, validate(changePasswordSchema), changeCurrentPassword);
router
  .route("/resend-email-verification")
  .post(verifyJWT, resendEmailVerification);

router.route("/current-user").get(verifyJWT, getCurrentUser);

export default router;
