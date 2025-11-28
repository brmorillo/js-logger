/**
 * Interface for logger implementations
 */
export interface ILogger {
   /**
    * Logs a general message (alias for info)
    * @param message The message to log
    * @param meta Additional metadata to include in the log
    */
   log?(message: string, ...meta: any[]): void;

   /**
    * Logs an informational message
    * @param message The message to log
    * @param meta Additional metadata to include in the log
    */
   info(message: string, ...meta: any[]): void;

   /**
    * Logs a warning message
    * @param message The message to log
    * @param meta Additional metadata to include in the log
    */
   warn(message: string, ...meta: any[]): void;

   /**
    * Logs an error message
    * @param message The message to log
    * @param meta Additional metadata to include in the log
    */
   error(message: string, ...meta: any[]): void;

   /**
    * Logs a debug message
    * @param message The message to log
    * @param meta Additional metadata to include in the log
    */
   debug(message: string, ...meta: any[]): void;

   /**
    * Logs a verbose/detailed message (optional, alias for debug)
    * @param message The message to log
    * @param meta Additional metadata to include in the log
    */
   verbose?(message: string, ...meta: any[]): void;

   /**
    * Logs a fatal error message (optional, alias for error)
    * @param message The message to log
    * @param meta Additional metadata to include in the log
    */
   fatal?(message: string, ...meta: any[]): void;
}

/**
 * Available logger types
 */
export type LoggerType = 'pino' | 'winston' | 'console';

/**
 * Logger configuration options
 */
export interface LoggerOptions {
   /**
    * The type of logger to use
    * @default 'pino'
    */
   type?: LoggerType;

   /**
    * The minimum log level to output
    * @default 'info'
    */
   level?: string;

   /**
    * Whether to use pretty printing (formatted output)
    * @default false
    */
   prettyPrint?: boolean;
}
