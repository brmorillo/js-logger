import { ILogger } from '../interfaces/logger.interface';

/**
 * Winston logger implementation
 * Provides flexible logging with multiple transports using Winston
 */
export class WinstonLogger implements ILogger {
   private logger: any;

   constructor(options: { level?: string; prettyPrint?: boolean } = {}) {
      try {
         // Dynamic import to avoid requiring winston as a direct dependency
         const winston = require('winston');

         const format = options.prettyPrint
            ? winston.format.combine(
               winston.format.colorize(),
               winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
               winston.format.printf(
                  (info: {
                     level: string;
                     message: string;
                     timestamp: string;
                     [key: string]: any;
                  }) => {
                     const { level, message, timestamp, ...meta } = info;
                     const metaStr = Object.keys(meta).length
                        ? ` ${JSON.stringify(meta)}`
                        : '';
                     return `${timestamp} ${level}: ${message}${metaStr}`;
                  }
               )
            )
            : winston.format.combine(
               winston.format.timestamp(),
               winston.format.json()
            );

         this.logger = winston.createLogger({
            level: options.level || 'info',
            format,
            transports: [new winston.transports.Console()],
         });
      } catch {
         // Fallback to console if winston is not available
         console.warn(
            '[WinstonLogger] Winston not found. Falling back to console logger. Install winston: bun add winston'
         );
         this.logger = this.createFallbackLogger();
      }
   }

   /**
    * Logs an informational message
    */
   info(message: string, ...meta: any[]): void {
      this.logger.info(message, ...meta);
   }

   /**
    * Logs a warning message
    */
   warn(message: string, ...meta: any[]): void {
      this.logger.warn(message, ...meta);
   }

   /**
    * Logs an error message
    */
   error(message: string, ...meta: any[]): void {
      this.logger.error(message, ...meta);
   }

   /**
    * Logs a debug message
    */
   debug(message: string, ...meta: any[]): void {
      this.logger.debug(message, ...meta);
   }

   /**
    * Creates a fallback console logger when Winston is not available
    */
   private createFallbackLogger() {
      return {
         info: (message: string, ...meta: any[]) =>
            console.info(`[INFO] ${message}`, ...meta),
         warn: (message: string, ...meta: any[]) =>
            console.warn(`[WARN] ${message}`, ...meta),
         error: (message: string, ...meta: any[]) =>
            console.error(`[ERROR] ${message}`, ...meta),
         debug: (message: string, ...meta: any[]) =>
            console.debug(`[DEBUG] ${message}`, ...meta),
      };
   }
}
