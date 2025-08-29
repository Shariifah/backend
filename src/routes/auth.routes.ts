import express from "express";
import authController from "../controllers/auth.controller";
import {
  validateRequestOtpData,
  validateVerifyOtpData,
  validateRegisterWithOtpData,
  validateLoginData,
  validateResendOtpData, validateChangePasswordData, validateResetPasswordWithOtpData
} from "../middlewares/validationMiddleware";
import {authenticateToken} from "../middlewares/authMiddleware";

const router = express.Router();

// FLOW D'INSCRIPTION AVEC OTP

// Étape 1 : Demande d'OTP pour inscription
router.post("/request-otp", validateRequestOtpData, authController.requestOtp.bind(authController));

// Étape 2 : Vérification de l'OTP
router.post("/verify-otp", validateVerifyOtpData, authController.verifyOtp.bind(authController));

// Étape 3 : Inscription finale avec token OTP
router.post("/register", validateRegisterWithOtpData, authController.register.bind(authController));

// 🔹 RENVOI D'OTP (optionnel)
router.post("/resend-otp", validateResendOtpData, authController.resendOtp.bind(authController));

// 🔹 AUTHENTIFICATION
router.post("/login", validateLoginData, authController.login.bind(authController));

// MOT DE PASSE OUBLIÉ
router.post("/forgotPassword/request-otp", validateRequestOtpData, authController.requestPasswordResetOtp.bind(authController));
router.post("/forgotPassword/verify-otp", validateVerifyOtpData, authController.verifyPasswordResetOtp.bind(authController));
router.post("/forgotPassword/reset", validateResetPasswordWithOtpData, authController.resetPassword.bind(authController));
router.post("/forgotPassword/resend-otp", validateResendOtpData, authController.resendPasswordResetOtp.bind(authController));

// CHANGEMENT DE MOT DE PASSE (Utilisateur connecté)
router.post("/change-password", authenticateToken, validateChangePasswordData, authController.changePassword.bind(authController));


export default router;
