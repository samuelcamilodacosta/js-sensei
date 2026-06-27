# Objects: Destructuring, Spread, and Safe Property Access

Object manipulation is central to API clients, configuration, domain models, and UI state. Modern JavaScript provides syntax and builtins that reduce null-check noise while keeping immutability and intent explicit.

---

## Introduction

Objects in production code are created, transformed, validated, and passed across module boundaries. **Destructuring**, **spread/rest**, **optional chaining (`?.`)**, **nullish coalescing (`??`)**, and **`Object.freeze` / `Object.seal`** each solve specific problems — and each has limits teams must understand.

---

## When to Use

- **Destructuring** — extracting fields from API responses, function parameters, nested config
- **Spread** — immutable updates, shallow clones, merging defaults
- **`?.`** — optional property access on possibly-null graphs
- **`??`** — defaults only for `null`/`undefined` (not `0` or `''`)
- **`Object.freeze`** — module-level constants, defensive exported config

---

## When to Avoid

- Deep spread chains on large objects — performance and accidental partial updates
- `??` when `||` is correct (e.g., treating `''` as missing)
- `Object.freeze` expecting deep immutability — shallow only
- Optional chaining to silence data model bugs — fix schema at source when possible

---

## Best Practices

1. Validate external objects at boundaries; trust shape internally
2. Prefer immutable updates for Redux-like state and shared references
3. Use `structuredClone` for deep copies when needed (with caveats for non-cloneables)
4. Name destructured fields for clarity: `{ displayName: name }`
5. Combine `?.` with explicit guards when business logic requires presence

---

## Bad Practices

- Mutating function arguments
- Spreading `undefined` (`{ ...maybeObj }` throws if not handled)
- Using `Object.assign` for readability when spread is clearer
- Relying on `hasOwnProperty` without `Object.hasOwn` (ES2022+)

---

## Optional Chaining and Nullish Coalescing

### ❌ Bad

```javascript
function getShippingCity(order) {
  if (order && order.customer && order.customer.address) {
    return order.customer.address.city || 'Unknown';
  }
  return 'Unknown';
}
```

Verbose; `||` treats valid empty string as falsy.

---

### ✅ Better

```javascript
function getShippingCity(order) {
  return order?.customer?.address?.city ?? 'Unknown';
}
```

---

### ✅ Best

```javascript
function getShippingCity(order) {
  const city = order?.customer?.address?.city;
  if (typeof city !== 'string' || city.length === 0) return 'Unknown';
  return city;
}
```

Validate at ingress with a schema library when data is external; use optional chaining for defensive reads in UI layers.

**When NOT to use `?.`:** When missing data is exceptional — fail fast with explicit errors ([errors.md](./errors.md)).

---

## Destructuring and Spread

### ❌ Bad

```javascript
function updateUser(user, updates) {
  user.name = updates.name;
  user.email = updates.email;
  return user;
}
```

Mutates caller's object.

---

### ✅ Better

```javascript
function updateUser(user, updates) {
  return { ...user, ...updates };
}
```

---

### ✅ Best

```javascript
function updateUser(user, { name, email, ...rest }) {
  return {
    ...user,
    ...(name !== undefined && { name }),
    ...(email !== undefined && { email }),
    ...rest,
  };
}
```

Selective updates preserve unspecified fields without overwriting with `undefined`.

---

## `Object.freeze`, `Object.seal`, `Object.assign`

### ❌ Bad

```javascript
const PERMISSIONS = Object.freeze({ ADMIN: 'admin' });
PERMISSIONS.ADMIN = 'superadmin'; // silent failure in non-strict; throws in strict
```

Mutation attempt on frozen object — understand strict mode behavior.

---

### ✅ Best

```javascript
export const PERMISSIONS = Object.freeze({
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer',
});

export function createUserSession(user) {
  return Object.seal({
    id: user.id,
    role: user.role,
    issuedAt: Date.now(),
  });
}
```

`freeze` for constants; `seal` when preventing new keys but allowing value updates on existing keys (rare — document why).

---

## Before / After

### 11. Nested access

**Before:** `if (user && user.address && user.address.city) {}`

**After:** `if (user?.address?.city) {}`

### 12. Default config

**Before:** `const timeout = config.timeout != null ? config.timeout : 5000;`

**After:** `const { timeout = 5000 } = config;`

### 13. Rename on destructure

**Before:** `const id = user.userId; const name = user.fullName;`

**After:** `const { userId: id, fullName: name } = user;`

### 14. Rest in destructure

**Before:** clone manually omitting keys

**After:** `const { password, ...publicUser } = user;`

### 15. Method binding

**Before:** `const fn = obj.method; fn();`

**After:** `obj.method()` or `const fn = obj.method.bind(obj);`

### 16. hasOwn check

**Before:** `obj.hasOwnProperty('id')`

**After:** `Object.hasOwn(obj, 'id')`

### 17. Merge defaults

**Before:** `Object.assign({}, defaults, options)`

**After:** `{ ...defaults, ...options }`

### 18. Dynamic key

**Before:** `const o = {}; o[key] = value;`

**After:** `const o = { [key]: value };`

---

## Common Pitfalls

- Shallow clone — nested objects still shared
- `structuredClone` fails on functions, symbols in some cases
- Spread order matters — later keys win
- Optional chaining short-circuits — side effects in chain won't run

---

## Performance

- Spread creates new objects — O(n) on own keys; acceptable unless hot path
- Repeated deep cloning in render loops — profile and memoize
- `Object.freeze` has small overhead; use at module init, not per request

---

## References

- [MDN — Destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
- [MDN — Spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
- [MDN — Optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
- [MDN — Nullish coalescing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
- [ECMAScript — Object operations](https://tc39.es/ecma262/#sec-operations-on-objects)
