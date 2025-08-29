import { Request, Response, NextFunction } from "express";
import { logError } from "../services/logger.service";

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Logger l'erreur
  logError('Erreur serveur', {
    error: err.message || 'Erreur inconnue',
    stack: err.stack,
    status: err.status || 500,
    url: req.url,
    method: req.method,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent')
  });

  res.status(err.status || 500).json({ error: err.message || "Erreur serveur" });
};

export default errorHandler;
