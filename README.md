# @brmorillo/logger

A flexible and extensible logging library for TypeScript/JavaScript applications, supporting multiple logger implementations (Pino, Winston, Console) with a simple, unified API.

[![npm version](https://img.shields.io/npm/v/@brmorillo/logger.svg)](https://www.npmjs.com/package/@brmorillo/logger)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)

## 🚀 Quick Start

```bash
# Install (includes Pino logger by default)
bun add @brmorillo/logger

# Optional: Install Winston if needed
bun add winston
```

```typescript
import { LogService } from '@brmorillo/logger';

const logger = LogService.getInstance({
  type: 'pino',
  level: 'info',
  prettyPrint: true,
});

logger.info('Hello, world!', { user: 'Bruno' });
```

## Features

- 🚀 **Pino Logger Included**: High-performance Pino logger comes pre-installed
- 🎯 **Simple API**: Unified interface for all loggers
- 🔧 **Flexible Configuration**: Easy to configure and customize
- 📦 **Multiple Logger Support**: Pino (default), Winston (optional), and Console
- 🎨 **Pretty Printing**: Optional formatted output for development
- 🏭 **Singleton Pattern**: Global logger instance management
- 🔄 **Runtime Reconfiguration**: Change logger settings on the fly
- 🌐 **Universal**: Works with Node.js, Bun, and browsers
- ✅ **100% TypeScript**: Full type safety with comprehensive types
- 🔌 **Framework Ready**: Easy integration with NestJS, Express, Fastify, etc.
- 🎭 **Auto Fallback**: Automatically falls back to console if needed

## Installation

```bash
# Using bun (recommended)
bun add @brmorillo/logger

# Using npm
npm install @brmorillo/logger

# Using yarn
yarn add @brmorillo/logger

# Using pnpm
pnpm add @brmorillo/logger
```

### Optional Dependencies

Install Winston only if you need its advanced features:

```bash
# For Winston (feature-rich with multiple transports)
bun add winston
```

> **Note**: Pino comes pre-installed and is the recommended logger for production use. Winston and Console loggers are also available if needed.

## Quick Start

```typescript
import { LogService } from '@brmorillo/logger';

// Get logger instance with default configuration (Pino)
const logger = LogService.getInstance();

// Log messages
logger.info('Application started');
logger.warn('This is a warning');
logger.error('An error occurred', { error: new Error('Test') });
logger.debug('Debug information', { userId: 123 });
```

## Configuration

### Basic Configuration

```typescript
import { LogService } from '@brmorillo/logger';

const logger = LogService.getInstance({
  type: 'pino',        // 'pino' | 'winston' | 'console'
  level: 'info',       // 'error' | 'warn' | 'info' | 'debug'
  prettyPrint: true,   // Enable formatted output
});
```

### Using Different Loggers

#### Console Logger (No dependencies)

```typescript
const logger = LogService.getInstance({
  type: 'console',
  level: 'debug',
});
```

#### Pino Logger (High performance)

```typescript
const logger = LogService.getInstance({
  type: 'pino',
  level: 'info',
  prettyPrint: process.env.NODE_ENV !== 'production',
});
```

#### Winston Logger (Feature-rich)

```typescript
const logger = LogService.getInstance({
  type: 'winston',
  level: 'info',
  prettyPrint: true,
});
```

### Runtime Reconfiguration

```typescript
const logger = LogService.getInstance({ type: 'console' });

// Later, switch to Pino
logger.configure({
  type: 'pino',
  level: 'debug',
  prettyPrint: true,
});
```

## Usage Examples

### Basic Logging

```typescript
import { LogService } from '@brmorillo/logger';

const logger = LogService.getInstance();

// Simple messages
logger.info('User logged in');
logger.warn('High memory usage detected');
logger.error('Failed to connect to database');
logger.debug('Request details', { method: 'GET', path: '/api/users' });
```

### Logging with Metadata

```typescript
logger.info('User action', { 
  userId: '12345', 
  action: 'purchase', 
  amount: 99.99 
});

logger.error('Payment failed', { 
  orderId: 'ORD-001', 
  error: error.message,
  stack: error.stack 
});
```

### Express.js Integration

```typescript
import express from 'express';
import { LogService } from '@brmorillo/logger';

const app = express();
const logger = LogService.getInstance({
  type: 'pino',
  level: 'info',
});

// Logging middleware
app.use((req, res, next) => {
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    ip: req.ip,
  });
  next();
});

app.get('/', (req, res) => {
  logger.debug('Home route accessed');
  res.send('Hello World!');
});
```

### NestJS Integration

```typescript
import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { LogService } from '@brmorillo/logger';

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger = LogService.getInstance({
    type: 'pino',
    level: 'info',
  });

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }
}
```

### Fastify Integration

```typescript
import Fastify from 'fastify';
import { LogService } from '@brmorillo/logger';

const logger = LogService.getInstance({
  type: 'pino',
  level: 'info',
});

const fastify = Fastify();

fastify.addHook('onRequest', (request, reply, done) => {
  logger.info('Request received', {
    method: request.method,
    url: request.url,
  });
  done();
});

fastify.get('/', async (request, reply) => {
  logger.debug('Processing home route');
  return { hello: 'world' };
});
```

## API Reference

### LogService

#### `getInstance(options?: LoggerOptions): LogService`

Gets the singleton instance of LogService.

```typescript
const logger = LogService.getInstance({
  type: 'pino',
  level: 'info',
  prettyPrint: true,
});
```

#### `configure(options: LoggerOptions): void`

Reconfigures the logger with new options.

```typescript
logger.configure({ type: 'winston', level: 'debug' });
```

#### `info(message: string, ...meta: any[]): void`

Logs an informational message.

#### `warn(message: string, ...meta: any[]): void`

Logs a warning message.

#### `error(message: string, ...meta: any[]): void`

Logs an error message.

#### `debug(message: string, ...meta: any[]): void`

Logs a debug message.

### LoggerOptions

```typescript
interface LoggerOptions {
  type?: 'pino' | 'winston' | 'console';  // Default: 'pino'
  level?: 'error' | 'warn' | 'info' | 'debug';  // Default: 'info'
  prettyPrint?: boolean;  // Default: false
}
```

## Environment-Based Configuration

```typescript
import { LogService } from '@brmorillo/logger';

const logger = LogService.getInstance({
  type: process.env.LOGGER_TYPE as any || 'pino',
  level: process.env.LOG_LEVEL || 'info',
  prettyPrint: process.env.NODE_ENV !== 'production',
});
```

## Performance Considerations

- **Pino**: Fastest logger, recommended for production. Uses JSON format by default.
- **Winston**: Feature-rich, slightly slower than Pino. Good for complex logging needs.
- **Console**: Simple and lightweight, best for development or simple applications.

## Compatibility

- ✅ Node.js >= 18
- ✅ Bun >= 1.0
- ✅ TypeScript >= 5.0
- ✅ ES Modules and CommonJS

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © Bruno Morillo

## Related Packages

- [@brmorillo/utils](https://github.com/brmorillo/utils) - Utility library that includes this logger and more

## Support

For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/brmorillo/logger).
