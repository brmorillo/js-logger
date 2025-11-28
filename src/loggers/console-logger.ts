import { ILogger } from '../interfaces/logger.interface';

/**
 * Console logger implementation
 * Provides a simple logger using native console methods
 */
export class ConsoleLogger implements ILogger {
  private level: string;

  constructor(level: string = 'info') {
    this.level = level;
  }

  /**
   * Logs an informational message
   */
  info(message: string, ...meta: unknown[]): void {
    if (this.shouldLog('info')) {
      console.info(`[INFO] ${message}`, ...meta);
    }
  }

  /**
   * Logs a warning message
   */
  warn(message: string, ...meta: unknown[]): void {
    if (this.shouldLog('warn')) {
      console.warn(`[WARN] ${message}`, ...meta);
    }
  }

  /**
   * Logs an error message
   */
  error(message: string, ...meta: unknown[]): void {
    if (this.shouldLog('error')) {
      console.error(`[ERROR] ${message}`, ...meta);
    }
  }

  /**
   * Logs a debug message
   */
  debug(message: string, ...meta: unknown[]): void {
    if (this.shouldLog('debug')) {
      console.debug(`[DEBUG] ${message}`, ...meta);
    }
  }

  /**
   * Determines if a message should be logged based on the configured level
   */
  private shouldLog(level: string): boolean {
    const levels: Record<string, number> = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
    };

    const currentLevel = levels[this.level] ?? 2;
    const messageLevel = levels[level] ?? 2;

    return messageLevel <= currentLevel;
  }
}
