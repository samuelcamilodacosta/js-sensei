# Modules: ESM, Boundaries, and Dependency Management

ECMAScript modules (`import`/`export`) are the standard for JavaScript code organization in browsers and Node.js. Clear module boundaries reduce coupling, enable tree-shaking, and mirror domain architecture.

---

## Introduction

**ESM** provides static structure analyzable by bundlers and runtimes. **Default vs named exports**, **dynamic `import()`**, and **package `"exports"` fields** affect how libraries expose APIs and how applications load code lazily.

---

## When to Use

- **Named exports** for most utilities and types
- **Default export** sparingly — one primary concept per module (e.g., plugin factory)
- **Dynamic import** for route-based code splitting
- **Barrel files (`index.js`)** cautiously — convenience vs circular dependency risk

---

## When to Avoid

- Circular imports without clear dependency direction
- Deep barrel re-exports hiding bundle size impact
- Mixing CJS `require` and ESM in same app without interop plan
- Side effects on import (global mutation) except explicit init modules

---

## Best Practices

1. One module = one cohesive responsibility
2. Keep public surface small; hide internals
3. Inject dependencies for testability ([architecture.md](./architecture.md))
4. Use explicit file extensions where required (Node ESM)
5. Colocate tests near modules or mirror structure in `__tests__`

---

## Bad Practices

- God modules exporting dozens of unrelated functions
- Importing from `../../../` chains — fix structure
- Mutating imported bindings (ESM live bindings for exports — surprising)
- Runtime `require` in ESM without createRequire

---

## Export Patterns

### ❌ Bad

```javascript
// utils.js — everything dump
export function formatDate() {}
export function parseJwt() {}
export function sendEmail() {}
export function calculateTax() {}
export default function randomHelper() {}
```

---

### ✅ Better

```javascript
// Split utils.js into focused modules:
// date/format-date.js, auth/parse-jwt.js, billing/calculate-tax.js
export { formatDate } from './date/format-date.js';
export { parseJwt } from './auth/parse-jwt.js';
export { calculateTax } from './billing/calculate-tax.js';
```

One export per concern; importers pull only what they need.

---

### ✅ Best

```javascript
// billing/calculateTax.js
export function calculateTax(amount, rate) {
  // ...
}

// billing/index.js — narrow barrel
export { calculateTax } from './calculateTax.js';
export { createInvoice } from './createInvoice.js';
```

Barrel only at feature boundary; avoid re-exporting entire subtrees.

---

## Dynamic Import

### ❌ Bad

```javascript
import AdminPanel from './AdminPanel.js'; // loads for all users
```

---

### ✅ Better

```javascript
let AdminPanel;
async function getAdminPanel() {
  if (!AdminPanel) {
    AdminPanel = (await import('./AdminPanel.js')).default;
  }
  return AdminPanel;
}
```

Lazy load once — still bundles chunk but defers parse until first use.

---

### ✅ Best

```javascript
async function loadAdminPanel() {
  if (!user.isAdmin) return null;
  const { AdminPanel } = await import('./AdminPanel.js');
  return AdminPanel;
}
```

---

## Before / After

### 57. CommonJS default

**Before:** `module.exports = fn;`

**After:** `export default fn;`

### 58. Named require destructuring

**Before:** `const { x } = require('./mod');`

**After:** `import { x } from './mod.js';`

### 59. \_\_dirname in ESM

**Before:** `__dirname`

**After:** `import.meta.url` with `fileURLToPath`

### 60. Conditional require

**Before:** `if (cond) require('./heavy');`

**After:** `if (cond) await import('./heavy.js');`

### 61. Package exports

**Before:** deep import `pkg/dist/internal/util`

**After:** public API via `"exports"` in package.json

---

## Common Pitfalls

- **Circular dependency** — partial initialization (`undefined` exports)
- **Tree-shaking** breaks with side-effect imports
- **Dual packages** (CJS+ESM) — duplicate instance bugs for classes

---

## Performance

- Static imports enable bundler splitting analysis
- Dynamic import creates separate chunk — use for large rarely-used code
- Avoid huge barrel files pulling entire feature trees into initial bundle

---

## References

- [MDN — import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)
- [MDN — export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)
- [Node.js — ES Modules](https://nodejs.org/api/esm.html)
- [ECMAScript — Modules](https://tc39.es/ecma262/#sec-modules)
