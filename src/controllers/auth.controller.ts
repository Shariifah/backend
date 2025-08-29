import { Request, Response } from "express";
import UserService from "../services/user.service";
import OtpService from "../services/otp.service";
import SmsService from "../services/sms.service";
import JwtService from "../services/jwt.service";
import { sendSuccess, sendError } from "../utils/responseHandler";
import userService from "../services/user.service";
import {comparePassword, hashPassword} from "../utils/authUtils";
import {UserDocument} from "../types/interfaces";
import UserModel from "../models/user.model";

class AuthController {

  // Types d'OTP
  private readonly OTP_TYPE_REGISTRATION = 'registration';
  private readonly OTP_TYPE_PASSWORD_RESET = 'password_reset';

  // INSCRIPTION ÉTAPE 1 : Demande d'OTP pour inscription
  async requestOtp(req: Request, res: Response) {
    try {
      const { phonenumber } = req.body;

      // Générer l'OTP
      const { otp, expiresAt } = await OtpService.generateOtp(phonenumber, this.OTP_TYPE_REGISTRATION);

      // Envoyer le SMS
      const message = `Votre code de vérification est : ${otp}`;
      await SmsService.sendSMS(phonenumber, message);

      sendSuccess(res, {
        phonenumber,
        expiresIn: expiresAt ?? "10 minutes",
        attemptsRemaining: 4
      }, "Code de vérification envoyé avec succès", 200);

    } catch (error) {
      sendError(res, error);
    }
  }

  // INSCRIPTION ÉTAPE 2 : Vérification de l'OTP
  async verifyOtp(req: Request, res: Response) {
    try {
      const { phonenumber, otp } = req.body;

      // Vérifier l'OTP et obtenir le token de validation
      const { otpToken, expiresIn } = await OtpService.verifyOtp(phonenumber, otp, this.OTP_TYPE_REGISTRATION);

      sendSuccess(res, {
        otpToken,
        phonenumber,
        expiresIn
      }, "Code vérifié, veuillez finaliser votre inscription", 200);

    } catch (error) {
      sendError(res, error);
    }
  }

