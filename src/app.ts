import express from "express";
import cors from "cors";
import router from "./routes/router";
import errorHandler from "./middlewares/errorHandler";
import { morganMiddleware, requestLoggingMiddleware } from "./middlewares/loggingMiddleware";
import { logInfo, initializeLogging } from "./services/logger.service";

const app = express();

// Logging des requêtes HTTP
app.use(morganMiddleware);
app.use(requestLoggingMiddleware);

// Configuration CORS
app.use(cors({
  origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use("", router);
app.use(errorHandler);

// Initialisation du système de logging
if (initializeLogging()) {
  // Log du démarrage de l'application
  logInfo('Application démarrée avec succès', {
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
} else {
  console.error('❌ Impossible d\'initialiser le système de logging');
}

export default app;
