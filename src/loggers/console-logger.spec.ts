import { describe, expect, it, beforeEach, afterEach, jest } from 'bun:test';
import { ConsoleLogger } from './console-logger';

describe('ConsoleLogger', () => {
   let logger: ConsoleLogger;
   let consoleInfoSpy: ReturnType<typeof jest.spyOn>;
   let consoleWarnSpy: ReturnType<typeof jest.spyOn>;
   let consoleErrorSpy: ReturnType<typeof jest.spyOn>;
   let consoleDebugSpy: ReturnType<typeof jest.spyOn>;

   beforeEach(() => {
      logger = new ConsoleLogger('debug');
      consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => { });
      consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => { });
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
      consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation(() => { });
   });

   afterEach(() => {
      consoleInfoSpy.mockRestore();
      consoleWarnSpy.mockRestore();
      consoleErrorSpy.mockRestore();
      consoleDebugSpy.mockRestore();
   });

   describe('Constructor', () => {
      it('should create instance with default config', () => {
         const defaultLogger = new ConsoleLogger();
         expect(defaultLogger).toBeInstanceOf(ConsoleLogger);
      });

      it('should create instance with custom level', () => {
         const customLogger = new ConsoleLogger('warn');
         expect(customLogger).toBeInstanceOf(ConsoleLogger);
      });

      it('should create instance with debug level', () => {
         const debugLogger = new ConsoleLogger('debug');
         expect(debugLogger).toBeInstanceOf(ConsoleLogger);
      });
   });

   describe('info()', () => {
      it('should log info message with string', () => {
         logger.info('Test message');
         expect(consoleInfoSpy).toHaveBeenCalledWith('[INFO] Test message');
      });

      it('should log info message with number', () => {
         logger.info('Number test', 42);
         expect(consoleInfoSpy).toHaveBeenCalledWith('[INFO] Number test', 42);
      });

      it('should log info message with bigint', () => {
         const bigNum = BigInt(9007199254740991);
         logger.info('BigInt test', bigNum);
         expect(consoleInfoSpy).toHaveBeenCalledWith('[INFO] BigInt test', bigNum);
      });

      it('should log info message with object', () => {
         const obj = { key: 'value', nested: { inner: 'data' } };
         logger.info('Object test', obj);
         expect(consoleInfoSpy).toHaveBeenCalledWith('[INFO] Object test', obj);
      });

      it('should log info message with array', () => {
         const arr = [1, 2, 3, 'four', { five: 5 }];
         logger.info('Array test', arr);
         expect(consoleInfoSpy).toHaveBeenCalledWith('[INFO] Array test', arr);
      });

      it('should log info message with nested object', () => {
         const nested = { level1: { level2: { level3: { value: 'deep' } } } };
         logger.info('Nested test', nested);
         expect(consoleInfoSpy).toHaveBeenCalledWith('[INFO] Nested test', nested);
      });

      it('should log info message with multiple metadata params', () => {
         logger.info('Multiple', 'str', 123, { key: 'val' });
         expect(consoleInfoSpy).toHaveBeenCalledWith('[INFO] Multiple', 'str', 123, { key: 'val' });
      });

      it('should log info message with null', () => {
         logger.info('Null test', null);
         expect(consoleInfoSpy).toHaveBeenCalledWith('[INFO] Null test', null);
      });

      it('should log info message with undefined', () => {
         logger.info('Undefined test', undefined);
         expect(consoleInfoSpy).toHaveBeenCalledWith('[INFO] Undefined test', undefined);
      });

      it('should log info message with boolean', () => {
         logger.info('Boolean test', true);
         expect(consoleInfoSpy).toHaveBeenCalledWith('[INFO] Boolean test', true);
      });

      it('should log info message with Error object', () => {
         const error = new Error('Test error');
         logger.info('Error test', error);
         expect(consoleInfoSpy).toHaveBeenCalledWith('[INFO] Error test', error);
      });

      it('should not log info when level is warn', () => {
         const warnLogger = new ConsoleLogger('warn');
         const spy = jest.spyOn(console, 'info').mockImplementation(() => { });
         warnLogger.info('Should not log');
         expect(spy).not.toHaveBeenCalled();
         spy.mockRestore();
      });
   });

   describe('warn()', () => {
      it('should log warn message with string', () => {
         logger.warn('Warning message');
         expect(consoleWarnSpy).toHaveBeenCalledWith('[WARN] Warning message');
      });

      it('should log warn message with object', () => {
         const data = { issue: 'deprecation', version: '2.0' };
         logger.warn('Deprecated API', data);
         expect(consoleWarnSpy).toHaveBeenCalledWith('[WARN] Deprecated API', data);
      });

      it('should not log warn when level is error', () => {
         const errorLogger = new ConsoleLogger('error');
         const spy = jest.spyOn(console, 'warn').mockImplementation(() => { });
         errorLogger.warn('Should not log');
         expect(spy).not.toHaveBeenCalled();
         spy.mockRestore();
      });
   });

   describe('error()', () => {
      it('should log error message with string', () => {
         logger.error('Error message');
         expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR] Error message');
      });

      it('should log error message with Error object', () => {
         const error = new Error('Fatal error');
         logger.error('Critical failure', error);
         expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR] Critical failure', error);
      });

      it('should log error message with stack trace', () => {
         const error = new Error('Error with stack');
         logger.error('Stack trace', error.stack);
         expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR] Stack trace', error.stack);
      });
   });

   describe('debug()', () => {
      it('should log debug message with string', () => {
         logger.debug('Debug message');
         expect(consoleDebugSpy).toHaveBeenCalledWith('[DEBUG] Debug message');
      });

      it('should log debug message with detailed object', () => {
         const debug = { query: 'SELECT * FROM users', duration: 45, rows: 100 };
         logger.debug('Query executed', debug);
         expect(consoleDebugSpy).toHaveBeenCalledWith('[DEBUG] Query executed', debug);
      });

      it('should not log debug when level is info', () => {
         const infoLogger = new ConsoleLogger('info');
         const spy = jest.spyOn(console, 'debug').mockImplementation(() => { });
         infoLogger.debug('Should not log');
         expect(spy).not.toHaveBeenCalled();
         spy.mockRestore();
      });
   });

   describe('Level Hierarchy', () => {
      it('should respect debug level (logs everything)', () => {
         const debugLogger = new ConsoleLogger('debug');
         const debugSpy = jest.spyOn(console, 'debug').mockImplementation(() => { });
         const infoSpy = jest.spyOn(console, 'info').mockImplementation(() => { });
         const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => { });
         const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

         debugLogger.debug('debug');
         debugLogger.info('info');
         debugLogger.warn('warn');
         debugLogger.error('error');

         expect(debugSpy).toHaveBeenCalled();
         expect(infoSpy).toHaveBeenCalled();
         expect(warnSpy).toHaveBeenCalled();
         expect(errorSpy).toHaveBeenCalled();

         debugSpy.mockRestore();
         infoSpy.mockRestore();
         warnSpy.mockRestore();
         errorSpy.mockRestore();
      });

      it('should respect info level', () => {
         const infoLogger = new ConsoleLogger('info');
         const debugSpy = jest.spyOn(console, 'debug').mockImplementation(() => { });
         const infoSpy = jest.spyOn(console, 'info').mockImplementation(() => { });
         const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => { });
         const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

         infoLogger.debug('debug');
         infoLogger.info('info');
         infoLogger.warn('warn');
         infoLogger.error('error');

         expect(debugSpy).not.toHaveBeenCalled();
         expect(infoSpy).toHaveBeenCalled();
         expect(warnSpy).toHaveBeenCalled();
         expect(errorSpy).toHaveBeenCalled();

         debugSpy.mockRestore();
         infoSpy.mockRestore();
         warnSpy.mockRestore();
         errorSpy.mockRestore();
      });

      it('should respect warn level', () => {
         const warnLogger = new ConsoleLogger('warn');
         const debugSpy = jest.spyOn(console, 'debug').mockImplementation(() => { });
         const infoSpy = jest.spyOn(console, 'info').mockImplementation(() => { });
         const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => { });
         const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

         warnLogger.debug('debug');
         warnLogger.info('info');
         warnLogger.warn('warn');
         warnLogger.error('error');

         expect(debugSpy).not.toHaveBeenCalled();
         expect(infoSpy).not.toHaveBeenCalled();
         expect(warnSpy).toHaveBeenCalled();
         expect(errorSpy).toHaveBeenCalled();

         debugSpy.mockRestore();
         infoSpy.mockRestore();
         warnSpy.mockRestore();
         errorSpy.mockRestore();
      });

      it('should respect error level', () => {
         const errorLogger = new ConsoleLogger('error');
         const debugSpy = jest.spyOn(console, 'debug').mockImplementation(() => { });
         const infoSpy = jest.spyOn(console, 'info').mockImplementation(() => { });
         const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => { });
         const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

         errorLogger.debug('debug');
         errorLogger.info('info');
         errorLogger.warn('warn');
         errorLogger.error('error');

         expect(debugSpy).not.toHaveBeenCalled();
         expect(infoSpy).not.toHaveBeenCalled();
         expect(warnSpy).not.toHaveBeenCalled();
         expect(errorSpy).toHaveBeenCalled();

         debugSpy.mockRestore();
         infoSpy.mockRestore();
         warnSpy.mockRestore();
         errorSpy.mockRestore();
      });

      it('should handle unknown level (defaults to info)', () => {
         const unknownLogger = new ConsoleLogger('silent');
         const debugSpy = jest.spyOn(console, 'debug').mockImplementation(() => { });
         const infoSpy = jest.spyOn(console, 'info').mockImplementation(() => { });
         const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => { });
         const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

         unknownLogger.debug('debug');
         unknownLogger.info('info');
         unknownLogger.warn('warn');
         unknownLogger.error('error');

         // Unknown level defaults to info (level 2), so debug won't log but info/warn/error will
         expect(debugSpy).not.toHaveBeenCalled();
         expect(infoSpy).toHaveBeenCalled();
         expect(warnSpy).toHaveBeenCalled();
         expect(errorSpy).toHaveBeenCalled();

         debugSpy.mockRestore();
         infoSpy.mockRestore();
         warnSpy.mockRestore();
         errorSpy.mockRestore();
      });
   });

   describe('Edge Cases', () => {
      it('should handle empty message', () => {
         logger.info('');
         expect(consoleInfoSpy).toHaveBeenCalledWith('[INFO] ');
      });

      it('should handle very long string', () => {
         const longString = 'a'.repeat(10000);
         logger.info(longString);
         expect(consoleInfoSpy).toHaveBeenCalledWith(`[INFO] ${longString}`);
      });

      it('should handle circular reference in object', () => {
         const circular: { name: string; child?: unknown } = { name: 'test' };
         circular.child = circular;
         logger.info('Circular ref', circular);
         expect(consoleInfoSpy).toHaveBeenCalled();
      });

      it('should handle special characters', () => {
         logger.info('Unicode: 你好 🚀 ❤️ \n\t\r');
         expect(consoleInfoSpy).toHaveBeenCalled();
      });

      it('should handle Date object', () => {
         const date = new Date('2025-11-28T12:00:00Z');
         logger.info('Date', date);
         expect(consoleInfoSpy).toHaveBeenCalledWith('[INFO] Date', date);
      });

      it('should handle RegExp', () => {
         const regex = /test/gi;
         logger.info('RegExp', regex);
         expect(consoleInfoSpy).toHaveBeenCalledWith('[INFO] RegExp', regex);
      });

      it('should handle Symbol', () => {
         const sym = Symbol('unique');
         logger.info('Symbol', sym);
         expect(consoleInfoSpy).toHaveBeenCalledWith('[INFO] Symbol', sym);
      });

      it('should handle Map', () => {
         const map = new Map([
            ['key1', 'val1'],
            ['key2', 'val2'],
         ]);
         logger.info('Map', map);
         expect(consoleInfoSpy).toHaveBeenCalledWith('[INFO] Map', map);
      });

      it('should handle Set', () => {
         const set = new Set([1, 2, 3, 'four']);
         logger.info('Set', set);
         expect(consoleInfoSpy).toHaveBeenCalledWith('[INFO] Set', set);
      });

      it('should handle Buffer/Uint8Array', () => {
         const buffer = new Uint8Array([72, 101, 108, 108, 111]);
         logger.info('Buffer', buffer);
         expect(consoleInfoSpy).toHaveBeenCalledWith('[INFO] Buffer', buffer);
      });
   });

   describe('Performance', () => {
      it('should handle rapid consecutive calls efficiently', () => {
         const start = performance.now();

         for (let i = 0; i < 1000; i++) {
            logger.info(`Message ${i}`, { iteration: i });
         }

         const elapsed = performance.now() - start;

         expect(consoleInfoSpy).toHaveBeenCalledTimes(1000);
         expect(elapsed).toBeLessThan(100); // Should complete 1000 logs in < 100ms
      });

      it('should handle large metadata objects without significant overhead', () => {
         const largeObj = Object.fromEntries(
            Array.from({ length: 1000 }, (_, i) => [`key${i}`, `val${i}`]),
         );

         const start = performance.now();
         logger.info('Large obj', largeObj);
         const elapsed = performance.now() - start;

         expect(consoleInfoSpy).toHaveBeenCalledWith('[INFO] Large obj', largeObj);
         expect(elapsed).toBeLessThan(10); // Single large object log should be < 10ms
      });
   });
});
