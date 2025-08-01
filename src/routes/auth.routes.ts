import express from "express";
import authController from "../controllers/auth.controller";
import { 
  validateRequestOtpData, 
  validateVerifyOtpData, 
  validateRegisterWithOtpData, 
  validateLoginData, 
  validateResendOtpData
} from "../middlewares/validationMiddleware";

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


export default router;
