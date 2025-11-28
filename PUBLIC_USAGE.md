# 🚀 Public Usage Guide - @brmorillo/logger

## For Library Users

This guide shows how to use `@brmorillo/logger` in your projects.

---

## 📦 Installation

```bash
# Using bun
bun add @brmorillo/logger

# Using npm
npm install @brmorillo/logger

# Using yarn
yarn add @brmorillo/logger

# Using pnpm
pnpm add @brmorillo/logger
```

### Optional: Install a logger implementation

```bash
# For Pino (recommended for production)
bun add pino pino-pretty

# For Winston (if you need advanced features)
bun add winston

# Console logger works without any additional dependencies
```

---

## ✨ Quick Start

### Basic Usage

```typescript
import { LogService } from '@brmorillo/logger';

// Initialize the logger (do this once at app startup)
const logger = LogService.getInstance({
  type: 'pino',  // 'pino' | 'winston' | 'console'
  level: 'info',  // 'error' | 'warn' | 'info' | 'debug'
  prettyPrint: true,  // true for dev, false for production
});

// Use anywhere in your code
logger.info('Application started');
logger.warn('This is a warning', { userId: '123' });
logger.error('Error occurred', { error: err.message });
logger.debug('Debug info', { data: someData });
```

---

## 🎯 Framework Integration

### NestJS

```typescript
// src/infrastructure/logger/logger.service.ts
import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { LogService } from '@brmorillo/logger';

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: LogService;

  constructor() {
    this.logger = LogService.getInstance({
      type: 'pino',
      level: process.env.LOG_LEVEL || 'info',
      prettyPrint: process.env.NODE_ENV !== 'production',
    });
  }

  log(message: string, ...params: unknown[]): void {
    this.logger.log(message, ...params);
  }

  error(message: string, ...params: unknown[]): void {
    this.logger.error(message, ...params);
  }

  warn(message: string, ...params: unknown[]): void {
    this.logger.warn(message, ...params);
  }

  debug(message: string, ...params: unknown[]): void {
    this.logger.debug(message, ...params);
  }

  verbose(message: string, ...params: unknown[]): void {
    this.logger.verbose(message, ...params);
  }

  fatal(message: string, ...params: unknown[]): void {
    this.logger.fatal(message, ...params);
  }
}

// app.module.ts
import { Module } from '@nestjs/common';
import { LoggerService } from './infrastructure/logger/logger.service';

@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class AppModule {}

// main.ts
const app = await NestFactory.create(AppModule, {
  logger: new LoggerService(),
});
```

### Express

```typescript
import express from 'express';
import { LogService } from '@brmorillo/logger';

const app = express();
const logger = LogService.getInstance({
  type: 'pino',
  level: 'info',
});

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.info('Request', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${Date.now() - start}ms`,
    });
  });
  next();
});

app.listen(3000, () => {
  logger.info('Server started', { port: 3000 });
});
```

### Fastify

```typescript
import Fastify from 'fastify';
import { LogService } from '@brmorillo/logger';

const logger = LogService.getInstance({ type: 'pino' });
const fastify = Fastify();

fastify.addHook('onRequest', (request, reply, done) => {
  logger.info('Request', { method: request.method, url: request.url });
  done();
});

fastify.listen({ port: 3000 });
```

---

## 🔧 Configuration

### Environment-Based

```typescript
import { LogService } from '@brmorillo/logger';

const logger = LogService.getInstance({
  type: (process.env.LOGGER_TYPE as any) || 'pino',
  level: process.env.LOG_LEVEL || 'info',
  prettyPrint: process.env.NODE_ENV !== 'production',
});
```

### Environment Variables

```bash
# .env
LOGGER_TYPE=pino
LOG_LEVEL=info
NODE_ENV=production
```

### Development vs Production

```typescript
// Development
const logger = LogService.getInstance({
  type: 'pino',
  level: 'debug',
  prettyPrint: true,  // Readable logs
});

