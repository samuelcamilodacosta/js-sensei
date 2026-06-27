# Functions: Declarations, Closures, Composition, and Purity

Functions are the primary unit of behavior in JavaScript applications. How you define, compose, and isolate them determines testability, readability, and defect rates in production services and UI code.

---

## Introduction

JavaScript supports **function declarations**, **function expressions**, **arrow functions**, **methods**, **generators**, and **async functions**. Each form differs in hoisting, `this` binding, and suitability for callbacks or object literals.

Experienced teams favor **small pure functions** composed into **orchestrators**, using **closures** for encapsulation and **higher-order functions** for reuse — without obscuring control flow.

---

## When to Use

| Form                 | Use when                                               |
| -------------------- | ------------------------------------------------------ |
| Function declaration | Top-level named utilities hoisted for mutual recursion |
| Arrow function       | Callbacks, short expressions, lexical `this` needed    |
| Function expression  | Conditional creation, IIFE legacy patterns (rare)      |
| Generator            | Lazy sequences, custom iterables                       |
| Async function       | Promise-based workflows with try/catch ergonomics      |

---

## When to Avoid

- Arrow functions as object methods when dynamic `this` is required
- Currying everywhere — adds indirection without benefit in simple call sites
- Generators when `async` iterators or arrays suffice
- Nested function definitions inside hot loops (recreation cost + closure capture)

---

## Best Practices

1. Keep functions under ~20–30 lines; extract when branching grows
2. Prefer pure functions for domain logic ([clean-code.md](./clean-code.md))
3. Name callbacks in `.map`/`.filter` when logic exceeds one expression
4. Pass dependencies as parameters (easier testing) over hidden module imports
5. Document side effects in orchestration layers, not buried in utilities

---

## Bad Practices

- Anonymous complex callbacks spanning 15+ lines
- Functions with boolean flags switching behavior ([code-smells.md](./code-smells.md))
- Relying on `arguments` object instead of rest parameters
- Mixing async and callback styles in the same module without adapters

---

## Arrow Functions vs Declarations

### ❌ Bad

```javascript
const service = {
  items: [],
  add(item) {
    this.items.push(item);
  },
  processAll: () => {
    this.items.forEach(this.transform); // `this` is lexical outer, not service
  },
};
```

**Why:** Arrow functions do not bind their own `this`. Methods that need dynamic `this` must use shorthand methods or declarations.

---

### ✅ Better

```javascript
const createInventoryService = () => {
  const items = [];

  return {
    add(item) {
      items.push(item);
    },
    processAll(transform) {
      items.forEach(transform);
    },
  };
};
```

**Why:** Closure encapsulates state; no `this` confusion.

---

### ✅ Best

```javascript
export function createInventoryService({ logger, transform }) {
  const items = [];

  return {
    add(item) {
      items.push(item);
      logger.debug({ event: 'inventory.add', itemId: item.id });
    },
    processAll() {
      return items.map(transform);
    },
    snapshot() {
      return structuredClone(items);
    },
  };
}
```

**Trade-offs:** Factory boilerplate vs clear DI and test seams. **When NOT to use:** Simple static utilities with no state — use plain functions.

---

## Closures

### ❌ Bad

```javascript
function createHandlers() {
  const cache = {};
  return {
    get(key) {
      return cache[key];
    },
    set(key, value) {
      cache[key] = value; // unbounded growth — memory leak in long-lived SPAs
    },
  };
}
```

---

### ✅ Better

```javascript
function createHandlers({ maxEntries = 1000 }) {
  const cache = new Map();

  return {
    get(key) {
      return cache.get(key);
    },
    set(key, value) {
      if (cache.size >= maxEntries) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }
      cache.set(key, value);
    },
  };
}
```

---

### ✅ Best

```javascript
export function memoize(fn, { maxSize = 128, keyFn = (...args) => JSON.stringify(args) } = {}) {
  const cache = new Map();

  return (...args) => {
    const key = keyFn(...args);
    if (cache.has(key)) return cache.get(key);

    const result = fn(...args);
    if (cache.size >= maxSize) cache.delete(cache.keys().next().value);
    cache.set(key, result);
    return result;
  };
}
```

Document eviction policy; expose cache stats in debug builds if needed.

---

## Higher-Order Functions and Composition

### ❌ Bad

```javascript
function processOrder(order) {
  let total = order.subtotal;
  total = total * (1 - (order.discount || 0));
  total = total + order.shipping;
  total = Math.round(total * 100) / 100;
  if (order.taxExempt) total = total - order.tax;
  return total;
}
```

Imperative steps — hard to unit test individual transforms.

---

### ✅ Better

```javascript
const applyDiscount = (amount, discount = 0) => amount * (1 - discount);
const addShipping = (amount, shipping) => amount + shipping;
const roundCurrency = (amount) => Math.round(amount * 100) / 100;

function processOrder(order) {
  let total = applyDiscount(order.subtotal, order.discount);
  total = addShipping(total, order.shipping);
  return roundCurrency(total);
}
```

