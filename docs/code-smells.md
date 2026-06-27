# Code Smells in JavaScript

Code smells are symptoms of deeper design problems. Recognizing them early in reviews prevents compounds interest on technical debt.

---

## Introduction

A smell is not a bug — it is a pattern that often leads to bugs, slow delivery, or fragile tests. This guide covers smells common in JavaScript codebases: oversized functions, parameter lists, boolean flags, nested conditionals, callback hell, god objects, and more.

---

## When to Use This Document

- Code reviews and refactors
- Interview discussions (identify smell → propose fix)
- Prioritizing tech debt backlog

---

## When to Avoid

- Labeling all non-ideal code as smells — prioritize impact
- Refactoring without tests on critical paths
- Style nitpicks disguised as architecture smells

---

## Smell Catalog

### Functions Too Large

**Symptom:** 100+ lines, multiple abstraction levels.

**Fix:** Extract functions named after intent; orchestrator composes them.

### Too Many Parameters

**Symptom:** 5+ positional parameters.

**Fix:** Options object with defaults; split function.

### Boolean Flag Parameters

**Symptom:** `render(user, true, false)`.

**Fix:** Separate functions or options enum: `{ mode: 'admin' }`.

### Giant switch

**Symptom:** Switch on type string with 20 cases duplicating structure.

**Fix:** Strategy map `handlers[type]?.()` or polymorphism.

### Unnecessary else

**Symptom:** else after return.

**Fix:** Early return ([clean-code.md](./clean-code.md)).

### Callback Hell / Pyramid of Doom

**Symptom:** Nested `.then` or callbacks.

**Fix:** async/await, Promise.all ([async.md](./async.md)).

### Nested if

**Symptom:** 4+ levels indentation.

**Fix:** Guard clauses, extract predicates.

### Magic Numbers

**Symptom:** unexplained literals.

**Fix:** Named constants with units.

### Duplicate Code

**Symptom:** copy-paste with tiny variations.

**Fix:** Parameterize or template method — after third occurrence.

### God Object

**Symptom:** one class/module knows everything.

**Fix:** Split by responsibility; feature modules.

### Primitive Obsession

**Symptom:** `string` for email, money as number.

**Fix:** Value objects / validation wrappers at boundaries.

### Feature Envy

**Symptom:** function mostly uses another object's data.

**Fix:** Move method closer to data or introduce service.

### Shotgun Surgery

**Symptom:** one change requires edits in many files.

**Fix:** Consolidate related logic; improve module cohesion.

---

## Examples

### Boolean Flag

#### ❌ Bad

```javascript
function exportReport(data, asPdf, includeCharts) {
  if (asPdf) {
    /* ... */
  } else {
    /* ... */
  }
  if (includeCharts) {
    /* ... */
  }
}
```

#### ✅ Best

```javascript
function exportReport(data, { format = 'csv', includeCharts = false } = {}) {
  const exporter = exporters[format];
  if (!exporter) throw new RangeError(`Unknown format: ${format}`);
  return exporter(data, { includeCharts });
}
```

---

### Nested if

#### ❌ Bad

```javascript
if (user) {
  if (user.active) {
    if (user.subscription) {
      if (user.subscription.valid) {
        grantAccess();
      }
    }
  }
}
```

#### ✅ Best

```javascript
if (!user?.active) return;
if (!user.subscription?.valid) return;
grantAccess();
```

---

## Before / After

### 72. Switch to map

**Before:** giant switch on action type

**After:** `const handlers = { CREATE: handleCreate, ... }; handlers[type]?.()`

### 73. Long params

**Before:** `createUser(a,b,c,d,e,f)`

**After:** `createUser({ name, email, role, ... })`

### 74. Callback pyramid

**Before:** nested callbacks 4 deep

**After:** async/await

### 75. Duplicate validation

**Before:** same email regex in 5 files

**After:** `validateEmail` in shared boundary module

### 76. God fetch function

**Before:** one `api()` function with 40 endpoints

**After:** feature-scoped clients `usersApi`, `billingApi`

### 77. Feature envy

**Before:** function taking `order` and reading 8 order fields to compute tax

**After:** `order.calculateTax()` or `taxService.forOrder(order)`

### 78. Magic timeout

**Before:** `setTimeout(retry, 3000)`

**After:** `RETRY_DELAY_MS` with comment linking to SLA doc

---

## Common Pitfalls

- Refactoring smell without behavioral tests
- Creating abstraction that only serves one call site
- Confusing lint warnings with architectural smells

---

## Performance

Some smells (duplicate work, god functions) hide performance issues — profile after structural fix.

---

## References

- Martin Fowler — Refactoring (catalog)
- [MDN — JavaScript best practices](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Writing_style_guide/Code_style_guide/JavaScript)
