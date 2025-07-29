import express from "express";
import authController from "../controllers/auth.controller";
import { 
  validateRegistrationData, 
  validateLoginData, 
  validateSendOtpData, 
} from "../middlewares/validationMiddleware";

const router = express.Router();


router.post("/otp", validateSendOtpData, authController.sendOtp.bind(authController));
router.post("/register", validateRegistrationData, authController.register.bind(authController));
router.post("/login", validateLoginData, authController.login.bind(authController));


export default router;
