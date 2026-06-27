# Variables: `const`, `let`, `var`, Scope, and Immutability

Variable declarations are the foundation of readable JavaScript. Choosing between `const`, `let`, and `var` affects bug surface area, refactor safety, and how teams reason about data flow in production codebases.

---

## Introduction

JavaScript provides three declaration keywords with different scoping, hoisting, and reassignment semantics. Modern codebases default to **`const`** and use **`let`** when rebinding is necessary. **`var`** remains in legacy code but should not appear in new modules.

Understanding **scope**, **hoisting**, the **Temporal Dead Zone (TDZ)**, and **mutability vs assignment** separates defensive engineering from accidental shared-state bugs.

---

## When to Use

| Declaration | Use when                                                                       |
| ----------- | ------------------------------------------------------------------------------ |
| `const`     | Default for bindings, including object/array references that mutate internally |
| `let`       | Loop counters, state machines, rebinding in algorithms                         |
| Block scope | Limiting visibility of temporary values (`if`, `for`, `try`)                   |

---

## When to Avoid

- `var` in any new code — function scope and hoisting create subtle bugs
- Reassigning `const` — syntax error; use `let` if rebinding is intentional
- Declaring variables far from usage "just in case" — widens scope unnecessarily
- Assuming `const` makes objects deeply immutable — it only prevents rebinding the identifier

---

## Best Practices

1. Default to `const`; escalate to `let` with a one-line comment if rebinding is non-obvious
2. Declare variables at the smallest scope that satisfies the algorithm
3. Prefer immutable updates (`spread`, `toSorted`) over in-place mutation for shared data
4. Use meaningful names that encode units and intent ([naming.md](./naming.md))
5. Initialize bindings at declaration when possible — avoids TDZ reads and `undefined` surprises

---

## Bad Practices

- Hoisting-dependent patterns that rely on `var` being `undefined` before assignment
- Mutating shared objects passed as configuration
- Shadowing outer bindings with identical names in nested blocks
- Using `let` for every variable "because we might reassign later"

---

## `const` vs `let` vs `var`

### ❌ Bad

```javascript
var userId = getUserId();
var userId = getSessionUserId(); // silently redeclares — no error

for (var i = 0; i < tasks.length; i++) {
  setTimeout(() => console.log(i), 100); // prints tasks.length every time
}
```

**Why it's bad:** `var` is function-scoped and hoisted without TDZ protection. The loop closure captures a single mutable `i`. Redeclaration in the same scope is allowed, hiding mistakes.

---

### ✅ Better

```javascript
let userId = getUserId();
// intentional rebinding after session refresh
userId = getSessionUserId();

for (let i = 0; i < tasks.length; i++) {
  setTimeout(() => console.log(i), 100); // 0, 1, 2, ...
}
```

**Why it's better:** `let` is block-scoped; each iteration gets its own binding. Reassignment is explicit and visible.

---

### ✅ Best

```javascript
const userId = getUserId();

for (const [index, task] of tasks.entries()) {
  scheduleTaskLogging(task, index);
}

function scheduleTaskLogging(task, index) {
  setTimeout(() => {
    logger.info({ taskId: task.id, index });
  }, 100);
}
```

**Why it's best:** `const` signals stable identity for `userId`. The loop uses iteration protocol instead of manual index management. Side effects move to a named function — easier to test.

**Limitations:** `const` does not freeze object contents. For configuration objects, combine with `Object.freeze` at module boundaries when appropriate ([objects.md](./objects.md)).

**When NOT to use:** Algorithms that genuinely require rebinding (e.g., while-parser with manual pointer) — use `let` locally.

---

## Scope and the Temporal Dead Zone

### ❌ Bad

```javascript
function chargeInvoice(invoice) {
  console.log(total); // ReferenceError — TDZ
  let total = invoice.subtotal + invoice.tax;
  return total;
}
```

**Why it's bad:** Accessing `let`/`const` before initialization throws. Legacy `var` would silently yield `undefined`, masking bugs.

---

### ✅ Better

```javascript
function chargeInvoice(invoice) {
  const total = invoice.subtotal + invoice.tax;
  logger.debug({ invoiceId: invoice.id, total });
  return total;
}
```

---

### ✅ Best

```javascript
function calculateInvoiceTotal(invoice) {
  const { subtotal, tax, discounts = [] } = invoice;
  const discountTotal = discounts.reduce((sum, d) => sum + d.amount, 0);
  return subtotal + tax - discountTotal;
}
```

Declare-then-use with pure calculation — no TDZ risk, testable without I/O.

---

## Immutability

### ❌ Bad

```javascript
const config = loadConfig();
config.api.timeout = 999999; // mutates shared singleton
export default config;
```

---

### ✅ Better

```javascript
const config = loadConfig();
export default Object.freeze({ ...config, api: { ...config.api } });
```

---

### ✅ Best

```javascript
export function createConfig(overrides = {}) {
  const base = loadConfig();
  return Object.freeze(deepMerge(structuredClone(base), overrides));
}
```

Factory with deep clone — consumers cannot accidentally mutate module-level state.

---

## Before / After

### 1. Optional chaining prep

**Before:**

```javascript
if (user && user.profile && user.profile.displayName) {
  renderGreeting(user.profile.displayName);
}
```

**After:**

```javascript
const displayName = user?.profile?.displayName;
if (displayName) renderGreeting(displayName);
```

### 2. Default values

**Before:**

```javascript
const limit = options.limit !== undefined ? options.limit : 50;
```

**After:**

```javascript
const { limit = 50 } = options;
// or: const limit = options.limit ?? 50;
```

### 3. Swap without temp (readability)

**Before:**

```javascript
var a = 1,
  b = 2,
  tmp = a;
a = b;
b = tmp;
```

**After:**

```javascript
[a, b] = [b, a]; // only when both are let bindings
```

### 4. Accidental global

**Before:**

```javascript
function init() {
  counter = 0; // creates global in sloppy mode
}
```

**After:**

```javascript
function init() {
  const counter = 0;
  return { getCount: () => counter };
}
```

### 5. Loop var leak

**Before:**

```javascript
for (var i = 0; i < items.length; i++) {
  if (items[i].broken) break;
}
console.log(i); // leaks
```

**After:**

```javascript
const brokenIndex = items.findIndex((item) => item.broken);
```

---

## Common Pitfalls

1. **`const` array push** — legal; mutating contents is allowed
2. **Shadowing** — inner `const user` hides outer; confuses debuggers
3. **`typeof undeclared` vs TDZ** — `typeof x` is safe for undeclared `var`-era globals but not for TDZ bindings in some edge cases; declare first
4. **Re-exporting mutable module state** — importers share one object reference

---

## Performance

- Declaration choice has **negligible runtime cost** in modern engines
- **Immutable updates** may allocate more short-lived objects — acceptable for clarity unless profiling shows GC pressure on hot paths ([performance.md](./performance.md))
- Block-scoped `let` in tight loops is optimized well; prefer clarity over micro-optimization

---

## References

- [MDN — `const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const)
- [MDN — `let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)
- [MDN — `var`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var)
- [MDN — Temporal Dead Zone](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#temporal_dead_zone_tdz)
- [ECMAScript — Block-scoped declarations](https://tc39.es/ecma262/#sec-block-scoped-declarations)
