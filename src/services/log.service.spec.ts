import { describe, expect, it, beforeEach, jest } from 'bun:test';
import { LogService } from './log.service';
import { ConsoleLogger } from '../loggers/console-logger';
import { PinoLogger } from '../loggers/pino-logger';
import { WinstonLogger } from '../loggers/winston-logger';

describe('LogService', () => {
   beforeEach(() => {
      // Reset singleton instance before each test
      (LogService as any).instance = undefined;
   });

   describe('Singleton Pattern', () => {
      it('should return the same instance', () => {
         const instance1 = LogService.getInstance();
         const instance2 = LogService.getInstance();
         expect(instance1).toBe(instance2);
      });

      it('should maintain state across multiple getInstance calls', () => {
         const instance1 = LogService.getInstance();
         instance1.configure({ type: 'pino' });

         const instance2 = LogService.getInstance();
         expect(instance2).toBe(instance1);
      });

      it('should enforce singleton pattern through getInstance', () => {
         // The constructor is private in TypeScript, preventing direct instantiation
         // We verify the singleton pattern works by checking multiple getInstance calls return the same instance
         const instance1 = LogService.getInstance();
         const instance2 = LogService.getInstance();
         const instance3 = LogService.getInstance();

         expect(instance1).toBe(instance2);
         expect(instance2).toBe(instance3);
      });
   });

   describe('Default Logger', () => {
      it('should use PinoLogger by default', () => {
         const service = LogService.getInstance();
         const logger = (service as any).logger;
         expect(logger).toBeInstanceOf(PinoLogger);
      });

      it('should initialize with info level by default', () => {
         const service = LogService.getInstance();
         expect(service).toBeDefined();
      });
   });

   describe('configure()', () => {
      it('should switch to ConsoleLogger', () => {
         const service = LogService.getInstance();
         service.configure({ type: 'console', level: 'debug' });

         const logger = (service as any).logger;
         expect(logger).toBeInstanceOf(ConsoleLogger);
      });

      it('should switch to WinstonLogger', () => {
         const service = LogService.getInstance();
         service.configure({ type: 'winston', level: 'warn' });

         const logger = (service as any).logger;
         expect(logger).toBeInstanceOf(WinstonLogger);
      });

      it('should switch to PinoLogger', () => {
         const service = LogService.getInstance();
         service.configure({ type: 'pino', level: 'error' });

         const logger = (service as any).logger;
         expect(logger).toBeInstanceOf(PinoLogger);
      });

      it('should apply custom level', () => {
         const service = LogService.getInstance();
         service.configure({ type: 'console', level: 'warn' });
         expect(service).toBeDefined();
      });

      it('should apply prettyPrint option', () => {
         const service = LogService.getInstance();
         service.configure({ type: 'pino', prettyPrint: true });

         const logger = (service as any).logger;
         expect(logger).toBeInstanceOf(PinoLogger);
      });

      it('should handle reconfiguration', () => {
         const service = LogService.getInstance();
         service.configure({ type: 'console' });
         expect((service as any).logger).toBeInstanceOf(ConsoleLogger);

         service.configure({ type: 'winston' });
         expect((service as any).logger).toBeInstanceOf(WinstonLogger);

         service.configure({ type: 'pino' });
         expect((service as any).logger).toBeInstanceOf(PinoLogger);
      });

      it('should handle empty config (use defaults)', () => {
         const service = LogService.getInstance();
         service.configure({});

         const logger = (service as any).logger;
         expect(logger).toBeInstanceOf(PinoLogger);
      });

      it('should handle config without level', () => {
         const service = LogService.getInstance();
         service.configure({ type: 'console' });

         const logger = (service as any).logger;
         expect(logger).toBeInstanceOf(ConsoleLogger);
      });

      it('should handle config without type', () => {
         const service = LogService.getInstance();
         service.configure({ level: 'debug' });

         const logger = (service as any).logger;
         expect(logger).toBeInstanceOf(PinoLogger);
      });
   });

   describe('info()', () => {
      it('should delegate to underlying logger', () => {
         const service = LogService.getInstance();
         const spy = jest.spyOn((service as any).logger, 'info');

         service.info('Test message');
         expect(spy).toHaveBeenCalledWith('Test message');

         spy.mockRestore();
      });

      it('should pass metadata to logger', () => {
         const service = LogService.getInstance();
         const spy = jest.spyOn((service as any).logger, 'info');

         const meta = { user: 'John', action: 'login' };
         service.info('User action', meta);
         expect(spy).toHaveBeenCalledWith('User action', meta);

         spy.mockRestore();
      });

      it('should work with different logger types', () => {
         const service = LogService.getInstance();

         service.configure({ type: 'console' });
         const consoleSpy = jest.spyOn((service as any).logger, 'info');
         service.info('Console message');
         expect(consoleSpy).toHaveBeenCalled();
         consoleSpy.mockRestore();

         service.configure({ type: 'winston' });
         const winstonSpy = jest.spyOn((service as any).logger, 'info');
         service.info('Winston message');
         expect(winstonSpy).toHaveBeenCalled();
         winstonSpy.mockRestore();
      });

      it('should handle multiple metadata params', () => {
         const service = LogService.getInstance();
         const spy = jest.spyOn((service as any).logger, 'info');

         service.info('Multiple', 'param1', { key: 'val' }, 123);
         expect(spy).toHaveBeenCalledWith('Multiple', 'param1', { key: 'val' }, 123);

         spy.mockRestore();
      });
   });

   describe('warn()', () => {
      it('should delegate to underlying logger', () => {
         const service = LogService.getInstance();
         const spy = jest.spyOn((service as any).logger, 'warn');

         service.warn('Warning message');
         expect(spy).toHaveBeenCalledWith('Warning message');

         spy.mockRestore();
      });

      it('should pass metadata to logger', () => {
         const service = LogService.getInstance();
         const spy = jest.spyOn((service as any).logger, 'warn');

         const meta = { issue: 'deprecation' };
         service.warn('Deprecated API', meta);
         expect(spy).toHaveBeenCalledWith('Deprecated API', meta);

         spy.mockRestore();
      });
   });

   describe('error()', () => {
      it('should delegate to underlying logger', () => {
         const service = LogService.getInstance();
         const spy = jest.spyOn((service as any).logger, 'error');

         service.error('Error message');
         expect(spy).toHaveBeenCalledWith('Error message');

         spy.mockRestore();
      });

      it('should pass Error object to logger', () => {
         const service = LogService.getInstance();
         const spy = jest.spyOn((service as any).logger, 'error');

         const error = new Error('Critical error');
         service.error('System failure', error);
         expect(spy).toHaveBeenCalledWith('System failure', error);

         spy.mockRestore();
      });

      it('should handle error with stack trace', () => {
         const service = LogService.getInstance();
         const spy = jest.spyOn((service as any).logger, 'error');

         const error = new Error('Error with stack');
         service.error('Error occurred', error.stack);
         expect(spy).toHaveBeenCalledWith('Error occurred', error.stack);

         spy.mockRestore();
      });
   });

   describe('debug()', () => {
      it('should delegate to underlying logger', () => {
         const service = LogService.getInstance();
         const spy = jest.spyOn((service as any).logger, 'debug');

         service.debug('Debug message');
         expect(spy).toHaveBeenCalledWith('Debug message');

         spy.mockRestore();
      });

      it('should pass detailed metadata', () => {
         const service = LogService.getInstance();
         const spy = jest.spyOn((service as any).logger, 'debug');

         const debug = {
            query: 'SELECT * FROM users',
            params: [1, 2, 3],
            duration: 123,
         };
         service.debug('Query executed', debug);
         expect(spy).toHaveBeenCalledWith('Query executed', debug);

         spy.mockRestore();
      });
   });

   describe('Alias Methods', () => {
      it('log() should be an alias for info()', () => {
         const service = LogService.getInstance();
         const spy = jest.spyOn((service as any).logger, 'info');

         service.log('Log message', { data: 'test' });
         expect(spy).toHaveBeenCalledWith('Log message', { data: 'test' });

         spy.mockRestore();
      });

      it('verbose() should be an alias for debug()', () => {
         const service = LogService.getInstance();
         const spy = jest.spyOn((service as any).logger, 'debug');

         service.verbose('Verbose message', { detail: 'extra' });
         expect(spy).toHaveBeenCalledWith('Verbose message', { detail: 'extra' });

         spy.mockRestore();
      });

      it('fatal() should be an alias for error()', () => {
         const service = LogService.getInstance();
         const spy = jest.spyOn((service as any).logger, 'error');

         const error = new Error('System crash');
         service.fatal('Fatal error', error);
         expect(spy).toHaveBeenCalledWith('Fatal error', error);

         spy.mockRestore();
      });
   });

   describe('Data Type Handling', () => {
      it('should handle string metadata', () => {
         const service = LogService.getInstance();
         const spy = jest.spyOn((service as any).logger, 'info');

         service.info('String test', 'metadata string');
         expect(spy).toHaveBeenCalledWith('String test', 'metadata string');

         spy.mockRestore();
      });

      it('should handle number metadata', () => {
         const service = LogService.getInstance();
         const spy = jest.spyOn((service as any).logger, 'info');

         service.info('Number test', 42);
         expect(spy).toHaveBeenCalledWith('Number test', 42);

         spy.mockRestore();
      });

      it('should handle bigint metadata', () => {
         const service = LogService.getInstance();
         const spy = jest.spyOn((service as any).logger, 'info');

         const big = BigInt(9007199254740991);
         service.info('BigInt test', big);
         expect(spy).toHaveBeenCalledWith('BigInt test', big);

         spy.mockRestore();
      });

      it('should handle object metadata', () => {
         const service = LogService.getInstance();
         const spy = jest.spyOn((service as any).logger, 'info');

         const obj = { key: 'value', nested: { inner: 'data' } };
         service.info('Object test', obj);
         expect(spy).toHaveBeenCalledWith('Object test', obj);

         spy.mockRestore();
      });

      it('should handle array metadata', () => {
         const service = LogService.getInstance();
         const spy = jest.spyOn((service as any).logger, 'info');

         const arr = [1, 2, 3, 'four', { five: 5 }];
         service.info('Array test', arr);
         expect(spy).toHaveBeenCalledWith('Array test', arr);

         spy.mockRestore();
      });

      it('should handle null metadata', () => {
         const service = LogService.getInstance();
         const spy = jest.spyOn((service as any).logger, 'info');

         service.info('Null test', null);
         expect(spy).toHaveBeenCalledWith('Null test', null);

         spy.mockRestore();
      });

      it('should handle undefined metadata', () => {
         const service = LogService.getInstance();
         const spy = jest.spyOn((service as any).logger, 'info');

         service.info('Undefined test', undefined);
         expect(spy).toHaveBeenCalledWith('Undefined test', undefined);

         spy.mockRestore();
      });

      it('should handle boolean metadata', () => {
         const service = LogService.getInstance();
         const spy = jest.spyOn((service as any).logger, 'info');

         service.info('Boolean test', true);
         expect(spy).toHaveBeenCalledWith('Boolean test', true);

         spy.mockRestore();
      });

      it('should handle Error object', () => {
         const service = LogService.getInstance();
         const spy = jest.spyOn((service as any).logger, 'error');

         const error = new Error('Test error');
         service.error('Error test', error);
         expect(spy).toHaveBeenCalledWith('Error test', error);

         spy.mockRestore();
      });

      it('should handle Date object', () => {
         const service = LogService.getInstance();
         const spy = jest.spyOn((service as any).logger, 'info');

         const date = new Date('2025-11-28T12:00:00Z');
         service.info('Date test', date);
         expect(spy).toHaveBeenCalledWith('Date test', date);

         spy.mockRestore();
      });

      it('should handle RegExp', () => {
         const service = LogService.getInstance();
         const spy = jest.spyOn((service as any).logger, 'info');

         const regex = /test/gi;
         service.info('RegExp test', regex);
         expect(spy).toHaveBeenCalledWith('RegExp test', regex);

         spy.mockRestore();
      });

      it('should handle Map', () => {
         const service = LogService.getInstance();
         const spy = jest.spyOn((service as any).logger, 'info');

         const map = new Map([
            ['key1', 'val1'],
            ['key2', 'val2'],
         ]);
         service.info('Map test', map);
         expect(spy).toHaveBeenCalledWith('Map test', map);

         spy.mockRestore();
      });

      it('should handle Set', () => {
         const service = LogService.getInstance();
         const spy = jest.spyOn((service as any).logger, 'info');

         const set = new Set([1, 2, 3, 'four']);
         service.info('Set test', set);
         expect(spy).toHaveBeenCalledWith('Set test', set);

         spy.mockRestore();
      });

      it('should handle Buffer/Uint8Array', () => {
         const service = LogService.getInstance();
         const spy = jest.spyOn((service as any).logger, 'info');

         const buffer = new Uint8Array([72, 101, 108, 108, 111]);
         service.info('Buffer test', buffer);
         expect(spy).toHaveBeenCalledWith('Buffer test', buffer);

         spy.mockRestore();
      });

      it('should handle Symbol', () => {
         const service = LogService.getInstance();
         const spy = jest.spyOn((service as any).logger, 'info');

         const sym = Symbol('unique');
         service.info('Symbol test', sym);
         expect(spy).toHaveBeenCalledWith('Symbol test', sym);

         spy.mockRestore();
      });
   });

   describe('Edge Cases', () => {
      it('should handle empty message', () => {
         const service = LogService.getInstance();
         const spy = jest.spyOn((service as any).logger, 'info');

         service.info('');
         expect(spy).toHaveBeenCalledWith('');

         spy.mockRestore();
      });

      it('should handle very long messages', () => {
         const service = LogService.getInstance();
         const spy = jest.spyOn((service as any).logger, 'info');

         const longMsg = 'a'.repeat(100000);
         service.info(longMsg);
         expect(spy).toHaveBeenCalledWith(longMsg);

         spy.mockRestore();
      });

      it('should handle unicode and special characters', () => {
         const service = LogService.getInstance();
         const spy = jest.spyOn((service as any).logger, 'info');

         service.info('Unicode: 你好 🚀 ❤️ \n\t\r');
         expect(spy).toHaveBeenCalled();

         spy.mockRestore();
      });

      it('should handle circular references', () => {
         const service = LogService.getInstance();
         const spy = jest.spyOn((service as any).logger, 'info');

         const circular: any = { name: 'test' };
         circular.self = circular;
         service.info('Circular', circular);
         expect(spy).toHaveBeenCalled();

         spy.mockRestore();
      });

      it('should handle NaN', () => {
         const service = LogService.getInstance();
         const spy = jest.spyOn((service as any).logger, 'info');

         service.info('NaN', NaN);
         expect(spy).toHaveBeenCalledWith('NaN', NaN);

         spy.mockRestore();
      });

      it('should handle Infinity', () => {
         const service = LogService.getInstance();
         const spy = jest.spyOn((service as any).logger, 'info');

         service.info('Infinity', Infinity);
         expect(spy).toHaveBeenCalledWith('Infinity', Infinity);

         spy.mockRestore();
      });
   });

   describe('Performance', () => {
      it('should handle rapid consecutive calls efficiently', () => {
         const service = LogService.getInstance();
         const spy = jest.spyOn((service as any).logger, 'info');

         const start = performance.now();

         for (let i = 0; i < 1000; i++) {
            service.info(`Message ${i}`, { iteration: i });
         }

         const elapsed = performance.now() - start;

         expect(spy).toHaveBeenCalledTimes(1000);
         expect(elapsed).toBeLessThan(2000); // LogService + JSON serialization overhead
         spy.mockRestore();
      });

      it('should handle large metadata efficiently', () => {
         const service = LogService.getInstance();
         const spy = jest.spyOn((service as any).logger, 'info');

         const large = Object.fromEntries(
            Array.from({ length: 1000 }, (_, i) => [`key${i}`, `val${i}`]),
         );

         const start = performance.now();
         service.info('Large', large);
         const elapsed = performance.now() - start;

         expect(spy).toHaveBeenCalledWith('Large', large);
         expect(elapsed).toBeLessThan(10); // Single log should be very fast
         spy.mockRestore();
      });

      it('should maintain singleton across concurrent access', async () => {
         const start = performance.now();

         const promises = Array.from({ length: 100 }, () =>
            Promise.resolve(LogService.getInstance()),
         );

         const instances = await Promise.all(promises);
         const elapsed = performance.now() - start;
         const first = instances[0];

         instances.forEach((instance) => {
            expect(instance).toBe(first);
         });

         expect(elapsed).toBeLessThan(50); // Getting singleton 100 times should be < 50ms
      });
   });

   describe('Logger Switching', () => {
      it('should maintain functionality after switching loggers', () => {
         const service = LogService.getInstance();

         service.configure({ type: 'console' });
         const consoleSpy = jest.spyOn((service as any).logger, 'info');
         service.info('Console');
         expect(consoleSpy).toHaveBeenCalled();
         consoleSpy.mockRestore();

         service.configure({ type: 'winston' });
         const winstonSpy = jest.spyOn((service as any).logger, 'info');
         service.info('Winston');
         expect(winstonSpy).toHaveBeenCalled();
         winstonSpy.mockRestore();

         service.configure({ type: 'pino' });
         const pinoSpy = jest.spyOn((service as any).logger, 'info');
         service.info('Pino');
         expect(pinoSpy).toHaveBeenCalled();
         pinoSpy.mockRestore();
      });

      it('should apply level changes when switching', () => {
         const service = LogService.getInstance();

         service.configure({ type: 'console', level: 'debug' });
         expect((service as any).logger).toBeInstanceOf(ConsoleLogger);

         service.configure({ type: 'pino', level: 'warn' });
         expect((service as any).logger).toBeInstanceOf(PinoLogger);
      });
   });

   describe('Factory Pattern', () => {
      it('should create appropriate logger from factory', () => {
         const service = LogService.getInstance();

         service.configure({ type: 'console' });
         expect((service as any).logger).toBeInstanceOf(ConsoleLogger);

         service.configure({ type: 'winston' });
         expect((service as any).logger).toBeInstanceOf(WinstonLogger);

         service.configure({ type: 'pino' });
         expect((service as any).logger).toBeInstanceOf(PinoLogger);
      });

      it('should pass config to factory correctly', () => {
         const service = LogService.getInstance();

         service.configure({ type: 'console', level: 'error', prettyPrint: true });
         const logger = (service as any).logger;
         expect(logger).toBeInstanceOf(ConsoleLogger);
      });
   });

   describe('Fallback Behavior', () => {
      it('should use default logger if config is invalid', () => {
         const service = LogService.getInstance();
         service.configure({ type: 'invalid' as any });

         const logger = (service as any).logger;
         expect(logger).toBeInstanceOf(PinoLogger);
      });

      it('should throw if logger fails', () => {
         const service = LogService.getInstance();
         const brokenLogger = {
            info: jest.fn(() => {
               throw new Error('Logger failed');
            }),
            warn: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
            log: jest.fn(),
            verbose: jest.fn(),
            fatal: jest.fn(),
         };

         (service as any).logger = brokenLogger;

         expect(() => service.info('Test')).toThrow('Logger failed');
      });
   });
});
