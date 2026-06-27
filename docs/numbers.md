# Numbers: Precision, Parsing, and Intl Formatting

JavaScript numbers are IEEE-754 double-precision floats. Financial, scientific, and UI formatting code must handle precision limits, safe integers, and locale-specific presentation explicitly.

---

## Introduction

All `Number` values are 64-bit floats. Integers beyond `Number.MAX_SAFE_INTEGER` lose precision. **`Number.parseInt`**, **`Number.parseFloat`**, **`Number.isNaN`**, **`BigInt`**, and **`Intl.NumberFormat`** are the tools production code uses to avoid silent corruption of money, IDs, and metrics.

---

## When to Use

- **`Number.isFinite` / `Number.isNaN`** — type-safe checks (not global `isNaN`)
- **`BigInt`** — integers beyond safe range, cryptographic counters
- **`Intl.NumberFormat`** — currency and locale display
- **Decimal libraries** (document as pattern) — money calculations requiring exact decimal semantics
- **`Math.trunc` / `Math.floor`** — intentional rounding direction

---

## When to Avoid

- Floating point for currency accumulation without rounding strategy
- `parseInt` without radix for non-decimal strings
- `==` with `NaN` — always false; use `Number.isNaN`
- Mixing `BigInt` and `Number` without explicit conversion

---

## Best Practices

1. Store money as integer minor units (cents) when possible
2. Parse with `Number.parseInt(str, 10)` explicitly
3. Validate numeric input at API boundaries with schemas
4. Use `Intl` for display; keep computation in consistent units
5. Document rounding mode (banker's vs floor) in billing code

---

## Bad Practices

- `0.1 + 0.2 === 0.3` assumptions
- `parseInt('08')` legacy octal confusion (strict ES5+ less issue, still specify radix)
- Comparing floats with `===` without epsilon tolerance
- JSON.parse for numbers beyond safe integer — use string IDs or BigInt revivers

---

## Parsing and Validation

### ❌ Bad

```javascript
function applyDiscount(price, percent) {
  return price - price * (percent / 100); // float drift: 19.99 * 0.075
}
```

---

### ✅ Better

```javascript
function applyDiscountCents(priceCents, percent) {
  const discount = Math.round(priceCents * (percent / 100));
  return priceCents - discount;
}
```

---

### ✅ Best

```javascript
export function applyDiscountCents(priceCents, percent, { rounding = Math.round } = {}) {
  if (!Number.isInteger(priceCents) || priceCents < 0) {
    throw new RangeError('priceCents must be a non-negative integer');
  }
  const discount = rounding(priceCents * (percent / 100));
  return priceCents - discount;
}
```

Explicit invariants and injectable rounding for policy tests.

---

## Before / After

### 33. isNaN

**Before:** `isNaN(value)`

**After:** `Number.isNaN(value)`

### 34. parseInt radix

**Before:** `parseInt(input)`

**After:** `Number.parseInt(input, 10)`

### 35. Finite check

**Before:** `typeof n === 'number'`

**After:** `Number.isFinite(n)`

### 36. Currency display

**Before:** `'$' + (cents / 100).toFixed(2)`

**After:** `new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)`

### 37. Random integers

**Before:** `Math.floor(Math.random() * max)`

**After:** `crypto.getRandomValues` for security-sensitive tokens; `Math.random` only for non-crypto UI

### 38. Clamp

**Before:** nested `Math.min(Math.max(x, min), max)`

**After:** extract `clamp(value, min, max)` helper used consistently

---

## Common Pitfalls

- **Scientific notation in JSON IDs** — precision loss
- **Division by zero** — yields `Infinity`, not error
- **Bitwise ops** — truncate to 32-bit integers

---

## Performance

- `BigInt` operations slower than Number — use only when needed
- Cache `Intl.NumberFormat` instances

---

## References

- [MDN — Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)
- [MDN — BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
- [MDN — Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
- [ECMAScript — Number](https://tc39.es/ecma262/#sec-number-objects)
- [IEEE 754](https://standards.ieee.org/standard/754-2019.html)
