# Antipatterns: What to Eliminate from Modern Codebases

Antipatterns are repeated responses that produce more harm than benefit. Eliminating them from new code and isolating them in legacy boundaries reduces security incidents and maintenance cost.

---

## Introduction

JavaScript's history includes APIs and habits that were acceptable in 2005 but are hazardous or unnecessary today: **`eval`**, **`document.write`**, **`var`**, **global pollution**, **prototype mutation**, and **unnecessary mutation**.

---

## When to Use This Document

- Auditing legacy code
- Defining ESLint rules and review blockers
- Training teams migrating jQuery-era codebases

---

## Catalog

| Antipattern                 | Risk                       | Alternative               |
| --------------------------- | -------------------------- | ------------------------- |
| `eval` / `new Function`     | XSS, optimization bailouts | JSON.parse, safe parsers  |
| `document.write`            | Blocks parsing, XSS        | DOM APIs, SSR frameworks  |
| `var`                       | Hoisting bugs              | `const`/`let`             |
| Global variables            | Collisions, untestable     | modules, explicit exports |
| `Object.prototype` mutation | Breaks for..in, security   | Map, own properties       |
| Callback hell               | Unmaintainable async       | async/await               |
| Sync blocking I/O on server | Throughput collapse        | async I/O, workers        |

---

## eval and Dynamic Code Execution

### ❌ Bad

```javascript
const fn = eval(`(${userInput})`);
fn(data);
```

Remote code execution if input influenced.

### ✅ Best

```javascript
const allowedActions = Object.freeze({ ping: () => 'pong' });
const action = allowedActions[userInput];
if (!action) throw new RangeError('Invalid action');
return action();
```

Whitelist dispatch — never evaluate strings as code.

---

## Global Pollution

### ❌ Bad

```javascript
window.currentUser = user;
helpers = {}; // accidental global in non-strict
```

### ✅ Best

ES modules with explicit exports; attach to `window` only for deliberate browser extension APIs.

---

## Prototype Mutation

### ❌ Bad

```javascript
Object.prototype.pick = function (keys) {
  /* ... */
};
```

Breaks all objects; prototype pollution vector ([security.md](./security.md)).

### ✅ Best

```javascript
export function pick(obj, keys) {
  return Object.fromEntries(keys.filter((k) => Object.hasOwn(obj, k)).map((k) => [k, obj[k]]));
}
```

---

## Unnecessary Mutation

### ❌ Bad

```javascript
users.sort((a, b) => a.name.localeCompare(b.name)); // mutates Redux state
```

### ✅ Best

```javascript
const sortedUsers = users.toSorted((a, b) => a.name.localeCompare(b.name));
```

---

## Before / After

### 83. innerHTML with user data

**Before:** `el.innerHTML = user.bio`

**After:** `el.textContent = user.bio` or sanitize with trusted library

### 84. with statement

**Before:** `with (obj) { x = 1; }`

**After:** explicit property access ( forbidden in strict mode )

### 85. arguments.callee

**Before:** recursive anonymous function via arguments.callee

**After:** named function expression

### 86. Sync XHR

**Before:** synchronous XMLHttpRequest

**After:** fetch + async/await

### 87. **proto**

**Before:** `obj.__proto__ = proto`

**After:** `Object.create(proto)` or class syntax

### 88. Array-like iteration

**Before:** `Array.prototype.slice.call(arguments)`

**After:** rest parameters `function fn(...args)`

---

## References

- [MDN — eval](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval) — "never use eval!"
- [MDN — Strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode)
- [web.dev — XSS](https://web.dev/articles/cross-site-scripting)
