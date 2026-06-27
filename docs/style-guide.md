# Style Guide

Consistent style reduces cognitive load in reviews and onboarding. Automated tools (Prettier, ESLint) handle formatting and common errors; this guide covers decisions tools cannot make.

---

## Introduction

Style is not aesthetics — it is **shared convention** that lets teams focus on behavior in code review. js-sensei aligns with modern defaults: `const`/`let`, modules, strict equality, explicit returns, and feature-based file organization.

---

## When to Use These Conventions

- All new JavaScript in application and library code
- Open-source contributions to js-sensei
- Greenfield modules in legacy codebases (incrementally)

---

## When to Defer or Adapt

- Generated code (protobuf, GraphQL) — exclude from manual style rules
- Vendor bundles committed by exception — do not reformat
- Legacy zones under active migration — document exceptions in team docs or README

---

## Best Practices

1. Run Prettier on save or in pre-commit
2. Prefer named exports; default export for single primary entry (App, plugin)
3. Early return over deep nesting ([clean-code.md](./clean-code.md))
4. Explicit braces for multi-line blocks — avoid ASI surprises
5. kebab-case file names for modules in this repository

---

## Bad Practices

- Mixed quote styles without Prettier
- `var` in new files
- `==` except documented null checks (prefer `== null` only when intentional)
- Wildcard imports (`import * as _ from 'lodash'`) bloating bundles
- 200-character lines manually broken against Prettier

---

## Declarations and Types

| Rule                           | Rationale                       |
| ------------------------------ | ------------------------------- |
| `const` default                | Signals immutability of binding |
| `let` for rebind only          | Visible mutation points         |
| No `var`                       | Block scope, no hoisting bugs   |
| Numeric separators `1_000_000` | Readability in large literals   |

### ❌ Bad

```javascript
var count = 0;
function inc() {
  count++;
}
```

### ✅ Better

```javascript
let count = 0;
function increment() {
  count += 1;
}
```

### ✅ Best

```javascript
export function createCounter(initial = 0) {
  let count = initial;
  return {
    increment() {
      count += 1;
    },
    value() {
      return count;
    },
  };
}
```

Encapsulated state — no module-level mutation.

---

## Functions and Exports

### ❌ Bad

```javascript
export default function (x) {
  return x * 2;
}
```

Anonymous default — poor stack traces and import names drift.

### ✅ Better

```javascript
export default function double(x) {
  return x * 2;
}
```

### ✅ Best

```javascript
export function double(x) {
  return x * 2;
}
```

Named export — refactor-safe imports.

---

## Imports

Order: Node builtins → external packages → internal aliases → relative.

```javascript
import fs from 'node:fs/promises';
import express from 'express';
import { config } from '@/config.js';
import { createRouter } from './router.js';
```

---

## Control Flow

### ❌ Bad

```javascript
if (user) {
  if (user.active) {
    if (user.subscription) {
      grantAccess();
    }
  }
}
```

### ✅ Best

```javascript
if (!user?.active) return;
if (!user.subscription?.valid) return;
grantAccess();
```

---

## Before / After

### 114. ASI hazard

**Before:** line starting with `[` after expression without semicolon  
**After:** Prettier + awareness of automatic semicolon insertion

### 115. Default export drift

**Before:** importers use arbitrary default names  
**After:** named exports for utilities

---

## Common Pitfalls

- Prettier vs ESLint conflict — disable ESLint formatting rules
- Inconsistent file naming within same feature folder
- Mixing ESM and CJS in same package without `"type"` clarity

---

## Performance

Style choices (const vs let, arrow vs function) have negligible runtime impact. Bundle size affected by import style — prefer direct named imports.

---

## References

- [MDN — JavaScript code style](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Writing_style_guide/Code_style_guide/JavaScript)
- [Prettier — Options](https://prettier.io/docs/en/options.html)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) (reference)