  // INSCRIPTION ÉTAPE 3 : Inscription finale avec token OTP
  async register(req: Request, res: Response) {
    try {
      const { otpToken, firstname, lastname, phonenumber, password, verifyPassword } = req.body;

      // Vérifier que les mots de passe correspondent
      if (password !== verifyPassword) {
        throw new Error("Les mots de passe ne correspondent pas");
      }

      // Valider le token OTP
      const isTokenValid = await OtpService.validateOtpToken(otpToken, phonenumber, this.OTP_TYPE_REGISTRATION);
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

  // Renvoi d'OTP (optionnel)
  async resendOtp(req: Request, res: Response) {
    try {
      const { phonenumber } = req.body;

      // Renvoyer l'OTP
      const { otp, expiresAt } = await OtpService.resendOtp(phonenumber, this.OTP_TYPE_REGISTRATION);

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

  // Authentification d'un utilisateur
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

  // CHANGEMENT DE MOT DE PASSE (utilisateur connecté)
  async changePassword(req: Request, res: Response) {
    try {
      const { currentPassword, newPassword, confirmPassword } = req.body;
      const userId = (req as any).user.id; // Récupéré du middleware d'authentification

      const user: UserDocument | null = await UserModel.findOne({ userId: userId });

      const isMatch = await comparePassword(currentPassword, user!.password);
      if (!isMatch) throw new Error("L'ancien mot de passe invalide.");
      // Vérifier que les nouveaux mots de passe correspondent
      if (newPassword !== confirmPassword) {
        throw new Error("Les nouveaux mots de passe ne correspondent pas");
      }

      // Vérifier que le nouveau mot de passe est différent de l'ancien
      if (currentPassword === newPassword) {
        throw new Error("Le nouveau mot de passe doit être différent de l'ancien");
      }

      // Changer le mot de passe
      await UserService.resetPassword(userId, newPassword);

      sendSuccess(res, {}, "Mot de passe modifié avec succès", 200);

    } catch (error) {
      sendError(res, error);
    }
  }

  // MOT DE PASSE OUBLIÉ ÉTAPE 1 : Demande d'OTP pour réinitialisation
  async requestPasswordResetOtp(req: Request, res: Response) {
    try {
      const { phonenumber } = req.body;
 
      // Vérifier que l'utilisateur existe
      const user = await UserService.findByPhonenumber(phonenumber);
      if (!user) {
        throw new Error("Aucun compte associé à ce numéro de téléphone");
      }

      // Générer l'OTP pour réinitialisation
      const { otp, expiresAt } = await OtpService.generateOtp(phonenumber, this.OTP_TYPE_PASSWORD_RESET);

      // Envoyer le SMS
      const message = `Votre code de réinitialisation de mot de passe est : ${otp}`;
      await SmsService.sendSMS(phonenumber, message);

      sendSuccess(res, {
        phonenumber,
        expiresIn: expiresAt ?? "10 minutes",
        attemptsRemaining: 4
      }, "Code de réinitialisation envoyé avec succès", 200);

    } catch (error) {
      sendError(res, error);
    }
  }

  // MOT DE PASSE OUBLIÉ ÉTAPE 2 : Vérification de l'OTP
  async verifyPasswordResetOtp(req: Request, res: Response) {
    try {
      const { phonenumber, otp } = req.body;

      // Vérifier l'OTP et obtenir le token de validation
      const { otpToken, expiresIn } = await OtpService.verifyOtp(phonenumber, otp, this.OTP_TYPE_PASSWORD_RESET);

      sendSuccess(res, {
        otpToken,
        phonenumber,
        expiresIn
      }, "Code vérifié, veuillez définir votre nouveau mot de passe", 200);

    } catch (error) {
      sendError(res, error);
    }
  }

  // MOT DE PASSE OUBLIÉ ÉTAPE 3 : Réinitialisation du mot de passe
  async resetPassword(req: Request, res: Response) {
    try {
      const { otpToken, phonenumber, newPassword, confirmPassword } = req.body;

      // Vérifier que les mots de passe correspondent
      if (newPassword !== confirmPassword) {
        throw new Error("Les mots de passe ne correspondent pas");
      }

      // Valider le token OTP
      const isTokenValid = await OtpService.validateOtpToken(otpToken, phonenumber, this.OTP_TYPE_PASSWORD_RESET);
      if (!isTokenValid) {
        throw new Error("Token de validation invalide ou expiré");
      }

      // Réinitialiser le mot de passe
      const user = await userService.findByPhonenumber(phonenumber);
      await UserService.resetPassword(user.id, newPassword);

      // Invalider le token OTP
      await OtpService.invalidateOtpToken(otpToken);

      sendSuccess(res, {}, "Mot de passe réinitialisé avec succès", 200);

    } catch (error) {
      sendError(res, error);
    }
  }

  // Renvoi d'OTP pour réinitialisation de mot de passe
  async resendPasswordResetOtp(req: Request, res: Response) {
    try {
      const { phonenumber } = req.body;

      // Vérifier que l'utilisateur existe
      const user = await UserService.findByPhonenumber(phonenumber);
      if (!user) {
        throw new Error("Aucun compte associé à ce numéro de téléphone");
      }

      // Renvoyer l'OTP
      const { otp, expiresAt } = await OtpService.resendOtp(phonenumber, this.OTP_TYPE_PASSWORD_RESET);

      // Envoyer le SMS
      const message = `Votre nouveau code de réinitialisation est : ${otp}`;
      await SmsService.sendSMS(phonenumber, message);

      sendSuccess(res, {
        phonenumber,
        expiresIn: expiresAt
      }, "Nouveau code de réinitialisation envoyé", 200);

    } catch (error) {
      sendError(res, error);
    }
  }

}

export default new AuthController();

