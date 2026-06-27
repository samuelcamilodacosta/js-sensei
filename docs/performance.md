# Performance: Big-O, Memoization, Debounce, and Throttle

Performance engineering starts with **measurement**, then addresses algorithmic complexity, main-thread blocking, and I/O patterns — not speculative micro-optimization.

---

## Introduction

JavaScript runtimes execute user code on a **single main thread** (Workers aside). **Big-O** complexity predicts scaling. **Memoization** caches pure results. **Debounce** and **throttle** rate-limit expensive handlers. **Lazy evaluation** defers work until needed.

---

## When to Use

| Technique             | Use when                                              |
| --------------------- | ----------------------------------------------------- |
| **Algorithm upgrade** | O(n²) loops on growing datasets                       |
| **Memoization**       | Repeated expensive pure calls with same inputs        |
| **Debounce**          | Search-as-you-type, resize recalculation on settle    |
| **Throttle**          | Scroll, mousemove, progress sampling                  |
| **Lazy import**       | Large rarely-used modules                             |
| **DOM batching**      | Many layout reads/writes ([browser.md](./browser.md)) |

---

## When to Avoid

- Memoizing unbounded input keys — memory leak
- Debouncing form submit safety actions without explicit user intent
- Optimizing before profiling identifies hot path
- Throttle so aggressive UX feels unresponsive
- Caching without invalidation when data changes frequently

---

## Best Practices

1. Profile first (DevTools Performance, Node `--cpu-prof`)
2. Fix complexity class before micro-tuning
3. Set cache bounds and TTL
4. Document debounce/throttle delays with UX rationale
5. Load test I/O paths separately from CPU paths

---

## Bad Practices

- Premature `requestAnimationFrame` everywhere
- JSON deep-clone on every render
- Synchronous work in scroll handlers
- Memoizing impure functions — stale wrong results

---

## Big-O

### ❌ Bad

```javascript
function findDuplicateSkus(products) {
  const dupes = [];
  for (let i = 0; i < products.length; i++) {
    for (let j = i + 1; j < products.length; j++) {
      if (products[i].sku === products[j].sku) dupes.push(products[i].sku);
    }
  }
  return dupes;
}
```

O(n²) — degrades rapidly past ~10k items.

---

### ✅ Better

```javascript
function findDuplicateSkus(products) {
  const seen = new Set();
  const dupes = new Set();
  for (const { sku } of products) {
    if (seen.has(sku)) dupes.add(sku);
    seen.add(sku);
  }
  return [...dupes];
}
```

O(n) time, O(n) space.

---

### ✅ Best

Extract when reused; add benchmark in CI for regression ([examples/benchmarks/](../examples/benchmarks/)). For repeated lookups, build `Map<sku, Product>` once.

---

## Debounce

Delays execution until input **stops** for `waitMs`. Ideal for search.

### ❌ Bad

```javascript
searchInput.addEventListener('input', (e) => {
  fetchResults(e.target.value); // request per keystroke
});
```

---

### ✅ Better

```javascript
let timer;
searchInput.addEventListener('input', (e) => {
  clearTimeout(timer);
  timer = setTimeout(() => fetchResults(e.target.value), 300);
});
```

---

### ✅ Best

```javascript
export function debounce(fn, waitMs) {
  let timerId = null;
  return (...args) => {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => {
      timerId = null;
      fn(...args);
    }, waitMs);
  };
}

const fetchResultsDebounced = debounce(fetchResults, 300);
searchInput.addEventListener('input', (e) => fetchResultsDebounced(e.target.value));
```

Reusable utility; pair with AbortController for in-flight cancel ([async.md](./async.md)).

---

## Throttle

Executes at most once per `intervalMs` during continuous events. Ideal for scroll.

### ❌ Bad

```javascript
window.addEventListener('scroll', () => updateStickyHeader()); // 60+ fps calls
```

---

### ✅ Better

```javascript
let last = 0;
window.addEventListener('scroll', () => {
  const now = Date.now();
  if (now - last < 100) return;
  last = now;
  updateStickyHeader();
});
```

---

### ✅ Best

```javascript
export function throttle(fn, intervalMs) {
  let last = 0;
  let trailing = null;
  return (...args) => {
    const now = Date.now();
    if (now - last >= intervalMs) {
      last = now;
      fn(...args);
    } else {
      trailing = args;
    }
  };
}
```

Optional trailing call pattern for final position — document behavior choice.

---

## Memoization

### ❌ Bad

```javascript
const cache = {};
function fib(n) {
  if (cache[n]) return cache[n];
  cache[n] = n <= 1 ? n : fib(n - 1) + fib(n - 2);
  return cache[n];
}
```

Unbounded keys; `cache` is plain object with number keys (ok for fib, bad pattern generally).

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

Bounded cache; inject key function for object args. **Only for pure functions.**

---

## Before / After

### 89–94

See [examples/benchmarks/](../examples/benchmarks/) and [browser.md](./browser.md) for index-in-loop, string concat, layout thrashing patterns.

---

## Common Pitfalls

- Debounce on `blur` only — misses last keystroke if not flushed
- Memoizing functions that read `Date.now()` — stale time
- Wrong complexity analysis — two nested loops on different sized inputs may be O(n)

---

## Performance

Ironically, debounce/throttle add latency by design — trade responsiveness for throughput. Choose delays based on UX testing, not magic numbers alone.

---

## References

- [MDN — Event loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop)
- [web.dev — Performance](https://web.dev/performance)
- [web.dev — Debounce and throttle](https://web.dev/articles/debounce-your-input-handlers)
- [ECMAScript Specification](https://tc39.es/ecma262/)
