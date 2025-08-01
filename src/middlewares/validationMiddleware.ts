// src/middlewares/validationMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { 
  validateRegistration, 
  validateLogin, 
  validateSendOtp, 
  validateVerifyOtp,
  validateRequestOtp,
  validateRegisterWithOtp,
  ValidationResult 
} from "../utils/validationHelper";
import { sendError } from "../utils/responseHandler";

/**
 * Middleware de validation pour la demande d'OTP (Étape 1)
 */
export const validateRequestOtpData = (req: Request, res: Response, next: NextFunction) => {
  const validation: ValidationResult = validateRequestOtp(req.body);
  
  if (!validation.isValid) {
    return sendError(res, new Error(validation.errors.join(", ")), 400);
  }
  
  next();
};

/**
 * Middleware de validation pour la vérification d'OTP (Étape 2)
 */
export const validateVerifyOtpData = (req: Request, res: Response, next: NextFunction) => {
  const validation: ValidationResult = validateVerifyOtp(req.body);
  
  if (!validation.isValid) {
    return sendError(res, new Error(validation.errors.join(", ")), 400);
  }
  
  next();
};

/**
 * Middleware de validation pour l'inscription avec token OTP (Étape 3)
 */
export const validateRegisterWithOtpData = (req: Request, res: Response, next: NextFunction) => {
  const validation: ValidationResult = validateRegisterWithOtp(req.body);
  
  if (!validation.isValid) {
    return sendError(res, new Error(validation.errors.join(", ")), 400);
  }
  
  next();
};

/**
 * Middleware de validation pour le renvoi d'OTP
 */
export const validateResendOtpData = (req: Request, res: Response, next: NextFunction) => {
  const validation: ValidationResult = validateRequestOtp(req.body); // Même validation que request-otp
  
  if (!validation.isValid) {
    return sendError(res, new Error(validation.errors.join(", ")), 400);
  }
  
  next();
};

/**
 * Middleware de validation pour l'inscription (ancien - à supprimer)
 */
export const validateRegistrationData = (req: Request, res: Response, next: NextFunction) => {
  const validation: ValidationResult = validateRegistration(req.body);
  
  if (!validation.isValid) {
    return sendError(res, new Error(validation.errors.join(", ")), 400);
  }
  
  next();
};

/**
 * Middleware de validation pour la connexion
 */
export const validateLoginData = (req: Request, res: Response, next: NextFunction) => {
  const validation: ValidationResult = validateLogin(req.body);
  
  if (!validation.isValid) {
    return sendError(res, new Error(validation.errors.join(", ")), 400);
  }
  
  next();
};

/**
 * Middleware de validation pour l'envoi d'OTP (ancien - à supprimer)
 */
export const validateSendOtpData = (req: Request, res: Response, next: NextFunction) => {
  const validation: ValidationResult = validateSendOtp(req.body);
  
  if (!validation.isValid) {
    return sendError(res, new Error(validation.errors.join(", ")), 400);
  }
  
  next();
};

/**
 * Middleware de validation pour la vérification d'OTP (ancien - à supprimer)
 */
export const validateVerifyOtpDataOld = (req: Request, res: Response, next: NextFunction) => {
  const validation: ValidationResult = validateVerifyOtp(req.body);
  
  if (!validation.isValid) {
    return sendError(res, new Error(validation.errors.join(", ")), 400);
  }
  
  next();
};

/**
 * Middleware de validation générique
 */
export const createValidationMiddleware = (validationFunction: (data: any) => ValidationResult) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validation = validationFunction(req.body);
    
    if (!validation.isValid) {
      return sendError(res, new Error(validation.errors.join(", ")), 400);
    }
    
    next();
  };
}; 