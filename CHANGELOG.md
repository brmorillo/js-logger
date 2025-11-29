# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0](https://github.com/brmorillo/js-logger/compare/v1.0.2...v2.0.0) (2025-11-29)

### ⚠ BREAKING CHANGES

* Pino is now a required dependency (adds ~500KB to bundle size)

### Features

* add comprehensive unit tests and husky pre-push hooks ([9941aac](https://github.com/brmorillo/js-logger/commit/9941aacebabc2a25e1d83525bb8786fdb96ba67f))
* include Pino as default dependency ([5465705](https://github.com/brmorillo/js-logger/commit/54657057b23e812061cea9b162580cc136d77b54))

### Bug Fixes

* exclude test files from eslint to fix pre-push hook ([974542b](https://github.com/brmorillo/js-logger/commit/974542bf90a0fa6f4ab58b9b9b4e69f09fffc204))

## [1.0.2](https://github.com/brmorillo/js-logger/compare/v1.0.1...v1.0.2) (2025-11-28)

### Bug Fixes

* configure npm to publish as public scoped package ([c5bf6e2](https://github.com/brmorillo/js-logger/commit/c5bf6e27e4c41f6eadabc7fc1a126eedbb153989))

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
