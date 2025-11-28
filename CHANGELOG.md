# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1](https://github.com/brmorillo/js-logger/compare/v1.0.0...v1.0.1) (2025-11-28)

### Bug Fixes

* remove test from prepublishOnly script ([6f57374](https://github.com/brmorillo/js-logger/commit/6f5737464891185eb2c7bbda8401097971417bf7))

## 1.0.0 (2025-11-28)

### Features

* initial release with complete logging functionality ([dde1a76](https://github.com/brmorillo/js-logger/commit/dde1a7692e08c4347227f49127fe8f7cf669568c))

### Bug Fixes

* resolve ESLint configuration and errors ([31330d5](https://github.com/brmorillo/js-logger/commit/31330d55a61949c47a3ee76e966a56070d90b1b5))
* specify eslint config file explicitly in lint script ([7069bbe](https://github.com/brmorillo/js-logger/commit/7069bbea197e660ce6d4a823a5908060b9400eb6))
* update repository URLs to match GitHub repo name (js-logger) ([773dad2](https://github.com/brmorillo/js-logger/commit/773dad2291a951dae253d31da45177b26bce336e))
* use PRD environment instead of production ([1218a76](https://github.com/brmorillo/js-logger/commit/1218a76f3c00c017983c9686c4bb2ab42f4ccdc4))

### Code Refactoring

* replace any with unknown for better type safety ([3bf53ef](https://github.com/brmorillo/js-logger/commit/3bf53ef91871ff608e35bbb632b3a76cce75c452))

## [1.0.0] - 2025-11-28

### Added

- Initial release of @brmorillo/logger
- Support for multiple logger implementations (Pino, Winston, Console)
- Singleton pattern for global logger access
- Runtime reconfiguration support
- Pretty printing option for formatted output
- TypeScript definitions and full type safety
- Zero required dependencies (peer dependencies are optional)
- Comprehensive test suite
- Full documentation and examples
