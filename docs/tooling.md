# Tooling: ESLint, Prettier, and Modern JavaScript Workflows

Tooling turns conventions into enforceable standards. js-sensei pairs explanatory docs with a working ESLint flat config, Prettier setup, and CI pipeline so teams spend review time on behavior, not spacing debates.

---

## Introduction

Modern JavaScript projects rely on a toolchain:

- **ESLint** — static analysis for bugs, unsafe patterns, and style violations
- **Prettier** — deterministic formatting
- **EditorConfig** — cross-editor baseline (indent, charset, EOL)
- **CI** — lint and format checks on every pull request

Tooling does not replace engineering judgment. It **automates the boring parts** so reviews focus on architecture, security, and correctness ([introduction.md](./introduction.md#code-review-checklist)).

---

## When to Use

| Tool                      | Use when                                            |
| ------------------------- | --------------------------------------------------- |
| **ESLint 9+ flat config** | Starting new projects or migrating from `.eslintrc` |
| **Prettier**              | Any multi-contributor codebase                      |
| **EditorConfig**          | Mixed editor environments (VS Code, WebStorm, Vim)  |
| **lint-staged + Husky**   | Prevent bad commits locally (optional)              |
| **CI quality job**        | Open source or team repos with PRs                  |

---

## When to Avoid

- ESLint rules that duplicate Prettier formatting — causes conflict noise
- Disabling lint rules file-wide without documented reason
- Custom ESLint plugins before team can maintain them
- 200-line ESLint config nobody understands — start minimal, grow deliberately
- Running Prettier and ESLint fix in unpredictable order — document pipeline

---

## Best Practices

1. Extend `@eslint/js` recommended as baseline
2. Enable security rules: `no-eval`, `no-implied-eval`, `no-new-func`
3. Enforce `no-var`, `prefer-const`, `eqeqeq`
4. Pin tool versions in `package.json`; update on schedule
5. Separate **intentionally bad** examples with ESLint overrides (`examples/bad/`)
6. Run `format:check` in CI — not just `format` locally
7. Document new rules in PR description when introducing them

---

## Bad Practices

- `"eslintConfig": { "rules": { "off": "everything" } }` to silence CI
- Prettier on some files, manual style on others
- No CI — style drifts until someone nitpicks in review
- Committing `eslint-disable` without comment on production code
- Different Node versions locally vs CI causing rule differences

---

## ESLint Flat Config

### ❌ Bad

No linter. `var`, `==`, and `eval` slip into PRs unnoticed.

```javascript
var user = getUser();
if (user.role == 'admin') eval(user.script);
```

---

### ✅ Better

Legacy `.eslintrc.json` copied from 2019 blog post — works but flat config is current standard.

```json
{
  "extends": "eslint:recommended",
  "rules": { "no-var": "error" }
}
```

---

### ✅ Best

Flat config in `eslint.config.js` (this repository):

```javascript
import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['node_modules/**'] },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: { ...globals.node, ...globals.es2024 },
    },
    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      'no-eval': 'error',
      eqeqeq: ['error', 'always'],
    },
  },
];
```

Per-directory overrides for `examples/bad/` and browser globals in DOM examples.

**When NOT to use strict rules:** generated code directories — exclude via `ignores`.

---

## Prettier Integration

### ❌ Bad

Team debates spaces in every PR comment thread.

---

### ✅ Better

Prettier runs locally only — drift when developers forget.

---

### ✅ Best

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "lint": "eslint ."
  }
}
```

CI runs both. Editor format-on-save matches `.prettierrc`. **Trade-off:** Prettier owns formatting — do not fight it in review.

This repo uses: single quotes, trailing commas, 100 print width, LF endings.

---

## CI Pipeline

### ❌ Bad

Merge PRs without automated checks — broken examples and style regressions accumulate.

---

### ✅ Best

`.github/workflows/ci.yml`:

```yaml
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run format:check
```

Extend with tests (Phase B), link checker, and Node version matrix.

---

## Editor and Git Hooks

### ✅ Best

`.editorconfig` aligns indent and charset. Optional `lint-staged`:

```json
{
  "lint-staged": {
    "*.js": ["eslint --fix", "prettier --write"]
  }
}
```

Hooks speed feedback; CI remains source of truth if hooks bypassed.

---

## Before / After

### 112. Formatting debates

**Before:** PR comments about spacing and quote style  
**After:** Prettier + `format:check` in CI — review focuses on logic

### 113. var in new code

**Before:** no linter  
**After:** ESLint `no-var: error` — caught at commit/CI

---

## Common Pitfalls

- **ESLint + Prettier conflict** — use `eslint-config-prettier` if extending stylistic ESLint rules
- **Flat config migration** — `env` key replaced by `languageOptions.globals`
- **Monorepo** — root config + package-specific overrides via `files` globs
- **TypeScript** — add `@typescript-eslint` separately; out of scope for js-sensei core

---

## Performance

Linting full monorepos can be slow — use `--cache`, lint changed files in pre-commit, full lint in CI. Prettier on thousands of files is fast relative to test suites.

---

## References

- [ESLint Documentation](https://eslint.org/docs/latest/)
- [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files)
- [Prettier Documentation](https://prettier.io/docs/en/)
- [EditorConfig](https://editorconfig.org/)
- [MDN — JavaScript tooling](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing)
