// src/utils/responseHandler.ts
import { Response } from "express";

/**
 * Envoie une réponse JSON standardisée pour les succès.
 */
export function sendSuccess(
  res: Response, 
  data: any, 
  message: string = "Succès", 
  statusCode: number = 200
) {
  res.status(statusCode).json({
    success: true,
    code: statusCode,
    message,
    data,
  });
}

/**
 * Gère les erreurs et envoie une réponse JSON appropriée.
 */
export function sendError(res: Response, error: unknown, statusCode?: number) {
  let errorMessage = "Une erreur inconnue est survenue.";
  let errorCode = statusCode || 400;

  if (error instanceof Error) {
    errorMessage = error.message;
  } 
  
  // Vérification des erreurs MongoDB (exemple)
  if (typeof error === "object" && error !== null) {
    const err = error as any;
    if (err.name === "ValidationError") {
      console.log(error);
      errorMessage = "Erreur de validation";
      errorCode = 422;
    }
    if (err.code === 11000) {
      console.log(error);
      errorMessage = "Un enregistrement avec ces informations existe déjà.";
      errorCode = 409;
    }
  }

  res.status(errorCode).json({
    success: false,
    code: errorCode,
    message: errorMessage,
  });
}
