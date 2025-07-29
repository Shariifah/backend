// src/config.ts
import * as dotenv from 'dotenv';
import path from 'path';
import * as process from "node:process";


// Charger le bon fichier .env
const env = process.env.NODE_ENV || 'dev';
dotenv.config({ path: path.resolve(__dirname, `../../.env.${env}`) });

// Vérifier les variables essentielles
const requiredVars = ['DBMS', 'DB_URI', 'APP_PORT', 'JWT_SECRET'];
requiredVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`⚠️  La variable d'environnement ${key} est manquante dans .env.${env}`);
  }
});

// Exporter la configuration
export default {
  dbUri: process.env.DB_URI as string,
  appPort: parseInt(process.env.APP_PORT as string, 10) || 3000,
  jwtSecret: process.env.JWT_SECRET as string,
  nodeEnv: process.env.NODE_ENV as string,
  dbms: process.env.DBMS as string,
};

