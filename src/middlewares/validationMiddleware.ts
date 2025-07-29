// src/middlewares/validationMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { 
  validateRegistration, 
  validateLogin, 
  validateSendOtp, 
  validateVerifyOtp,
  ValidationResult 
} from "../utils/validationHelper";
import { sendError } from "../utils/responseHandler";

/**
 * Middleware de validation pour l'inscription
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
 * Middleware de validation pour l'envoi d'OTP
 */
export const validateSendOtpData = (req: Request, res: Response, next: NextFunction) => {
  const validation: ValidationResult = validateSendOtp(req.body);
  
  if (!validation.isValid) {
    return sendError(res, new Error(validation.errors.join(", ")), 400);
  }
  
  next();
};

/**
 * Middleware de validation pour la vérification d'OTP
 */
export const validateVerifyOtpData = (req: Request, res: Response, next: NextFunction) => {
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