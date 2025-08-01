import OtpModel from "../models/otp.model";
import UserModel from "../models/user.model";
import { generateRandomToken } from "../utils/authUtils";

class OtpService {

  /**
   * Génère et envoie un OTP pour l'inscription
   */
  async generateRegistrationOtp(phonenumber: string): Promise<{ otp: string; expiresAt: Date }> {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await UserModel.findOne({ phonenumber });
    if (existingUser) {
      throw new Error("Un utilisateur avec ce numéro de téléphone existe déjà");
    }

    // Vérifier les limites d'OTP (max 3 par heure)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentOtps = await OtpModel.countDocuments({
      phonenumber,
      type: 'registration',
      createdAt: { $gte: oneHourAgo }
    });

    if (recentOtps >= 3) {
      throw new Error("Limite d'OTP atteinte. Veuillez réessayer dans 1 heure");
    }

    // Supprimer les anciens OTP non utilisés pour ce numéro
    await OtpModel.deleteMany({
      phonenumber,
      type: 'registration',
      isUsed: false
    });
 
    // Générer un OTP à 6 chiffres
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Créer le document OTP
    const otpDoc = await OtpModel.create({
      phonenumber,
      otp,
      type: 'registration',
      attempts: 0,
      isUsed: false
    });
  
    return {
      otp,
      expiresAt: otpDoc.expiresAt
    };
  }

  /**
   * Vérifie un OTP et génère un token de validation
   */
  async verifyOtp(phonenumber: string, otp: string): Promise<{ otpToken: string; expiresIn: number }> {
    // Trouver l'OTP valide
    const otpDoc = await OtpModel.findOne({
      phonenumber,
      type: 'registration',
      isUsed: false,
      expiresAt: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    if (!otpDoc) {
      throw new Error("Aucun OTP valide trouvé pour ce numéro");
    }

    // Vérifier si l'OTP n'a pas dépassé la limite de tentatives
    if (otpDoc.attempts >= 4) {
      throw new Error("Trop de tentatives. Veuillez demander un nouveau code");
    }

    // Vérifier si l'OTP correspond
    if (otpDoc.otp !== otp) {
      otpDoc.incrementAttempts();
      throw new Error("Code OTP incorrect");
    }

    // Générer un token de validation
    const otpToken = generateRandomToken(32);

    // Marquer l'OTP comme utilisé et ajouter le token
    otpDoc.isUsed = true;
    otpDoc.otpToken = otpToken;
    await otpDoc.save();

    // Calculer le temps d'expiration en minutes
    const expiresIn = Math.ceil((otpDoc.expiresAt.getTime() - Date.now()) / (1000 * 60));

    return {
      otpToken,
      expiresIn
    };
  }

  /**
   * Valide un token OTP pour l'inscription
   */
  async validateOtpToken(otpToken: string, phonenumber: string): Promise<boolean> {
    const otpDoc = await OtpModel.findOne({
      otpToken,
      phonenumber,
      type: 'registration',
      isUsed: true,
      expiresAt: { $gt: new Date() }
    });

    return !!otpDoc;
  }

  /**
   * Nettoie les OTP expirés
   */
  async cleanupExpiredOtps(): Promise<number> {
    const result = await OtpModel.deleteMany({
      expiresAt: { $lt: new Date() }
    });
    return result.deletedCount || 0;
  }

  /**
   * Renvoie un OTP (pour les cas où l'utilisateur n'a pas reçu le SMS)
   */
  async resendOtp(phonenumber: string): Promise<{ otp: string; expiresAt: Date }> {
    // Vérifier s'il existe un OTP récent non utilisé
    const recentOtp = await OtpModel.findOne({
      phonenumber,
      type: 'registration',
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (recentOtp) {
      // Si un OTP valide existe, le renvoyer
      return {
        otp: recentOtp.otp,
        expiresAt: recentOtp.expiresAt
      };
    }

    // Sinon, générer un nouveau OTP
    return this.generateRegistrationOtp(phonenumber);
  }

  /**
   * Invalide un token OTP (après inscription réussie)
   */
  async invalidateOtpToken(otpToken: string): Promise<void> {
    await OtpModel.updateOne(
      { otpToken },
      { $unset: { otpToken: "" } }
    );
  }

  /**
   * Récupère les statistiques OTP pour un numéro
   */
  async getOtpStats(phonenumber: string): Promise<{
    totalRequests: number;
    successfulVerifications: number;
    failedAttempts: number;
    lastRequest: Date | null;
  }> {
    const stats = await OtpModel.aggregate([
      { $match: { phonenumber, type: 'registration' } },
      {
        $group: {
          _id: null,
          totalRequests: { $sum: 1 },
          successfulVerifications: { $sum: { $cond: [{ $eq: ['$isUsed', true] }, 1, 0] } },
          failedAttempts: { $sum: '$attempts' },
          lastRequest: { $max: '$createdAt' }
        }
      }
    ]);

    return stats[0] || {
      totalRequests: 0,
      successfulVerifications: 0,
      failedAttempts: 0,
      lastRequest: null
    };
  }
}

export default new OtpService(); 