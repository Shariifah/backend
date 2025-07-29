import { Request, Response } from "express";
import UserService from "../services/user.service";
import SmsService from "../services/sms.service";
import JwtService from "../services/jwt.service";
import { sendSuccess, sendError } from "../utils/responseHandler";
import { validateRegistration } from "../utils/validationHelper";


class AuthController {

    // 🔹 Inscription d'un merchant
  async register(req: Request, res: Response) {
    try {
      // Validation des données d'entrée
      const validation = validateRegistration(req.body);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(", "));
      }
      
      const { lastname, firstname, phonenumber, password } = req.body;
      const newUser = await UserService.register(lastname, firstname, phonenumber, password);
      
      // Générer les tokens après inscription réussie
      const tokens = JwtService.generateTokens(newUser as any);
      
      sendSuccess(res, { 
        user: newUser,
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
        tokenType: tokens.tokenType
      }, "Utilisateur créé avec succès", 201);
    } catch (error) {
      sendError(res, error);
    }
  };

  // 🔹 Authentification d'un merchant
  async login(req: Request, res: Response) {
    try {
      const { phonenumber, password } = req.body;
      const user = await UserService.signin(phonenumber, password);
      if (!user) {
        throw new Error("Telephone ou mot de passe invalides.");
      }
      
      const tokens = JwtService.generateTokens(user);
      
      sendSuccess(res, {
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
        tokenType: tokens.tokenType
      }, "Authentification réussie ✅", 200);

    } catch (error) {
      sendError(res, error);
    }
  };

  // 🔹 Envoi d'un OTP
  async sendOtp(req: Request, res: Response) {
    try {
      const { phonenumber } = req.body;
      const otp = await UserService.generateOtp(phonenumber);
      const message = `Votre code de vérification est : ${otp}`;
      await SmsService.sendSMS(phonenumber, message);
      sendSuccess(res, { otp }, "OTP envoyé avec succès", 200);
    } catch (error) {
      sendError(res, error);
    }
  }

  // 🔹 Vérification d'un OTP
  async verifyOtp(req: Request, res: Response) {
    try {
      const { otp, phonenumber } = req.body;
      if (!otp) {
        throw new Error("Le code OTP est requis");
      }
      const user = await UserService.verifyOtp(otp, phonenumber);
      sendSuccess(res, { user }, "OTP vérifié avec succès", 200);
    } catch (error) {
      sendError(res, error);
    }
  }

}

export default new AuthController();

