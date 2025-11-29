# Git Hooks

This project uses [Husky](https://typicode.github.io/husky/) to manage Git hooks.

## Pre-Push Hook

Before every push, the following checks are automatically executed:

1. **Lint Check & Fix** (`bun run lint:fix`)
   - Automatically fixes linting issues
   - Fails if unfixable errors exist

2. **Tests** (`bun test`)
   - Runs all unit tests
   - Ensures 100% test pass rate

3. **Type Check** (`bun run type-check`)
   - Validates TypeScript types
   - Ensures type safety

4. **Build** (`bun run build`)
   - Compiles the project
   - Verifies production bundle

If any check fails, the push is blocked until issues are resolved.

## Manual Execution

To manually run the pre-push checks:

```bash
.husky/pre-push
```

## Bypass (Not Recommended)

In emergency situations, you can bypass hooks with:

```bash
git push --no-verify
```

**Note**: Only use `--no-verify` when absolutely necessary, as it skips quality checks.
