// src/services/jwt.service.ts
import jwt from "jsonwebtoken";
import { UserDocument, JwtPayload } from "../types";
import config from "../configs/config";

class JwtService {
  private readonly SECRET_KEY = config.jwtSecret;
  private readonly ACCESS_TOKEN_EXPIRES_IN = "1h";
  private readonly REFRESH_TOKEN_EXPIRES_IN = "7d";

  /**
   * Génère un token d'accès pour un utilisateur
   */
  generateAccessToken(user: UserDocument): string {
    const payload: JwtPayload = {
      userId: user._id.toString(),
      role: user.role,
      type: 'access'
    };

    return jwt.sign(payload, this.SECRET_KEY, { 
      expiresIn: this.ACCESS_TOKEN_EXPIRES_IN 
    });
  }

  /**
   * Génère un refresh token pour un utilisateur
   */
  generateRefreshToken(user: UserDocument): string {
    const payload: JwtPayload = {
      userId: user._id.toString(),
      type: 'refresh'
    };

    return jwt.sign(payload, this.SECRET_KEY, { 
      expiresIn: this.REFRESH_TOKEN_EXPIRES_IN 
    });
  }

  /**
   * Génère les deux tokens (access + refresh) pour un utilisateur
   */
  generateTokens(user: UserDocument): {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
  } {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken,
      expiresIn: 3600, // 1 heure en secondes
      tokenType: "Bearer"
    };
  }

  /**
   * Vérifie et décode un token
   */
  verifyToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, this.SECRET_KEY) as JwtPayload;
      return decoded;
    } catch (error) {
      throw new Error("Token invalide ou expiré");
    }
  }

  /**
   * Vérifie si un token est valide sans le décoder
   */
  isTokenValid(token: string): boolean {
    try {
      jwt.verify(token, this.SECRET_KEY);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Décode un token sans vérification (pour debug)
   */
  decodeToken(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Rafraîchit un access token à partir d'un refresh token
   */
  refreshAccessToken(refreshToken: string, user: UserDocument): string {
    // Vérifier que le refresh token est valide
    const decoded = this.verifyToken(refreshToken);
    
    if (decoded.type !== 'refresh') {
      throw new Error("Token de type invalide");
    }

    if (decoded.userId !== user._id.toString()) {
      throw new Error("Token ne correspond pas à l'utilisateur");
    }

    // Générer un nouveau access token
    return this.generateAccessToken(user);
  }

  /**
   * Extrait le token du header Authorization
   */
  extractTokenFromHeader(authHeader: string | undefined): string {
    if (!authHeader) {
      throw new Error("Header Authorization manquant");
    }

    if (!authHeader.startsWith("Bearer ")) {
      throw new Error("Format de token invalide");
    }

    return authHeader.substring(7); // Enlever "Bearer "
  }

  /**
   * Vérifie si un token est expiré
   */
  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwt.decode(token) as JwtPayload;
      if (!decoded.exp) return true;
      
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  /**
   * Obtient les informations d'un token (pour debug)
   */
  getTokenInfo(token: string): {
    userId: string;
    role?: string;
    type?: string;
    exp?: number;
    iat?: number;
  } {
    const decoded = this.verifyToken(token);
    return {
      userId: decoded.userId,
      role: decoded.role,
      type: decoded.type,
      exp: (decoded as any).exp,
      iat: (decoded as any).iat
    };
  }
}

export default new JwtService(); 