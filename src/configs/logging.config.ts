export interface LoggingConfig {
  level: string;
  maxSize: string;
  maxFiles: string;
  datePattern: string;
  enableConsole: boolean;
  enableFile: boolean;
  logDirectory: string;
}

export const loggingConfig: LoggingConfig = {
  level: process.env.LOG_LEVEL || 'info',
  maxSize: process.env.LOG_MAX_SIZE || '20m',
  maxFiles: process.env.LOG_MAX_FILES || '14d',
  datePattern: process.env.LOG_DATE_PATTERN || 'YYYY-MM-DD',
  enableConsole: process.env.LOG_ENABLE_CONSOLE !== 'false',
  enableFile: process.env.LOG_ENABLE_FILE !== 'false',
  logDirectory: process.env.LOG_DIRECTORY || 'logs'
};

// Configuration par environnement
export const getLoggingConfig = (): LoggingConfig => {
  const env = process.env.NODE_ENV || 'development';
  
  switch (env) {
    case 'production':
      return {
        ...loggingConfig,
        level: 'info',
        enableConsole: false,
        maxFiles: '30d'
      };
    
    case 'test':
      return {
        ...loggingConfig,
        level: 'error',
        enableFile: false
      };
    
    default: // development
      return {
        ...loggingConfig,
        level: 'debug',
        enableConsole: true,
        enableFile: true
      };
  }
};
