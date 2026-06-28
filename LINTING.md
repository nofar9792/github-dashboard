# Code Quality & Linting

This project uses **ESLint** for code quality checks and **Prettier** for consistent code formatting.

## Quick Start

### VS Code Setup (Recommended)

1. Install extensions:
   - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
   - [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

2. Settings are automatically configured in `.vscode/settings.json`

3. **Automatic on save:**
   - ESLint auto-fixes issues when you save
   - Prettier formats your code when you save

## Manual Commands

### Linting

```bash
# Check for issues
npm run lint

# Fix issues automatically
npm run lint:fix
```

### Formatting

```bash
# Format all files
npm run format

# Check if files are formatted correctly
npm run format:check
```

### Full CI Check

```bash
# Run linting, formatting check, tests, TypeScript, and build
npm run ci
```

## Pre-commit Hooks

Git pre-commit hooks are automatically set up with [Husky](https://typicode.com/husky) and [lint-staged](https://github.com/okonet/lint-staged).

**Before each commit:**

- ESLint automatically fixes all staged files
- Prettier automatically formats all staged files

This ensures code quality is maintained across the team.

## Configuration Files

- **ESLint:** `eslint.config.js` (ES modules flat config format)
- **Prettier:** `.prettierrc` (JSON format)
- **Ignore files:** `.prettierignore`
- **Husky hooks:** `.husky/pre-commit`
- **VS Code:** `.vscode/settings.json`

## ESLint Rules

### Key Rules

- **TypeScript:** Strict type checking with optional `any` warnings
- **React:** Enforces React best practices
- **React Hooks:** `exhaustive-deps` warns about missing dependencies
- **Console:** Warns about `console.log` usage (only `warn`/`error` allowed)
- **Unused vars:** Errors on unused variables unless prefixed with `_`

### Custom Allowances

- Test files (`*.test.ts`, `*.spec.ts`): No `no-explicit-any` errors
- Logger files: `console.log` and `console.error` allowed

## Prettier Options

- Print width: 100 characters
- Tab width: 2 spaces
- Trailing commas: ES5 compatible
- Single quotes: OFF (uses double quotes)
- Semicolons: ON
- Arrows: Always include parens

## Troubleshooting

### Hook not running on commit?

```bash
npm run prepare
```

### Want to skip the hook for a commit?

```bash
git commit --no-verify
```

(Not recommended - breaks the safety net)

### ESLint not recognizing test files?

Make sure test files follow the naming pattern:

- `*.test.ts`, `*.test.tsx`, `*.spec.ts`, `*.spec.tsx`
- Files in `e2e/` directory

## Team Standards

1. **Always commit with linting:** Don't skip hooks
2. **Use `npm run lint:fix`** before pushing to fix most issues automatically
3. **Read warnings carefully:** They often indicate real problems
4. **Update eslint rules** via discussion, not by adding ignore comments

## Further Reading

- [ESLint Docs](https://eslint.org/docs/latest/)
- [Prettier Docs](https://prettier.io/docs/en/)
- [Husky Docs](https://typicode.com/husky)
