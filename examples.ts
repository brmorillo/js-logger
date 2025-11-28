import { LogService } from './src';

// Example 1: Basic usage with Console Logger
console.log('\n=== Example 1: Console Logger ===');
const consoleLogger = LogService.getInstance({
   type: 'console',
   level: 'debug',
});

consoleLogger.info('Application started');
consoleLogger.debug('Debug information', { env: 'development' });
consoleLogger.warn('This is a warning');
consoleLogger.error('An error occurred', { code: 'ERR_001' });

// Example 2: Pino Logger with Pretty Print
console.log('\n=== Example 2: Pino Logger (Pretty Print) ===');
const pinoLogger = LogService.getInstance({
   type: 'pino',
   level: 'info',
   prettyPrint: true,
});

pinoLogger.info('User logged in', { userId: '12345', ip: '192.168.1.1' });
pinoLogger.warn('High memory usage', { usage: '85%', threshold: '80%' });
pinoLogger.error('Database connection failed', {
   database: 'postgres',
   error: 'Connection timeout',
});

// Example 3: Runtime Reconfiguration
console.log('\n=== Example 3: Runtime Reconfiguration ===');
const logger = LogService.getInstance({
   type: 'console',
   level: 'error',
});

logger.info('This will NOT be logged (level is error)');
logger.error('This WILL be logged');

// Reconfigure to show all logs
logger.configure({
   type: 'console',
   level: 'debug',
});

logger.info('Now this WILL be logged (reconfigured to debug level)');
logger.debug('Debug messages are now visible');

// Example 4: Logging with Complex Metadata
console.log('\n=== Example 4: Complex Metadata ===');
const metadataLogger = LogService.getInstance({
   type: 'pino',
   level: 'info',
   prettyPrint: true,
});

metadataLogger.info('User action', {
   user: {
      id: 'usr_123',
      name: 'John Doe',
      email: 'john@example.com',
   },
   action: 'purchase',
   product: {
      id: 'prod_456',
      name: 'Premium Plan',
      price: 99.99,
   },
   timestamp: new Date(),
});

// Example 5: Error Logging with Stack Traces
console.log('\n=== Example 5: Error Logging ===');
const errorLogger = LogService.getInstance({
   type: 'console',
   level: 'error',
});

try {
   throw new Error('Something went wrong!');
} catch (error: any) {
   errorLogger.error('Caught an error', {
      message: error.message,
      stack: error.stack,
      type: error.constructor.name,
   });
}

console.log('\n=== Examples completed ===\n');
