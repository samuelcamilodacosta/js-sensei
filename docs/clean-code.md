# Clean Code Principles for JavaScript

Clean code maximizes clarity for future readers — including your future self during incident response at 3 AM. Principles like **SRP**, **KISS**, **DRY**, and **YAGNI** guide trade-offs without dogma.

---

## Introduction

Clean code is not minimal line count. It is **intent-revealing**, **testable**, and **change-friendly**. JavaScript's flexibility makes discipline essential: implicit coercion, mutable defaults, and async complexity reward explicit structure.

---

## When to Use

- **SRP** — split modules when they change for different reasons
- **KISS** — prefer straightforward loop over clever reduce when team readability suffers
- **DRY** — extract duplication appearing 3+ times with stable abstraction
- **YAGNI** — defer generalization until second use case exists
- **Composition** — build behavior from small functions ([functions.md](./functions.md))
- **Immutability** — reduce shared-state bugs in concurrent UI updates

---

## When to Avoid

- DRYing one-off similar code prematurely
- SRP taken to one-function-per-file extremes
- Immutable clones on megabyte objects in hot paths without profiling
- Abstract patterns before concrete pain appears

---

## Best Practices

1. Readability over cleverness — explicit beats cryptic
2. Name functions by what they do, not how
3. Keep files focused; export narrow APIs
4. Delete dead code — version control remembers
5. Align code with ubiquitous language from product/domain

---

## Bad Practices

- Comments explaining bad names instead of renaming
- Boolean parameters switching behavior
- 500-line functions
- Copy-paste across features instead of shared kernel extraction

---

## SRP and KISS

### ❌ Bad

```javascript
function processUserRegistration(formData, sendEmail, createDbUser, logAnalytics) {
  // validates, hashes password, writes DB, sends email, tracks event — 180 lines
}
```

---

### ✅ Better

Split: `validateRegistration`, `hashPassword`, `registerUser`, orchestrator `processRegistration`.

---

### ✅ Best

```javascript
export async function processRegistration(input, deps) {
  const validated = validateRegistration(input);
  const passwordHash = await deps.hasher.hash(validated.password);
  const user = await deps.userRepository.create({ ...validated, passwordHash });
  await deps.mailer.sendWelcome(user);
  deps.analytics.track('user.registered', { userId: user.id });
  return user;
}
```

Orchestration visible; each step unit-testable.

---

## DRY vs YAGNI

### ❌ Bad

```javascript
function formatUserName(u) {
  return `${u.first} ${u.last}`;
}
function formatCustomerName(c) {
  return `${c.first} ${c.last}`;
}
function formatEmployeeName(e) {
  return `${e.first} ${e.last}`;
}
```

### ✅ Better

```javascript
export function formatFullName({ firstName, lastName }) {
  return `${firstName} ${lastName}`.trim();
}
```

Single shared formatter — one place to change rules.

---

### ✅ Best

---

## Immutability

### ❌ Bad

```javascript
function addItem(cart, item) {
  cart.items.push(item);
  return cart;
}
```

---

### ✅ Best

```javascript
function addItem(cart, item) {
  return { ...cart, items: [...cart.items, item] };
}
```

---

## Before / After

### 67. Early return

**Before:** nested if/else pyramid

**After:** guard clauses with early return

### 68. Else after return

**Before:** `if (x) { return a; } else { return b; }`

**After:** `if (x) return a; return b;`

### 69. Magic number

**Before:** `setTimeout(fn, 86400000)`

**After:** `const MS_PER_DAY = 86_400_000;`

### 70. Negative condition

**Before:** `if (!isNotValid())`

**After:** `if (isValid())`

### 71. Extract constant

**Before:** string literals repeated for event names

**After:** `const Events = Object.freeze({ USER_CREATED: 'user.created' });`

---

## Common Pitfalls

- **Premature abstraction** — harder than duplication
- **Over-immutability** — GC pressure without benefit
- **Clean code as performance excuse** — profile first

---

## Performance

Clean structure enables optimization targets; rarely conflicts with performance when hot paths identified.

---

## References

- [MDN — JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- Robert C. Martin — _Clean Code_ (principles)
- [web.dev — Code readability](https://web.dev/)