// Production
const logger = LogService.getInstance({
  type: 'pino',
  level: 'info',
  prettyPrint: false,  // JSON logs for aggregators
});
```

---

## 📝 Best Practices

### 1. Structured Logging

✅ **Good**:

```typescript
logger.info('User action', {
  userId: user.id,
  action: 'login',
  ip: req.ip,
  timestamp: new Date().toISOString(),
});
```

❌ **Avoid**:

```typescript
logger.info(`User ${user.id} logged in from ${req.ip}`);
```

### 2. Error Handling

```typescript
try {
  await processPayment();
} catch (error) {
  logger.error('Payment failed', {
    error: error.message,
    stack: error.stack,
    orderId: order.id,
    userId: user.id,
  });
}
```

### 3. Request Context

```typescript
logger.info('Processing request', {
  correlationId: req.headers['x-correlation-id'],
  userId: req.user?.id,
  endpoint: req.path,
  method: req.method,
});
```

---

## 🔄 Migrating from Other Loggers

### From console.log

```typescript
// Before
console.log('User logged in', user.id);
console.error('Error:', error);

// After
import { LogService } from '@brmorillo/logger';
const logger = LogService.getInstance({ type: 'console' });

logger.info('User logged in', { userId: user.id });
logger.error('Error occurred', { error: error.message });
```

### From Winston

```typescript
// Before
import winston from 'winston';
const logger = winston.createLogger({ ... });
logger.info('Message');

// After
import { LogService } from '@brmorillo/logger';
const logger = LogService.getInstance({ type: 'winston' });
logger.info('Message');
```

### From Pino

```typescript
// Before
import pino from 'pino';
const logger = pino();
logger.info('Message');

// After
import { LogService } from '@brmorillo/logger';
const logger = LogService.getInstance({ type: 'pino' });
logger.info('Message');
```

---

## 🎨 Advanced Usage

### Runtime Reconfiguration

```typescript
const logger = LogService.getInstance({ type: 'console' });

// Later, switch to Pino
logger.configure({
  type: 'pino',
  level: 'debug',
  prettyPrint: false,
});
```

### Global Export

```typescript
// logger.ts
import { LogService } from '@brmorillo/logger';

export const logger = LogService.getInstance({
  type: 'pino',
  level: process.env.LOG_LEVEL || 'info',
  prettyPrint: process.env.NODE_ENV !== 'production',
});

// Other files
import { logger } from './logger';
logger.info('Using global logger');
```

---

## 🐛 Troubleshooting

### Pino not found

If you see this warning:

```
[PinoLogger] Pino not found. Falling back to console logger.
```

**Solution**: Install Pino

```bash
bun add pino pino-pretty
```

### Winston not found

**Solution**: Install Winston

```bash
bun add winston
```

### Type errors in TypeScript

Ensure you have the correct types installed:

```bash
bun add -d @types/node
```

---

## 📚 API Reference

### LogService Methods

- `log(message, ...meta)` - General log (alias for info)
- `info(message, ...meta)` - Informational message
- `warn(message, ...meta)` - Warning message
- `error(message, ...meta)` - Error message
- `debug(message, ...meta)` - Debug message
- `verbose(message, ...meta)` - Verbose message (alias for debug)
- `fatal(message, ...meta)` - Fatal error (alias for error)
- `configure(options)` - Reconfigure logger at runtime

### LoggerOptions

```typescript
interface LoggerOptions {
  type?: 'pino' | 'winston' | 'console';  // Default: 'pino'
  level?: 'error' | 'warn' | 'info' | 'debug';  // Default: 'info'
  prettyPrint?: boolean;  // Default: false
}
```

---

## 🤝 Support

- 📖 [Full Documentation](./README.md)
- 🐛 [Report Issues](https://github.com/brmorillo/logger/issues)
- 💬 [Discussions](https://github.com/brmorillo/logger/discussions)

---

## ✨ That's it

You're now ready to use `@brmorillo/logger` in your projects!

For more examples, check:

- `examples.ts` - Basic usage examples
- `examples/README.md` - Framework integration examples
- `README.md` - Complete documentation
