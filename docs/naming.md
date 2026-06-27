# Naming Conventions

Names are the primary documentation in code. Precise naming reduces comments, prevents misuse, and makes reviews faster — especially in large JavaScript codebases where grep and IDE search replace formal IDE navigation.

---

## Introduction

JavaScript has flexible naming — almost anything is syntactically valid. Convention creates **predictability**: camelCase for values and functions, PascalCase for classes, SCREAMING_SNAKE for true constants, kebab-case for file names in many projects. Boolean names answer questions (`isActive`, `hasItems`). Functions use **verbs**; variables use **nouns**.

Poor naming forces readers to trace implementation. Good naming lets them trust the abstraction.

---

## When to Use

| Pattern               | Use when                                  |
| --------------------- | ----------------------------------------- |
| **camelCase**         | Variables, functions, object properties   |
| **PascalCase**        | Classes, React components, error classes  |
| **SCREAMING_SNAKE**   | Module-level immutable constants          |
| **#privateField**     | Class private state (ES2022)              |
| **kebab-case files**  | Module file names (`invoice-service.js`)  |
| **is/has/can/should** | Boolean variables and predicates          |
| **Units in names**    | `delayMs`, `priceCents`, `timeoutSeconds` |

---

## When to Avoid

- Single-letter names except loop indices and well-known math (`i`, `j`, `x`, `y`)
- Abbreviations unknown to new team members (`proc`, `mgr`, `cfg`)
- Negative booleans (`isNotValid`, `disableNotSave`)
- Generic names (`data`, `info`, `temp`, `handler`) in wide scope
- Hungarian notation in JS (`strName`) — types belong in TypeScript if needed
- Names that lie (`getUser` that also sends email)

---

## Best Practices

1. Name functions after **what they do**, not how (`calculateTax`, not `doMath`)
2. Match **ubiquitous language** from product/domain (same terms in UI, API, code)
3. Rename when misunderstanding appears — do not comment around bad names
4. Encode **units** in names for numbers (`ttlSeconds`, not `ttl` alone)
5. Event handlers: `handleSubmitCheckout`, not `handleClick` when multiple buttons exist
6. Boolean returns: `isValidEmail`, `canEditInvoice`
7. Collections plural: `users`, `lineItems`; single entity singular: `user`

---

## Bad Practices

- `flag`, `mode`, `type` without domain prefix
- `process(data)` — process how?
- Copy-paste names (`user2`, `newHandler`)
- Overloaded term `manager` for unrelated concepts
- Exporting `utils.js` with 40 unrelated functions — file name hides purpose

---

## Variables and Functions

### ❌ Bad

```javascript
const d = Date.now();
const flag = true;
function proc(x) {
  return x * 1.08;
}
const data = await fetchUsers();
```

`d`, `flag`, `proc`, `data` communicate nothing. Search for `data` is useless.

---

### ✅ Better

```javascript
const timestamp = Date.now();
const isActive = true;
function applyTax(amount) {
  return amount * 1.08;
}
const users = await fetchUsers();
```

---

### ✅ Best

```javascript
const issuedAt = Date.now();
const isSubscriptionActive = true;

function applyTaxCents(subtotalCents, taxRate) {
  return Math.round(subtotalCents * taxRate);
}

const users = await fetchUsers({ status: 'active' });
```

Units, domain terms, explicit parameters. **When NOT to over-name:** trivial inner scope (`const sum = a + b` in three-line function is fine).

---

## Booleans and Predicates

### ❌ Bad

```javascript
if (!isNotDisabled) {
  /* ... */
}
const check = user.role === 'admin';
users.filter((u) => u.active && u.role === 'admin');
```

---

### ✅ Better

```javascript
const isAdmin = user.role === 'admin';
const isActiveAdmin = (u) => u.active && u.role === 'admin';
users.filter(isActiveAdmin);
```

Named predicates reusable in tests and filters ([functions.md](./functions.md)).

---

### ✅ Best

```javascript
const ROLES = Object.freeze({ ADMIN: 'admin', EDITOR: 'editor' });

function isActiveAdmin(user) {
  return user.active === true && user.role === ROLES.ADMIN;
}
```

Constants for magic strings; predicate named and testable.

---

## Files and Modules

### ❌ Bad

```text
utils.js          # 800 lines, everything
helpers.js
common.js
```

---

### ✅ Best

```text
features/billing/
  calculate-tax.js
  create-invoice.js
  invoice-service.js
  index.js          # narrow public barrel
```

File names reveal domain. See [architecture.md](./architecture.md).

---

## Before / After

### 116. Generic data

**Before:** `const data = await fetchUsers()`  
**After:** `const users = await fetchUsers()`

### 117. Event handler

**Before:** `onClick={handleClick}` on multiple buttons  
**After:** `onClick={handleSubmitCheckout}`

---

## Common Pitfalls

- **Rename half the codebase** — inconsistent old/new names during migration
- **Long names** — `calculateTotalInvoiceAmountWithTaxAndDiscountInCents` — balance clarity and length
- **Abbreviations in public API** — external consumers suffer
- **Same name different meanings** in different modules — prefix with domain (`billingTotal`, `cartTotal`)

---

## Performance

Naming has zero runtime cost. Better names improve search and refactor speed — human performance, not V8.

---

## References

- [MDN — Naming variables](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Writing_style_guide/Code_style_guide/JavaScript#naming)
- [style-guide.md](./style-guide.md)
- [clean-code.md](./clean-code.md)
