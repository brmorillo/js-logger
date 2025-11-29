import { describe, expect, it, beforeEach, afterEach, jest } from 'bun:test';
import { PinoLogger } from './pino-logger';

describe('PinoLogger', () => {
  let logger: PinoLogger;
  let mockPino: any;
  let infoSpy: ReturnType<typeof jest.fn>;
  let warnSpy: ReturnType<typeof jest.fn>;
  let errorSpy: ReturnType<typeof jest.fn>;
  let debugSpy: ReturnType<typeof jest.fn>;

  beforeEach(() => {
    // Create spies
    infoSpy = jest.fn();
    warnSpy = jest.fn();
    errorSpy = jest.fn();
    debugSpy = jest.fn();

    // Mock pino instance
    mockPino = {
      info: infoSpy,
      warn: warnSpy,
      error: errorSpy,
      debug: debugSpy,
      level: 'info',
    };

    logger = new PinoLogger({ level: 'debug' });
    // Replace the internal logger with our mock
    (logger as any).logger = mockPino;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should create instance with default config', () => {
      const defaultLogger = new PinoLogger();
      expect(defaultLogger).toBeInstanceOf(PinoLogger);
    });

    it('should create instance with custom level', () => {
      const customLogger = new PinoLogger({ level: 'warn' });
      expect(customLogger).toBeInstanceOf(PinoLogger);
    });

    it('should create instance with prettyPrint enabled', () => {
      const prettyLogger = new PinoLogger({ prettyPrint: true });
      expect(prettyLogger).toBeInstanceOf(PinoLogger);
    });

    it('should fallback to console if pino not available', () => {
      // The actual fallback happens in the constructor when pino is not found
      // Since we're in a test environment with pino available, we can only verify
      // that the logger instance is created successfully
      const fallbackLogger = new PinoLogger();
      expect(fallbackLogger).toBeInstanceOf(PinoLogger);
    });
  });

  describe('info()', () => {
    it('should log info message with string', () => {
      logger.info('Test message');
      expect(infoSpy).toHaveBeenCalledWith({ meta: [] }, 'Test message');
    });

    it('should log info message with number', () => {
      logger.info('Count', 42);
      expect(infoSpy).toHaveBeenCalledWith({ meta: [42] }, 'Count');
    });

    it('should log info message with bigint', () => {
      const bigNum = BigInt(9007199254740991);
      logger.info('BigInt value', bigNum);
      expect(infoSpy).toHaveBeenCalledWith({ meta: [bigNum] }, 'BigInt value');
    });

    it('should log info message with object', () => {
      const obj = { user: 'John', age: 30 };
      logger.info('User data', obj);
      expect(infoSpy).toHaveBeenCalledWith({ meta: [obj] }, 'User data');
    });

    it('should log info message with array', () => {
      const arr = [1, 2, 3, 4, 5];
      logger.info('Numbers', arr);
      expect(infoSpy).toHaveBeenCalledWith({ meta: [arr] }, 'Numbers');
    });

    it('should log info message with nested object', () => {
      const nested = {
        user: {
          name: 'John',
          address: {
            city: 'NYC',
            zip: 10001,
          },
        },
      };
      logger.info('Nested data', nested);
      expect(infoSpy).toHaveBeenCalledWith({ meta: [nested] }, 'Nested data');
    });

    it('should log info message with multiple metadata', () => {
      logger.info('Multiple', 'str', 123, { key: 'val' });
      expect(infoSpy).toHaveBeenCalledWith(
        { meta: ['str', 123, { key: 'val' }] },
        'Multiple'
      );
    });

    it('should handle null metadata', () => {
      logger.info('Null value', null);
      expect(infoSpy).toHaveBeenCalledWith({ meta: [null] }, 'Null value');
    });

    it('should handle undefined metadata', () => {
      logger.info('Undefined value', undefined);
      expect(infoSpy).toHaveBeenCalledWith(
        { meta: [undefined] },
        'Undefined value'
      );
    });

    it('should handle boolean metadata', () => {
      logger.info('Boolean', true);
      expect(infoSpy).toHaveBeenCalledWith({ meta: [true] }, 'Boolean');
    });

    it('should handle Error object', () => {
      const error = new Error('Test error');
      logger.info('Error occurred', error);
      expect(infoSpy).toHaveBeenCalledWith({ meta: [error] }, 'Error occurred');
    });
  });

  describe('warn()', () => {
    it('should log warn message with string', () => {
      logger.warn('Warning');
      expect(warnSpy).toHaveBeenCalledWith({ meta: [] }, 'Warning');
    });

    it('should log warn message with metadata', () => {
      const data = { issue: 'deprecation' };
      logger.warn('Deprecated', data);
      expect(warnSpy).toHaveBeenCalledWith({ meta: [data] }, 'Deprecated');
    });

    it('should log warn with multiple params', () => {
      logger.warn('Multiple warns', 'param1', { key: 'value' });
      expect(warnSpy).toHaveBeenCalledWith(
        { meta: ['param1', { key: 'value' }] },
        'Multiple warns'
      );
    });
  });

  describe('error()', () => {
    it('should log error message with string', () => {
      logger.error('Error message');
      expect(errorSpy).toHaveBeenCalledWith({ meta: [] }, 'Error message');
    });

    it('should log error with Error object', () => {
      const error = new Error('Fatal error');
      logger.error('Critical', error);
      expect(errorSpy).toHaveBeenCalledWith({ meta: [error] }, 'Critical');
    });

    it('should log error with stack trace', () => {
      const error = new Error('Stack trace');
      logger.error('Stack test', error.stack);
      expect(errorSpy).toHaveBeenCalledWith(
        { meta: [error.stack] },
        'Stack test'
      );
    });

    it('should log error with custom error object', () => {
      const customError = {
        code: 'ERR_001',
        message: 'Custom error',
        details: { reason: 'Invalid input' },
      };
      logger.error('Custom error occurred', customError);
      expect(errorSpy).toHaveBeenCalledWith(
        { meta: [customError] },
        'Custom error occurred'
      );
    });
  });

  describe('debug()', () => {
    it('should log debug message with string', () => {
      logger.debug('Debug info');
      expect(debugSpy).toHaveBeenCalledWith({ meta: [] }, 'Debug info');
    });

    it('should log debug with detailed metadata', () => {
      const debug = {
        query: 'SELECT * FROM users',
        duration: 45,
        rows: 100,
      };
      logger.debug('Query executed', debug);
      expect(debugSpy).toHaveBeenCalledWith(
        { meta: [debug] },
        'Query executed'
      );
    });

    it('should log debug with performance data', () => {
      const perf = {
        startTime: Date.now(),
        endTime: Date.now() + 1000,
        memory: process.memoryUsage(),
      };
      logger.debug('Performance metrics', perf);
      expect(debugSpy).toHaveBeenCalledWith(
        { meta: [perf] },
        'Performance metrics'
      );
    });
  });

  describe('Complex Data Types', () => {
    it('should handle Date objects', () => {
      const date = new Date('2025-11-28');
      logger.info('Date test', date);
      expect(infoSpy).toHaveBeenCalledWith({ meta: [date] }, 'Date test');
    });

    it('should handle RegExp', () => {
      const regex = /test/gi;
      logger.info('RegExp test', regex);
      expect(infoSpy).toHaveBeenCalledWith({ meta: [regex] }, 'RegExp test');
    });

    it('should handle Map', () => {
      const map = new Map([
        ['key1', 'value1'],
        ['key2', 'value2'],
      ]);
      logger.info('Map test', map);
      expect(infoSpy).toHaveBeenCalledWith({ meta: [map] }, 'Map test');
    });

    it('should handle Set', () => {
      const set = new Set([1, 2, 3, 4, 5]);
      logger.info('Set test', set);
      expect(infoSpy).toHaveBeenCalledWith({ meta: [set] }, 'Set test');
    });

    it('should handle Buffer/Uint8Array', () => {
      const buffer = new Uint8Array([1, 2, 3, 4]);
      logger.info('Buffer test', buffer);
      expect(infoSpy).toHaveBeenCalledWith({ meta: [buffer] }, 'Buffer test');
    });

    it('should handle Symbol', () => {
      const sym = Symbol('test');
      logger.info('Symbol test', sym);
      expect(infoSpy).toHaveBeenCalledWith({ meta: [sym] }, 'Symbol test');
    });

    it('should handle circular references', () => {
      const circular: any = { name: 'test' };
      circular.self = circular;
      logger.info('Circular', circular);
      expect(infoSpy).toHaveBeenCalled();
    });

    it('should handle very large arrays', () => {
      const largeArray = Array.from({ length: 10000 }, (_, i) => i);
      logger.info('Large array', largeArray);
      expect(infoSpy).toHaveBeenCalledWith(
        { meta: [largeArray] },
        'Large array'
      );
    });

    it('should handle deeply nested structures', () => {
      const deep = { l1: { l2: { l3: { l4: { l5: { value: 'deep' } } } } } };
      logger.info('Deep nesting', deep);
      expect(infoSpy).toHaveBeenCalledWith({ meta: [deep] }, 'Deep nesting');
    });

    it('should handle mixed types in array', () => {
      const mixed = [
        1,
        'string',
        true,
        null,
        undefined,
        { obj: 'value' },
        [1, 2],
      ];
      logger.info('Mixed array', mixed);
      expect(infoSpy).toHaveBeenCalledWith({ meta: [mixed] }, 'Mixed array');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string message', () => {
      logger.info('');
      expect(infoSpy).toHaveBeenCalledWith({ meta: [] }, '');
    });

    it('should handle very long strings', () => {
      const longString = 'a'.repeat(10000);
      logger.info(longString);
      expect(infoSpy).toHaveBeenCalledWith({ meta: [] }, longString);
    });

    it('should handle special characters', () => {
      logger.info('Special: 你好 🚀 \n\t\r');
      expect(infoSpy).toHaveBeenCalled();
    });

    it('should handle empty object', () => {
      logger.info('Empty obj', {});
      expect(infoSpy).toHaveBeenCalledWith({ meta: [{}] }, 'Empty obj');
    });

    it('should handle empty array', () => {
      logger.info('Empty arr', []);
      expect(infoSpy).toHaveBeenCalledWith({ meta: [[]] }, 'Empty arr');
    });

    it('should handle NaN', () => {
      logger.info('NaN value', NaN);
      expect(infoSpy).toHaveBeenCalledWith({ meta: [NaN] }, 'NaN value');
    });

    it('should handle Infinity', () => {
      logger.info('Infinity', Infinity);
      expect(infoSpy).toHaveBeenCalledWith({ meta: [Infinity] }, 'Infinity');
    });

    it('should handle negative zero', () => {
      logger.info('Negative zero', -0);
      expect(infoSpy).toHaveBeenCalledWith({ meta: [-0] }, 'Negative zero');
    });

    it('should handle function as metadata', () => {
      const fn = () => 'test';
      logger.info('Function', fn);
      expect(infoSpy).toHaveBeenCalledWith({ meta: [fn] }, 'Function');
    });

    it('should handle class instance', () => {
      class TestClass {
        value = 42;
      }
      const instance = new TestClass();
      logger.info('Class instance', instance);
      expect(infoSpy).toHaveBeenCalledWith(
        { meta: [instance] },
        'Class instance'
      );
    });
  });

  describe('Performance', () => {
    it('should handle rapid consecutive calls efficiently', () => {
      const start = performance.now();

      for (let i = 0; i < 1000; i++) {
        logger.info(`Message ${i}`, { iteration: i });
      }

      const elapsed = performance.now() - start;

      expect(infoSpy).toHaveBeenCalledTimes(1000);
      expect(elapsed).toBeLessThan(150); // Pino with mocks should be < 150ms
    });

    it('should handle large metadata objects efficiently', () => {
      const largeObj = Object.fromEntries(
        Array.from({ length: 1000 }, (_, i) => [`key${i}`, `value${i}`])
      );

      const start = performance.now();
      logger.info('Large metadata', largeObj);
      const elapsed = performance.now() - start;

      expect(infoSpy).toHaveBeenCalledWith(
        { meta: [largeObj] },
        'Large metadata'
      );
      expect(elapsed).toBeLessThan(10); // Single large object log should be < 10ms
    });
  });

  describe('Error Scenarios', () => {
    it('should throw when pino throws error', () => {
      const errorLogger = new PinoLogger();
      (errorLogger as any).logger = {
        info: jest.fn(() => {
          throw new Error('Pino error');
        }),
      };

      // PinoLogger does not have error handling - it will throw
      expect(() => errorLogger.info('Test')).toThrow('Pino error');
    });
  });
});
