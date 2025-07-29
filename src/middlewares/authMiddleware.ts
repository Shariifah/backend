// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import JwtService from "../services/jwt.service";
import UserService from "../services/user.service";
import { sendError } from "../utils/responseHandler";

// Interface pour étendre Request avec les données utilisateur
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        firstname: string;
        lastname: string;
        phonenumber: string;
        role: string;
        permissions: string[];
      };
    }
  }
}

/**
 * Middleware d'authentification - vérifie le token JWT
 */
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = JwtService.extractTokenFromHeader(authHeader);

    if (!token) {
      return sendError(res, new Error("Token d'authentification requis"), 401);
    }

    // Vérifier et décoder le token
    const decoded = JwtService.verifyToken(token);
    
    // Vérifier que c'est un token d'accès
    if (decoded.type && decoded.type !== 'access') {
      return sendError(res, new Error("Type de token invalide"), 401);
    }

    // Récupérer les informations utilisateur depuis la base de données
    const user = await UserService.findByPhonenumber(decoded.userId);
    if (!user) {
      return sendError(res, new Error("Utilisateur non trouvé"), 401);
    }

    // Vérifier que l'utilisateur est actif
    if ((user as any).status !== 'active') {
      return sendError(res, new Error("Compte utilisateur inactif"), 401);
    }

    // Ajouter les informations utilisateur à la requête
    req.user = {
      _id: (user as any)._id.toString(),
      firstname: (user as any).firstname,
      lastname: (user as any).lastname,
      phonenumber: (user as any).phonenumber,
      role: (user as any).role,
      permissions: (user as any).permissions
    };

    next();
  } catch (error) {
    return sendError(res, error, 401);
  }
};

/**
 * Middleware pour vérifier les permissions
 */
export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, new Error("Authentification requise"), 401);
    }

    if (!req.user.permissions.includes(permission)) {
      return sendError(res, new Error("Permission insuffisante"), 403);
    }

    next();
  };
};

/**
 * Middleware pour vérifier le rôle
 */
export const requireRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, new Error("Authentification requise"), 401);
    }

    if (req.user.role !== role) {
      return sendError(res, new Error("Rôle insuffisant"), 403);
    }

    next();
  };
};

/**
 * Middleware pour vérifier si l'utilisateur est admin
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return sendError(res, new Error("Authentification requise"), 401);
  }

  if (req.user.role !== 'admin') {
    return sendError(res, new Error("Accès administrateur requis"), 403);
  }

  next();
};

/**
 * Middleware optionnel d'authentification (ne bloque pas si pas de token)
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return next(); // Continue sans authentification
    }

    const token = JwtService.extractTokenFromHeader(authHeader);
    const decoded = JwtService.verifyToken(token);
    
    if (decoded.type && decoded.type !== 'access') {
      return next(); // Continue sans authentification
    }

    // Récupérer les informations utilisateur
    const user = await UserService.findByPhonenumber(decoded.userId);
    if (user && (user as any).status === 'active') {
      req.user = {
        _id: (user as any)._id.toString(),
        firstname: (user as any).firstname,
        lastname: (user as any).lastname,
        phonenumber: (user as any).phonenumber,
        role: (user as any).role,
        permissions: (user as any).permissions
      };
    }

    next();
  } catch (error) {
    // En cas d'erreur, on continue sans authentification
    next();
  }
};