import { describe, expect, it, beforeEach, afterEach, jest } from 'bun:test';
import { WinstonLogger } from './winston-logger';

describe('WinstonLogger', () => {
  let logger: WinstonLogger;
  let mockWinston: any;
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

    // Mock winston instance
    mockWinston = {
      info: infoSpy,
      warn: warnSpy,
      error: errorSpy,
      debug: debugSpy,
      level: 'info',
    };

    logger = new WinstonLogger({ level: 'debug' });
    // Replace the internal logger with our mock
    (logger as any).logger = mockWinston;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should create instance with default config', () => {
      const defaultLogger = new WinstonLogger();
      expect(defaultLogger).toBeInstanceOf(WinstonLogger);
    });

    it('should create instance with custom level', () => {
      const customLogger = new WinstonLogger({ level: 'warn' });
      expect(customLogger).toBeInstanceOf(WinstonLogger);
    });

    it('should create instance with prettyPrint enabled', () => {
      const prettyLogger = new WinstonLogger({ prettyPrint: true });
      expect(prettyLogger).toBeInstanceOf(WinstonLogger);
    });

    it('should fallback to console if winston not available', () => {
      const originalRequire = global.require;
      (global as any).require = jest.fn(() => {
        throw new Error('Module not found');
      });

      const consoleSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});
      const fallbackLogger = new WinstonLogger();

      expect(consoleSpy).toHaveBeenCalledWith(
        '[WinstonLogger] Winston not found. Falling back to console logger. Install winston: bun add winston'
      );

      consoleSpy.mockRestore();
      (global as any).require = originalRequire;
    });
  });

  describe('info()', () => {
    it('should log info message with string', () => {
      logger.info('Test message');
      expect(infoSpy).toHaveBeenCalledWith('Test message');
    });

    it('should log info message with metadata object', () => {
      const meta = { user: 'John', age: 30 };
      logger.info('User login', meta);
      expect(infoSpy).toHaveBeenCalledWith('User login', meta);
    });

    it('should log info with number metadata', () => {
      logger.info('Count', 42);
      expect(infoSpy).toHaveBeenCalledWith('Count', 42);
    });

    it('should log info with bigint', () => {
      const bigNum = BigInt(9007199254740991);
      logger.info('BigInt value', bigNum);
      expect(infoSpy).toHaveBeenCalledWith('BigInt value', bigNum);
    });

    it('should log info with array', () => {
      const arr = [1, 2, 3, 4, 5];
      logger.info('Array data', arr);
      expect(infoSpy).toHaveBeenCalledWith('Array data', arr);
    });

    it('should log info with nested object', () => {
      const nested = {
        user: {
          name: 'John',
          address: {
            city: 'NYC',
            zip: 10001,
          },
        },
      };
      logger.info('Nested structure', nested);
      expect(infoSpy).toHaveBeenCalledWith('Nested structure', nested);
    });

    it('should log info with multiple metadata params', () => {
      logger.info('Multiple', 'str', 123, { key: 'val' });
      expect(infoSpy).toHaveBeenCalledWith('Multiple', 'str', 123, {
        key: 'val',
      });
    });

    it('should handle null', () => {
      logger.info('Null value', null);
      expect(infoSpy).toHaveBeenCalledWith('Null value', null);
    });

    it('should handle undefined', () => {
      logger.info('Undefined value', undefined);
      expect(infoSpy).toHaveBeenCalledWith('Undefined value', undefined);
    });

    it('should handle boolean', () => {
      logger.info('Boolean', true);
      expect(infoSpy).toHaveBeenCalledWith('Boolean', true);
    });

    it('should handle Error object', () => {
      const error = new Error('Test error');
      logger.info('Error info', error);
      expect(infoSpy).toHaveBeenCalledWith('Error info', error);
    });
  });

  describe('warn()', () => {
    it('should log warn message with string', () => {
      logger.warn('Warning message');
      expect(warnSpy).toHaveBeenCalledWith('Warning message');
    });

    it('should log warn with metadata', () => {
      const data = { issue: 'deprecation', version: '2.0' };
      logger.warn('Deprecated API', data);
      expect(warnSpy).toHaveBeenCalledWith('Deprecated API', data);
    });

    it('should log warn with multiple params', () => {
      logger.warn('Multiple warnings', 'param1', { key: 'value' });
      expect(warnSpy).toHaveBeenCalledWith('Multiple warnings', 'param1', {
        key: 'value',
      });
    });

    it('should handle warn with Error object', () => {
      const error = new Error('Warning error');
      logger.warn('Potential issue', error);
      expect(warnSpy).toHaveBeenCalledWith('Potential issue', error);
    });
  });

  describe('error()', () => {
    it('should log error message with string', () => {
      logger.error('Error message');
      expect(errorSpy).toHaveBeenCalledWith('Error message');
    });

    it('should log error with Error object', () => {
      const error = new Error('Fatal error');
      logger.error('Critical failure', error);
      expect(errorSpy).toHaveBeenCalledWith('Critical failure', error);
    });

    it('should log error with stack trace', () => {
      const error = new Error('Error with stack');
      logger.error('Stack trace', error.stack);
      expect(errorSpy).toHaveBeenCalledWith('Stack trace', error.stack);
    });

    it('should log error with custom error object', () => {
      const customError = {
        code: 'ERR_DATABASE',
        message: 'Connection failed',
        details: {
          host: 'localhost',
          port: 5432,
        },
      };
      logger.error('Database error', customError);
      expect(errorSpy).toHaveBeenCalledWith('Database error', customError);
    });

    it('should handle AggregateError', () => {
      const errors = [new Error('Error 1'), new Error('Error 2')];
      const aggregateError = new AggregateError(errors, 'Multiple errors');
      logger.error('Aggregate error', aggregateError);
      expect(errorSpy).toHaveBeenCalledWith('Aggregate error', aggregateError);
    });
  });

  describe('debug()', () => {
    it('should log debug message with string', () => {
      logger.debug('Debug message');
      expect(debugSpy).toHaveBeenCalledWith('Debug message');
    });

    it('should log debug with detailed metadata', () => {
      const debug = {
        query: 'SELECT * FROM users WHERE id = $1',
        params: [123],
        duration: 45,
        rows: 100,
      };
      logger.debug('Query executed', debug);
      expect(debugSpy).toHaveBeenCalledWith('Query executed', debug);
    });

    it('should log debug with performance metrics', () => {
      const perf = {
        cpu: process.cpuUsage(),
        memory: process.memoryUsage(),
        uptime: process.uptime(),
      };
      logger.debug('System metrics', perf);
      expect(debugSpy).toHaveBeenCalledWith('System metrics', perf);
    });
  });

  describe('Complex Data Types', () => {
    it('should handle Date objects', () => {
      const date = new Date('2025-11-28T12:00:00Z');
      logger.info('Date test', date);
      expect(infoSpy).toHaveBeenCalledWith('Date test', date);
    });

    it('should handle RegExp', () => {
      const regex = /test/gi;
      logger.info('RegExp test', regex);
      expect(infoSpy).toHaveBeenCalledWith('RegExp test', regex);
    });

    it('should handle Map', () => {
      const map = new Map([
        ['key1', 'value1'],
        ['key2', 'value2'],
        ['key3', { nested: 'object' }],
      ]);
      logger.info('Map test', map);
      expect(infoSpy).toHaveBeenCalledWith('Map test', map);
    });

    it('should handle Set', () => {
      const set = new Set([1, 2, 3, 'string', { obj: 'value' }]);
      logger.info('Set test', set);
      expect(infoSpy).toHaveBeenCalledWith('Set test', set);
    });

    it('should handle WeakMap', () => {
      const obj1 = {};
      const obj2 = {};
      const weakMap = new WeakMap([
        [obj1, 'value1'],
        [obj2, 'value2'],
      ]);
      logger.info('WeakMap test', weakMap);
      expect(infoSpy).toHaveBeenCalled();
    });

    it('should handle WeakSet', () => {
      const obj1 = {};
      const obj2 = {};
      const weakSet = new WeakSet([obj1, obj2]);
      logger.info('WeakSet test', weakSet);
      expect(infoSpy).toHaveBeenCalled();
    });

    it('should handle Buffer/Uint8Array', () => {
      const buffer = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
      logger.info('Buffer test', buffer);
      expect(infoSpy).toHaveBeenCalledWith('Buffer test', buffer);
    });

    it('should handle Symbol', () => {
      const sym = Symbol('unique');
      logger.info('Symbol test', sym);
      expect(infoSpy).toHaveBeenCalledWith('Symbol test', sym);
    });

    it('should handle circular references', () => {
      const circular: any = { name: 'test', child: {} };
      circular.child.parent = circular;
      logger.info('Circular reference', circular);
      expect(infoSpy).toHaveBeenCalled();
    });

    it('should handle very large arrays', () => {
      const largeArray = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        value: `item${i}`,
      }));
      logger.info('Large array', largeArray);
      expect(infoSpy).toHaveBeenCalledWith('Large array', largeArray);
    });

    it('should handle deeply nested structures', () => {
      const deep = {
        level1: {
          level2: {
            level3: {
              level4: {
                level5: {
                  level6: {
                    level7: {
                      level8: {
                        level9: {
                          level10: { value: 'very deep' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };
      logger.info('Deep nesting', deep);
      expect(infoSpy).toHaveBeenCalledWith('Deep nesting', deep);
    });

    it('should handle mixed types in array', () => {
      const mixed = [
        1,
        'string',
        true,
        null,
        undefined,
        { obj: 'value' },
        [1, 2, 3],
        new Date(),
        /regex/,
        Symbol('sym'),
      ];
      logger.info('Mixed array', mixed);
      expect(infoSpy).toHaveBeenCalledWith('Mixed array', mixed);
    });

    it('should handle Promises', () => {
      const promise = Promise.resolve('value');
      logger.info('Promise', promise);
      expect(infoSpy).toHaveBeenCalledWith('Promise', promise);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string message', () => {
      logger.info('');
      expect(infoSpy).toHaveBeenCalledWith('');
    });

    it('should handle very long strings', () => {
      const longString = 'a'.repeat(100000);
      logger.info(longString);
      expect(infoSpy).toHaveBeenCalledWith(longString);
    });

    it('should handle special characters and unicode', () => {
      logger.info('Unicode: 你好世界 🌍 🚀 ❤️ \n\t\r');
      expect(infoSpy).toHaveBeenCalled();
    });

    it('should handle empty object', () => {
      logger.info('Empty obj', {});
      expect(infoSpy).toHaveBeenCalledWith('Empty obj', {});
    });

    it('should handle empty array', () => {
      logger.info('Empty arr', []);
      expect(infoSpy).toHaveBeenCalledWith('Empty arr', []);
    });

    it('should handle NaN', () => {
      logger.info('NaN value', NaN);
      expect(infoSpy).toHaveBeenCalledWith('NaN value', NaN);
    });

    it('should handle Infinity', () => {
      logger.info('Infinity', Infinity);
      expect(infoSpy).toHaveBeenCalledWith('Infinity', Infinity);
    });

    it('should handle -Infinity', () => {
      logger.info('Negative Infinity', -Infinity);
      expect(infoSpy).toHaveBeenCalledWith('Negative Infinity', -Infinity);
    });

    it('should handle negative zero', () => {
      logger.info('Negative zero', -0);
      expect(infoSpy).toHaveBeenCalledWith('Negative zero', -0);
    });

    it('should handle function as metadata', () => {
      const fn = () => 'test function';
      logger.info('Function', fn);
      expect(infoSpy).toHaveBeenCalledWith('Function', fn);
    });

    it('should handle arrow function', () => {
      const arrow = (x: number) => x * 2;
      logger.info('Arrow function', arrow);
      expect(infoSpy).toHaveBeenCalledWith('Arrow function', arrow);
    });

    it('should handle async function', () => {
      const asyncFn = async () => 'async result';
      logger.info('Async function', asyncFn);
      expect(infoSpy).toHaveBeenCalledWith('Async function', asyncFn);
    });

    it('should handle generator function', () => {
      function* generator() {
        yield 1;
        yield 2;
      }
      logger.info('Generator', generator);
      expect(infoSpy).toHaveBeenCalledWith('Generator', generator);
    });

    it('should handle class instance', () => {
      class TestClass {
        constructor(
          public value: number,
          public name: string
        ) {}
      }
      const instance = new TestClass(42, 'test');
      logger.info('Class instance', instance);
      expect(infoSpy).toHaveBeenCalledWith('Class instance', instance);
    });

    it('should handle class with methods', () => {
      class ClassWithMethods {
        getValue() {
          return 42;
        }
      }
      const instance = new ClassWithMethods();
      logger.info('Class with methods', instance);
      expect(infoSpy).toHaveBeenCalled();
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
      expect(elapsed).toBeLessThan(150); // Winston with mocks should be < 150ms
    });

    it('should handle large metadata objects efficiently', () => {
      const largeObj = Object.fromEntries(
        Array.from({ length: 1000 }, (_, i) => [`key${i}`, `value${i}`])
      );

      const start = performance.now();
      logger.info('Large metadata', largeObj);
      const elapsed = performance.now() - start;

      expect(infoSpy).toHaveBeenCalledWith('Large metadata', largeObj);
      expect(elapsed).toBeLessThan(10); // Single large object log should be < 10ms
    });

    it('should handle concurrent logging efficiently', async () => {
      const start = performance.now();

      const promises = Array.from({ length: 100 }, (_, i) =>
        Promise.resolve(logger.info(`Concurrent ${i}`, { index: i }))
      );
      await Promise.all(promises);

      const elapsed = performance.now() - start;

      expect(infoSpy).toHaveBeenCalledTimes(100);
      expect(elapsed).toBeLessThan(50); // 100 concurrent logs should be < 50ms
    });
  });

  describe('Error Scenarios', () => {
    it('should throw error when winston throws error', () => {
      const errorLogger = new WinstonLogger();
      (errorLogger as any).logger = {
        info: jest.fn(() => {
          throw new Error('Winston error');
        }),
      };

      expect(() => errorLogger.info('Test')).toThrow('Winston error');
    });
  });
});
