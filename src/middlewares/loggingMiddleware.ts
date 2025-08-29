import morgan from 'morgan';
import { logAccess } from '../services/logger.service';
import { getLoggingConfig } from '../configs/logging.config';

// Format personnalisé pour Morgan
const morganFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms';

// Middleware Morgan personnalisé
export const morganMiddleware = morgan(morganFormat, {
  stream: {
    write: (message: string) => {
      // Nettoyer le message et le logger
      const cleanMessage = message.trim();
      logAccess('HTTP Request', { 
        message: cleanMessage,
        timestamp: new Date().toISOString()
      });
    }
  },
  skip: (req, res) => {
    // Ignorer les requêtes de santé et les assets statiques en production
    const config = getLoggingConfig();
    if (config.level === 'error' && res.statusCode < 400) {
      return true;
    }
    return false;
  }
});

// Middleware pour logger les informations de la requête
export const requestLoggingMiddleware = (req: any, res: any, next: any) => {
  const start = Date.now();
  
  // Logger au début de la requête
  logAccess('Request Started', {
    method: req.method,
    url: req.url,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Intercepter la fin de la réponse
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    logAccess('Request Completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('Content-Length'),
      timestamp: new Date().toISOString()
    });
  });

  next();
};

export default morganMiddleware;