---

### ✅ Best

```javascript
const applyDiscount = (amount, discount = 0) => amount * (1 - discount);
const addShipping = (subtotal, shipping) => subtotal + shipping;
const roundCurrency = (amount) => Math.round(amount * 100) / 100;

function calculateOrderTotal(order) {
  const afterDiscount = applyDiscount(order.subtotal, order.discount ?? 0);
  const withShipping = addShipping(afterDiscount, order.shipping ?? 0);
  return roundCurrency(withShipping);
}
```

Explicit pipeline in readable steps — test each function independently. Prefer this over clever `pipe` unless steps are reused across modules.

**Limitations:** For highly reusable transform chains, consider a small `pipe` helper — never at the cost of call-site clarity.

---

## Pure Functions

### ❌ Bad

```javascript
let taxRate = 0.08;

function computeTax(amount) {
  return amount * taxRate; // hidden dependency
}
```

---

### ✅ Better

```javascript
function computeTax(amount, rate) {
  return amount * rate;
}
```

Rate passed as argument — no module-level mutable state.

---

### ✅ Best

```javascript
export function computeTax(amount, taxRate) {
  if (amount < 0) throw new RangeError('amount must be non-negative');
  return amount * taxRate;
}
```

Same inputs → same outputs; no hidden state.

---

## Currying and Partial Application

**Currying** transforms `f(a, b, c)` into `f(a)(b)(c)`. **Partial application** fixes some arguments, producing a function with fewer parameters. Use when configuring reusable callbacks — not everywhere.

### ❌ Bad

```javascript
function createDiscountedPrice(discountPercent, taxRate, unitPrice) {
  return unitPrice * (1 - discountPercent) * (1 + taxRate);
}

products.map((p) => createDiscountedPrice(0.1, 0.08, p.price));
// argument order easy to confuse at every call site
```

---

### ✅ Better

```javascript
function withDiscount(discountPercent) {
  return (taxRate) => (unitPrice) => unitPrice * (1 - discountPercent) * (1 + taxRate);
}

const withTenPercentOff = withDiscount(0.1);
const withTax = withTenPercentOff(0.08);
products.map((p) => withTax(p.price));
```

Currying enables reusable configured functions.

---

### ✅ Best

```javascript
export function applyPricing({ discountPercent = 0, taxRate = 0 }) {
  return (unitPrice) => {
    const discounted = unitPrice * (1 - discountPercent);
    return discounted * (1 + taxRate);
  };
}

const priceForSale = applyPricing({ discountPercent: 0.1, taxRate: 0.08 });
products.map((p) => priceForSale(p.price));
```

Options object at configuration time — clearer than nested unary functions. **When NOT to use currying:** single-call utilities or teams unfamiliar with FP style — prefer plain functions ([clean-code.md](./clean-code.md)).

---

## Generators

### ❌ Bad

Using generators for a simple array map — unnecessary complexity.

---

### ✅ Best

```javascript
function* paginate(fetchPage, pageSize = 50) {
  let page = 0;
  let hasMore = true;

  while (hasMore) {
    const batch = await fetchPage({ page, pageSize });
    yield* batch.items;
    hasMore = batch.items.length === pageSize;
    page += 1;
  }
}
```

Lazy streaming for large datasets — pair with `for await...of` in async generators when pages are remote.

---

## Before / After

### 6. Callback naming

**Before:** `users.filter(u => u.active && u.role === 'admin')`

**After:** `users.filter(isActiveAdmin)` with `const isActiveAdmin = (u) => u.active && u.role === 'admin';`

### 7. Default parameters

**Before:** `function fetchUsers(limit) { limit = limit || 50; }`

**After:** `function fetchUsers(limit = 50) { ... }`

### 8. Rest over arguments

**Before:** `function sum() { return Array.from(arguments).reduce(...); }`

**After:** `function sum(...numbers) { return numbers.reduce(...); }`

### 9. Implicit return abuse

**Before:** `const getName = user => user && user.profile && user.profile.name;`

**After:** `const getName = (user) => user?.profile?.name;`

### 10. IIFE for async top-level (modules era)

**Before:** `(async function () { await init(); })();`

**After:** Top-level `await` in ES modules: `await init();`

---

## Common Pitfalls

- **Partial application confusion** — currying without call-site clarity
- **Closure in loops** — solved by `let`, `for...of`, or factory functions
- **Recursion without base case** — stack overflow in deep trees; use iteration or trampolining
- **Async functions always return Promises** — forgetting to `await` inner async calls

---

## Performance

- Named functions help engine optimization and stack traces
- Avoid creating closures inside tight loops when the captured scope is identical — hoist handler
- Generators have overhead vs arrays — use for lazy/infinite sequences only

---

## References

- [MDN — Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)
- [MDN — Arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [MDN — Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)
- [MDN — Generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator)
- [ECMAScript — Function Definitions](https://tc39.es/ecma262/#sec-function-definitions)
