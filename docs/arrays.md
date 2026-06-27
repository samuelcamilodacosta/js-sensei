# Arrays: Iteration, Search, and Immutable Updates

Arrays represent ordered collections in nearly every JavaScript application — from API result sets to UI lists. Choosing the right method improves readability, correctness, and sometimes performance.

---

## Introduction

ES2015+ added expressive array methods; ES2023+ added **non-mutating** variants (`toSorted`, `toSpliced`, `toReversed`). Understanding when to **mutate in place** vs **return new arrays** is essential for predictable state management.

---

## When to Use

| Method               | Use when                                      |
| -------------------- | --------------------------------------------- |
| `map`                | Transform each element to a new value         |
| `filter`             | Subset by predicate                           |
| `reduce`             | Aggregate to single value (sum, group, index) |
| `find` / `findIndex` | First match                                   |
| `some` / `every`     | Existential / universal checks                |
| `includes`           | Primitive membership (mind `NaN`, `-0`)       |
| `flat` / `flatMap`   | Nested structures                             |
| `toSorted`           | Need sorted copy without mutating source      |

---

## When to Avoid

- `reduce` for simple loops — often less readable than `map` + `filter`
- `sort()` when you need immutability — mutates in place
- `filter().length > 0` — use `some`
- Chaining 5+ methods without extraction — extract named functions

---

## Best Practices

1. Use `some`/`every` for boolean questions
2. Prefer `toSorted` over `[...arr].sort()` for clarity (ES2023)
3. Provide compare functions to `sort`/`toSorted` — default sort is lexicographic
4. Use `flatMap` instead of `map().flat()` when mapping to arrays
5. For large arrays, consider iterators or streaming ([node.md](./node.md))

---

## Bad Practices

- Using `forEach` when you need a transformed array (use `map`)
- Ignoring return value of `sort()` — it mutates and returns same reference
- `==` comparisons in `includes` for mixed types
- Building arrays with manual index push when declarative methods suffice

---

## Search and Existence

### ❌ Bad

```javascript
const hasActiveAdmin = users.filter((u) => u.active && u.role === 'admin').length > 0;
```

Allocates intermediate array unnecessarily.

---

### ✅ Better

```javascript
const hasActiveAdmin = users.some((u) => u.active && u.role === 'admin');
```

---

### ✅ Best

```javascript
const isActiveAdmin = (user) => user.active && user.role === 'admin';
const hasActiveAdmin = users.some(isActiveAdmin);
```

Named predicate — reusable in tests and filters.

---

## Sorting

### ❌ Bad

```javascript
function getSortedProducts(products) {
  return products.sort((a, b) => a.price - b.price); // mutates input
}
```

---

### ✅ Better

```javascript
function getSortedProducts(products) {
  return [...products].sort((a, b) => a.price - b.price);
}
```

---

### ✅ Best

```javascript
function getSortedProducts(products) {
  return products.toSorted((a, b) => a.price - b.price);
}
```

Explicit non-mutating intent (ES2023). **When NOT available:** use spread copy or document mutation contract.

---

## Reduce

### ❌ Bad

```javascript
const total = items.reduce((sum, item) => {
  if (item.type === 'discount') {
    // 40 lines of branching...
  }
  return sum + item.amount;
}, 0);
```

God reducer — untestable.

---

### ✅ Best

```javascript
const sumAmounts = (items) => items.reduce((sum, item) => sum + item.amount, 0);

function calculateInvoiceTotal(items) {
  const subtotal = sumAmounts(items.filter((i) => i.type !== 'discount'));
  const discounts = sumAmounts(items.filter((i) => i.type === 'discount'));
  return subtotal - discounts;
}
```

---

## Before / After

### 19. Find vs filter

**Before:** `const user = users.filter(u => u.id === id)[0];`

**After:** `const user = users.find(u => u.id === id);`

### 20. Every validation

**Before:** `items.filter(i => i.valid).length === items.length`

**After:** `items.every(i => i.valid)`

### 21. flatMap

**Before:** `teams.map(t => t.members).flat()`

**After:** `teams.flatMap(t => t.members)`

### 22. includes vs indexOf

**Before:** `roles.indexOf('admin') !== -1`

**After:** `roles.includes('admin')`

### 23. Immutable splice

**Before:** `arr.splice(index, 1)` mutating shared state

**After:** `arr.toSpliced(index, 1)` or `arr.filter((_, i) => i !== index)`

### 24. Unique values

**Before:** manual loop with `seen` object

**After:** `[...new Set(values)]`

### 25. Group by

**Before:** nested loops

**After:** `Object.groupBy(items, (i) => i.category)` (ES2024) or reduce with clear helper

### 26. Chunk array

**Before:** manual index arithmetic in for loop

**After:** reusable `chunk(arr, size)` using slice in reduce

---

## Common Pitfalls

- **Sparse arrays** — `map` skips holes; `forEach` may skip differently
- **Sort without comparator** — `[10, 9, 8].sort()` → `[10, 8, 9]`
- **Mutating during iteration** — undefined behavior patterns
- **`find` returns undefined** — distinguish from found `undefined` value with `findIndex`

---

## Performance

- `some`/`every` short-circuit — faster than full filter
- `reduce` single pass vs multiple filters — trade readability for large datasets
- `toSorted` allocates — same as copy+sort; choose clarity

---

## References

- [MDN — Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [MDN — `toSorted`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted)
- [MDN — `flatMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap)
- [ECMAScript — Array methods](https://tc39.es/ecma262/#sec-array-objects)
