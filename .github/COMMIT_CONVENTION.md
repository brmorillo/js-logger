# Conventional Commits Guide

Este guia ajuda você a escrever commits que seguem o padrão [Conventional Commits](https://www.conventionalcommits.org/).

## Por que usar Conventional Commits?

- ✅ **Versionamento Automático**: Gera versões semânticas automaticamente
- ✅ **Changelog Automático**: CHANGELOG.md gerado automaticamente
- ✅ **Histórico Organizado**: Commits organizados por tipo
- ✅ **Release Automático**: Deploy automático baseado em commits

## Estrutura Básica

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Tipos de Commit

### 🚀 `feat` - Nova Funcionalidade
Adiciona uma nova feature ao código (correlaciona com MINOR em Semantic Versioning).

```bash
feat: add verbose logging method
feat(pino): add pretty print support
feat(api): add new endpoint for logs
```

### 🐛 `fix` - Correção de Bug
Corrige um bug no código (correlaciona com PATCH em Semantic Versioning).

```bash
fix: resolve memory leak in console logger
fix(winston): correct timestamp format
fix: handle null values in metadata
```

### 📝 `docs` - Documentação
Apenas mudanças na documentação.

```bash
docs: update README with examples
docs: add JSDoc comments to logger interface
docs(api): update API reference
```

### 🎨 `style` - Formatação
Mudanças que não afetam o significado do código (espaços, formatação, ponto e vírgula, etc).

```bash
style: format code with prettier
style: fix indentation
style: remove trailing spaces
```

### ♻️ `refactor` - Refatoração
Mudança no código que não corrige um bug nem adiciona uma feature.

```bash
refactor: simplify logger initialization
refactor(service): improve error handling
refactor: extract logger factory to separate file
```

### ⚡ `perf` - Performance
Mudança que melhora a performance.

```bash
perf: optimize log formatting
perf(pino): reduce memory allocation
perf: cache logger instances
```

### ✅ `test` - Testes
Adiciona ou corrige testes.

```bash
test: add tests for console logger
test(integration): add API tests
test: increase coverage to 90%
```

### 🔧 `chore` - Manutenção
Mudanças no processo de build ou ferramentas auxiliares.

```bash
chore: update dependencies
chore(deps): bump typescript to 5.6
chore: configure eslint
```

### 🔨 `build` - Build System
Mudanças no sistema de build ou dependências externas.

```bash
build: update tsup config
build: add sourcemaps to build
build(npm): configure package.json
```

### 🚦 `ci` - CI/CD
Mudanças nos arquivos e scripts de CI/CD.

```bash
ci: add GitHub Actions workflow
ci: configure semantic-release
ci: add codecov integration
```

### ⏪ `revert` - Reverter
Reverte um commit anterior.

```bash
revert: revert "feat: add verbose method"
```

## Breaking Changes 💥

Para indicar mudanças que quebram compatibilidade:

### Opção 1: Usar `!` após o tipo

```bash
feat!: change logger initialization API
refactor!: remove deprecated methods
```

### Opção 2: Usar footer `BREAKING CHANGE`

```bash
feat: change logger API

BREAKING CHANGE: LogService.getInstance() now requires options parameter
```

## Scope (Opcional)

O scope fornece contexto adicional sobre onde a mudança foi feita:

```bash
feat(pino): add pretty print
fix(winston): correct format
docs(readme): add examples
test(unit): add logger tests
```

Scopes comuns:
- `pino` - Relacionado ao Pino logger
- `winston` - Relacionado ao Winston logger
- `console` - Relacionado ao Console logger
- `api` - Relacionado à API pública
- `core` - Relacionado ao core da lib
- `deps` - Relacionado a dependências

## Body (Opcional)

Use o body para explicar **o que** e **por que**, não **como**.

```bash
feat: add verbose logging method

This method provides more detailed logging for debugging purposes.
It's an alias for the debug method but with explicit naming.
```

## Footer (Opcional)

Use o footer para:
- Referenciar issues
- Indicar breaking changes
- Mencionar revisores

```bash
feat: add new logger method

Closes #123
Reviewed-by: @brmorillo
```

## Exemplos Completos

### Feature Simples

```bash
feat: add log rotation support
```

### Feature com Scope e Body

```bash
feat(pino): add custom serializers

Allow users to configure custom serializers for specific fields.
This is useful for sanitizing sensitive data in logs.

Closes #45
```

### Bug Fix com Detalhes

```bash
fix(winston): resolve timestamp timezone issue

The timestamp was being displayed in UTC instead of local time.
Now it respects the system timezone configuration.

Fixes #78
```

### Breaking Change

```bash
feat!: change logger initialization

BREAKING CHANGE: The LogService.getInstance() method now requires
an options object. The previous behavior of accepting undefined
has been removed.

Migration:
- Before: LogService.getInstance()
- After: LogService.getInstance({ type: 'pino' })

Closes #99
```

### Refactor

```bash
refactor(core): extract logger factory

Moved logger creation logic to a separate factory class
for better maintainability and testability.
```

### Documentation

```bash
docs: add integration examples

Added examples for:
- NestJS integration
- Express middleware
- Fastify plugin

Closes #120
```

## Versionamento Automático

Com base nos commits, a versão é incrementada automaticamente:

| Commit Type | Exemplo | Versão |
|-------------|---------|---------|
| `fix:` | `fix: resolve bug` | 1.0.0 → 1.0.**1** (PATCH) |
| `feat:` | `feat: add feature` | 1.0.0 → 1.**1**.0 (MINOR) |
| `feat!:` ou `BREAKING CHANGE:` | `feat!: breaking change` | 1.0.0 → **2**.0.0 (MAJOR) |

## Dicas

### ✅ Boas Práticas

```bash
# Claro e conciso
feat: add retry mechanism

# Específico com scope
fix(pino): handle null metadata

# Breaking change bem documentado
feat!: change API signature

BREAKING CHANGE: Method signature changed from
foo(a, b) to foo({ a, b })
```

### ❌ Evite

```bash
# Muito genérico
feat: updates

# Sem tipo
add new feature

# Tipo errado
feat: fix bug  # Deveria ser 'fix:'

# Sem descrição
feat:

# Caps lock
FEAT: ADD NEW FEATURE
```

## Ferramentas

### Commitlint

Instalado no projeto para validar commits:

```bash
# Testa seu commit
echo "feat: add new feature" | bunx commitlint
```

### Commitizen (Opcional)

Para ajudar a criar commits:

```bash
# Instalar globalmente
npm install -g commitizen

# Usar
git cz
```

## Referências

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Angular Commit Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)

## Resumo Rápido

```bash
# Feature
feat: add new feature

# Bug fix
fix: resolve issue

# Breaking change
feat!: breaking change
BREAKING CHANGE: details here

# Com scope
feat(scope): add feature
fix(scope): resolve issue

# Com issue
feat: add feature

Closes #123
```

Pronto! Agora você sabe escrever commits que disparam releases automáticas! 🚀
