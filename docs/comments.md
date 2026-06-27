# Comments and Documentation

Comments explain **why** and **constraints**; code explains **what**. Public APIs deserve JSDoc; implementation details deserve clarity through naming — not narration.

---

## Introduction

Two failure modes plague codebases: **noise comments** that restate the obvious, and **missing context** on business rules, security constraints, and performance trade-offs. js-sensei treats comments as documentation for future maintainers and incident responders — not as excuses for bad names.

---

## When to Use Comments

- Business rules invisible from code alone
- Performance or security constraints with policy reference
- Workarounds linking to issue tracker (`// BUG-1234: upstream returns null until v2`)
- Non-obvious algorithm invariants
- **JSDoc** on exported functions, classes, and complex parameters
- License headers and generated-code markers where required

---

## When to Avoid Comments

- Restating code (`i++ // increment i`)
- Commented-out dead code — delete; git remembers
- Changelog in source files — remove; use git history instead
- Apologies, jokes, or author attribution in production code
- Comments contradicting code — update or remove

---

## Best Practices

1. Refactor unclear code before commenting — rename first
2. Use JSDoc `@param`, `@returns`, `@throws` on public exports
3. Link to ticket/spec for temporary workarounds with expiry intent
4. Keep comments adjacent to the code they describe
5. Document units in names (`delayMs`) — reduce need for comments

---

## Bad Practices

- Comment every line in complex function instead of extracting functions
- `@ts-ignore` / eslint-disable without explanation
- Outdated comments after refactor — worse than none
- Documenting "what" when name could say it (`// get user` above `getUser`)

---

## Inline Comments

### ❌ Bad

```javascript
for (let i = 0; i < items.length; i++) {
  // loop through items
  total += items[i].price; // add price to total
}
```

---

### ✅ Better

```javascript
for (const item of items) {
  total += item.price;
}
```

Self-explanatory loop — no comment needed.

---

### ✅ Best

```javascript
// EU B2B orders with valid VAT ID are tax-exempt per policy TAX-2019-04 (Legal review 2024-01)
const tax = order.vatExempt ? 0 : computeTax(order.subtotal, order.taxRate);
```

**Why** documented; policy reference for auditors.

---

## JSDoc on Public APIs

### ❌ Bad

```javascript
export function calc(a, b, c) {
  return a * b + c;
}
```

---

### ✅ Better

```javascript
/** Computes line total from unit price, quantity, and flat fee. */
export function calc(unitPrice, quantity, flatFee) {
  return unitPrice * quantity + flatFee;
}
```

---

### ✅ Best

```javascript
/**
 * Calculates invoice total in minor currency units (cents).
 *
 * @param {import('./types.js').Invoice} invoice - Validated invoice with line items
 * @returns {number} Total cents after discounts and tax
 * @throws {RangeError} If invoice has no line items
 *
 * @example
 * calculateInvoiceTotalCents({ lines: [{ amountCents: 1000 }], taxRate: 0.08 })
 * // => 1080
 */
export function calculateInvoiceTotalCents(invoice) {
  if (!invoice.lines?.length) throw new RangeError('Invoice must have line items');
  // ...
}
```

Consumers get types, errors, and usage example in IDE tooltips.

---

## Before / After

### 118. Noise comment

**Before:** `i++; // increment i`  
**After:** remove comment or extract named step

### 119. Missing why

**Before:** `setTimeout(retry, 86400000)`  
**After:** `const RETRY_DELAY_MS = 86_400_000; // 24h — SLA allows one retry per day (OPS-7)`

---

## Common Pitfalls

- JSDoc types diverging from TypeScript — pick one source of truth
- Over-documenting private helpers — document public surface
- TODO without owner/date — becomes permanent

---

## Performance

Comments do not affect runtime. Excessive JSDoc on internal one-liners adds maintenance burden without value.

---

## References

- [MDN — Comments](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Comments)
- [JSDoc Reference](https://jsdoc.app/)
- [MDN — Code style guide](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Writing_style_guide/Code_style_guide/JavaScript)
