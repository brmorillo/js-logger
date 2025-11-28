import { ILogger } from '../interfaces/logger.interface';

/**
 * Pino logger implementation
 * Provides high-performance JSON logging using Pino
 */
export class PinoLogger implements ILogger {
  private logger: unknown;
  constructor(options: { level?: string; prettyPrint?: boolean } = {}) {
    try {
      // Dynamic import to avoid requiring pino as a direct dependency
      const pino = require('pino');

      this.logger = pino({
        level: options.level || 'info',
        transport: options.prettyPrint
          ? {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
              },
            }
          : undefined,
      });
    } catch {
      // Fallback to console if pino is not available
      console.warn(
        '[PinoLogger] Pino not found. Falling back to console logger. Install pino: bun add pino'
      );
      this.logger = this.createFallbackLogger();
    }
  }

  /**
   * Logs an informational message
   */
  info(message: string, ...meta: unknown[]): void {
    (this.logger as any).info({ meta }, message);
  }

  /**
   * Logs a warning message
   */
  warn(message: string, ...meta: unknown[]): void {
    (this.logger as any).warn({ meta }, message);
  }

  /**
   * Logs an error message
   */
  error(message: string, ...meta: unknown[]): void {
    (this.logger as any).error({ meta }, message);
  }

  /**
   * Logs a debug message
   */
  debug(message: string, ...meta: unknown[]): void {
    (this.logger as any).debug({ meta }, message);
  }

  /**
   * Creates a fallback console logger when Pino is not available
   */
  private createFallbackLogger() {
    return {
      info: (meta: unknown, message: string) =>
        console.info(`[INFO] ${message}`, meta),
      warn: (meta: unknown, message: string) =>
        console.warn(`[WARN] ${message}`, meta),
      error: (meta: unknown, message: string) =>
        console.error(`[ERROR] ${message}`, meta),
      debug: (meta: unknown, message: string) =>
        console.debug(`[DEBUG] ${message}`, meta),
    };
  }
}
