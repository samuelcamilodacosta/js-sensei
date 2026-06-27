# Memory: Leaks, Retention, and GC-Friendly Patterns

Memory issues in long-lived SPAs and Node services manifest as growing heap usage, GC pauses, and OOM crashes. Understanding **retention paths** and **lifecycle cleanup** separates stable production apps from tabs that slow down after an hour.

---

## Introduction

JavaScript uses automatic garbage collection: unreachable objects are reclaimed. Leaks occur when objects remain **reachable** unintentionally — global caches, event listeners, closures holding DOM nodes, timers, and DevTools references all extend lifetimes.

GC is non-deterministic; diagnose leaks with heap snapshots and allocation timelines ([debugging.md](./debugging.md)).

---

## When to Use

- **WeakMap / WeakSet** — metadata keyed by objects without preventing collection
- **AbortController** — remove listeners when component unmounts or route changes
- **Bounded caches** — LRU with explicit max size and eviction policy
- **Streaming** — process large data without loading entirely into RAM ([node.md](./node.md))
- **WeakRef + FinalizationRegistry** — advanced cases only, with clear ownership docs

---

## When to Avoid

- Module-level caches without bounds or TTL
- Storing DOM element references after removal from document
- Closures capturing full datasets when only an id is needed
- `console.log` huge objects in production (DevTools retains references)
- WeakRef as a general cache — objects may disappear unpredictably

---

## Best Practices

1. Pair every `addEventListener` with removal or `AbortSignal`
2. Clear `setInterval` / `setTimeout` in dispose/finally hooks
3. Document cache eviction policy and max entries
4. Profile before optimizing — confirm leak with heap diff
5. Avoid accidental globals (strict mode, ESLint `no-undef`)

---

## Bad Practices

- Unbounded `Map` keyed by user id for "session" data
- Re-registering window listeners on every React render without cleanup
- Holding iframe/window references after navigation
- Detached DOM trees kept in JS arrays "for reuse"

---

## Unbounded Cache

### ❌ Bad

```javascript
const cache = new Map();

export function rememberUser(user) {
  cache.set(user.id, user); // grows forever in long-lived SPA
}
```

---

### ✅ Better

```javascript
const MAX = 500;
const cache = new Map();

export function rememberUser(user) {
  if (cache.size >= MAX) cache.delete(cache.keys().next().value);
  cache.set(user.id, user);
}
```

FIFO eviction — simple but not LRU-fair.

---

### ✅ Best

```javascript
export function createUserCache({ maxSize = 500 } = {}) {
  const cache = new Map();

  return {
    get(id) {
      const user = cache.get(id);
      if (user) {
        cache.delete(id);
        cache.set(id, user); // refresh LRU order
      }
      return user;
    },
    set(user) {
      if (cache.has(user.id)) cache.delete(user.id);
      else if (cache.size >= maxSize) cache.delete(cache.keys().next().value);
      cache.set(user.id, user);
    },
    clear() {
      cache.clear();
    },
    get size() {
      return cache.size;
    },
  };
}
```

Bounded LRU-style cache with explicit API. **When NOT to use:** if staleness matters — add TTL invalidation.

---

## Event Listener Retention

### ❌ Bad

```javascript
export function mountChart(container) {
  window.addEventListener('resize', () => redraw(container));
  // no teardown — leak on SPA navigation
}
```

---

### ✅ Better

```javascript
export function mountChart(container) {
  const onResize = () => redraw(container);
  window.addEventListener('resize', onResize);
  return () => window.removeEventListener('resize', onResize);
}
```

---

### ✅ Best

```javascript
export function mountChart(container, { signal } = {}) {
  const onResize = () => redraw(container);
  window.addEventListener('resize', onResize, { signal });
  signal?.addEventListener('abort', () => destroyChart(container));
}
```

AbortController removes all signal-bound listeners at once ([browser.md](./browser.md)).

---

## WeakMap for Metadata

### ✅ Best

```javascript
const privateData = new WeakMap();

export function attachMetadata(obj, meta) {
  privateData.set(obj, meta);
}

export function getMetadata(obj) {
  return privateData.get(obj);
}
```

When `obj` is collected, metadata entry disappears — no manual delete.

---

## Before / After

### 95. Detached DOM

**Before:** cache removed DOM nodes in array  
**After:** store ids; query when needed

### 96. Listener leak

**Before:** add listener every render  
**After:** `{ signal }` + abort on unmount

### 97. Closure capture

**Before:** closure captures 10MB dataset  
**After:** precompute `Set` of ids or index

### 98. Timer leak

**Before:** `setInterval` without clear  
**After:** `clearInterval` in dispose

---

## Common Pitfalls

- **Closures in loops** over DOM nodes — capture id string, not element
- **Promise chains** holding large resolved values indefinitely
- **Global error handlers** closing over component state
- **Third-party widgets** without destroy API — wrap and document lifecycle

---

## Performance

- GC pauses correlate with retained set size — bound caches
- Frequent allocation of short-lived objects is normal; **retained** growth is the problem
- WeakMap lookup is O(1); use for auxiliary metadata, not primary storage

---

## References

- [MDN — Memory Management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management)
- [MDN — WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
- [web.dev — Fix memory problems](https://web.dev/articles/fix-memory-problems)
- [Node.js — Memory diagnostics](https://nodejs.org/en/learn/diagnostics/memory)
