# Contributing to @brmorillo/logger

Thank you for considering contributing to @brmorillo/logger! This document provides guidelines and instructions for contributing.

## Development Setup

1. Clone the repository:

```bash
git clone https://github.com/brmorillo/logger.git
cd logger
```

2. Install dependencies:

```bash
bun install
```

3. Build the project:

```bash
bun run build
```

4. Run tests:

```bash
bun test
```

## Project Structure

```
src/
├── interfaces/       # TypeScript interfaces
│   └── logger.interface.ts
├── loggers/         # Logger implementations
│   ├── console-logger.ts
│   ├── pino-logger.ts
│   └── winston-logger.ts
├── services/        # Services
│   └── log.service.ts
└── index.ts         # Main entry point
```

## Coding Standards

- Use TypeScript for all source code
- Follow the existing code style
- Write JSDoc comments for public APIs
- Ensure all tests pass before submitting
- Keep dependencies minimal

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests: `bun test`
5. Run linting: `bun run lint`
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## Commit Message Guidelines

Use conventional commits:

- `feat: add new feature`
- `fix: bug fix`
- `docs: documentation changes`
- `test: test updates`
- `chore: maintenance tasks`

## Adding New Loggers

To add a new logger implementation:

1. Create a new file in `src/loggers/`
2. Implement the `ILogger` interface
3. Add the logger type to `LoggerType` in `logger.interface.ts`
4. Update the factory in `log.service.ts`
5. Add tests
6. Update documentation

## Questions?

Feel free to open an issue for any questions or concerns.
