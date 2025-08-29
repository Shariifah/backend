import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';
import { getLoggingConfig } from '../configs/logging.config';

// Fonction pour créer automatiquement les répertoires de logs
const ensureLogDirectories = () => {
  const config = getLoggingConfig();
  const logDir = path.resolve(config.logDirectory);
  
  // Créer le répertoire principal des logs
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  // Créer les sous-répertoires
  const subDirs = ['app', 'error', 'access', 'combined'];
  subDirs.forEach(subDir => {
    const subDirPath = path.join(logDir, subDir);
    if (!fs.existsSync(subDirPath)) {
      fs.mkdirSync(subDirPath, { recursive: true });
    }
  });
  
  console.log(`📁 Répertoires de logs créés/vérifiés dans: ${logDir}`);
};

// Configuration des formats de logs
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }
    
    if (stack) {
      log += `\n${stack}`;
    }
    
    return log;
  })
);

// Configuration des transports
const createTransports = () => {
  // Créer automatiquement les répertoires de logs
  ensureLogDirectories();
  
  const config = getLoggingConfig();
  const transports: winston.transport[] = [];
  
  // Console (si activée)
  if (config.enableConsole) {
    transports.push(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      })
    );
  }
  
  // Fichiers (si activés)
  if (config.enableFile) {
    // Logs d'application généraux
    transports.push(
      new DailyRotateFile({
        filename: path.join(config.logDirectory, 'app', 'app-%DATE%.log'),
        datePattern: config.datePattern,
        maxSize: config.maxSize,
        maxFiles: config.maxFiles,
        level: 'info'
      })
    );
    
    // Logs d'erreurs
    transports.push(
      new DailyRotateFile({
        filename: path.join(config.logDirectory, 'error', 'error-%DATE%.log'),
        datePattern: config.datePattern,
        maxSize: config.maxSize,
        maxFiles: '30d', // Garder les erreurs plus longtemps
        level: 'error'
      })
    );
    
    // Logs combinés (tous les niveaux)
    transports.push(
      new DailyRotateFile({
        filename: path.join(config.logDirectory, 'combined', 'combined-%DATE%.log'),
        datePattern: config.datePattern,
        maxSize: config.maxSize,
        maxFiles: config.maxFiles
      })
    );
  }
  
  return transports;
};

const transports = createTransports();

// Création du logger principal
const logger = winston.createLogger({
  level: getLoggingConfig().level,
  format: logFormat,
  transports,
  exitOnError: false
});

// Logger spécialisé pour les requêtes HTTP
const accessLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new DailyRotateFile({
      filename: path.join('logs', 'access', 'access-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d'
    })
  ]
});

// Méthodes utilitaires
export const logInfo = (message: string, meta?: any) => {
  logger.info(message, meta);
};

export const logError = (message: string, error?: any) => {
  logger.error(message, { error: error?.message || error, stack: error?.stack });
};

export const logWarn = (message: string, meta?: any) => {
  logger.warn(message, meta);
};

export const logDebug = (message: string, meta?: any) => {
  logger.debug(message, meta);
};

export const logAccess = (message: string, meta?: any) => {
  accessLogger.info(message, meta);
};

// Fonction d'initialisation du système de logging
export const initializeLogging = () => {
  try {
    ensureLogDirectories();
    logInfo('Système de logging initialisé avec succès', {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation du système de logging:', error);
    return false;
  }
};

export default logger;
