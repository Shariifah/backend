import { Request, Response } from "express";
import UserService from "../services/user.service";
import OtpService from "../services/otp.service";
import SmsService from "../services/sms.service";
import JwtService from "../services/jwt.service";
import { sendSuccess, sendError } from "../utils/responseHandler";

class AuthController {

  // 🔹 ÉTAPE 1 : Demande d'OTP pour inscription
  async requestOtp(req: Request, res: Response) {
    try {
      const { phonenumber } = req.body;

      // Générer l'OTP
      const { otp, expiresAt } = await OtpService.generateRegistrationOtp(phonenumber);

      // Envoyer le SMS
      const message = `Votre code de vérification est : ${otp}`;
      await SmsService.sendSMS(phonenumber, message);

      sendSuccess(res, {
        phonenumber,
        expiresIn: expiresAt,
        attemptsRemaining: 4
      }, "Code de vérification envoyé avec succès", 200);

    } catch (error) {
      sendError(res, error);
    }
  }

  // 🔹 ÉTAPE 2 : Vérification de l'OTP
  async verifyOtp(req: Request, res: Response) {
    try {
      const { phonenumber, otp } = req.body;

      // Vérifier l'OTP et obtenir le token de validation
      const { otpToken, expiresIn } = await OtpService.verifyOtp(phonenumber, otp);

      sendSuccess(res, {
        otpToken,
        phonenumber,
        expiresIn
      }, "Code vérifié, veuillez finaliser votre inscription", 200);

    } catch (error) {
      sendError(res, error);
    }
  }

  // 🔹 ÉTAPE 3 : Inscription finale avec token OTP
  async register(req: Request, res: Response) {
    try {
      const { otpToken, firstname, lastname, phonenumber, password, verifyPassword } = req.body;

      // Vérifier que les mots de passe correspondent
      if (password !== verifyPassword) {
        throw new Error("Les mots de passe ne correspondent pas");
      }

      // Valider le token OTP
      const isTokenValid = await OtpService.validateOtpToken(otpToken, phonenumber);
      if (!isTokenValid) {
        throw new Error("Token de validation invalide ou expiré");
      }

      // Créer l'utilisateur
      const newUser = await UserService.register(lastname, firstname, phonenumber, password);

      // Invalider le token OTP
      await OtpService.invalidateOtpToken(otpToken);

      // Générer les tokens d'authentification
      const tokens = JwtService.generateTokens(newUser as any);

      sendSuccess(res, {
        user: {
          id: (newUser as any)._id,
          firstname: (newUser as any).firstname,
          lastname: (newUser as any).lastname,
          phonenumber: (newUser as any).phonenumber,
          status: (newUser as any).status,
          role: (newUser as any).role
        },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
        tokenType: tokens.tokenType
      }, "Inscription réussie", 201);

    } catch (error) {
      sendError(res, error);
    }
  }

  // 🔹 Renvoi d'OTP (optionnel)
  async resendOtp(req: Request, res: Response) {
    try {
      const { phonenumber } = req.body;

      // Renvoyer l'OTP
      const { otp, expiresAt } = await OtpService.resendOtp(phonenumber);

      // Envoyer le SMS
      const message = `Votre nouveau code de vérification est : ${otp}`;
      await SmsService.sendSMS(phonenumber, message);

      sendSuccess(res, {
        phonenumber,
        expiresIn: expiresAt
      }, "Nouveau code de vérification envoyé", 200);

    } catch (error) {
      sendError(res, error);
    }
  }

  // 🔹 Authentification d'un utilisateur (inchangé)
  async login(req: Request, res: Response) {
    try {
      const { phonenumber, password } = req.body;
      // Vérifier si l'utilisateur existe
      const user = await UserService.signin(phonenumber, password);
      // Générer les tokens d'authentification
      const tokens = JwtService.generateTokens(user);
      // Renvoyer les tokens d'authentification
      sendSuccess(res, {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
        tokenType: tokens.tokenType
      }, "Authentification réussie ✅", 200);

    } catch (error) {
      sendError(res, error);
    }
  }

}

export default new AuthController();

