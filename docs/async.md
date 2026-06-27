# Async/Await and the Event Loop

Asynchronous JavaScript coordinates I/O, timers, and user events without blocking the main thread. Understanding **async/await**, the **event loop**, **microtasks**, and **macrotasks** prevents race conditions, starvation bugs, and unhandled rejections in production.

---

## Introduction

JavaScript runtimes use an **event loop** to dequeue tasks from macrotask and microtask queues. **`async`/`await`** syntactic sugar over Promises improves readability but does not change scheduling semantics. **`AbortController`** enables cancellable fetch and long-running operations.

---

## When to Use

- **`async/await`** — sequential async workflows with try/catch
- **`Promise.all`** — parallel independent tasks; fail-fast
- **`Promise.allSettled`** — batch where all outcomes matter
- **`Promise.any`** — first success among unreliable sources
- **`Promise.race`** — timeouts and cancellation patterns (with care)
- **`AbortController`** — user-initiated cancel, navigation away, request dedup

---

## When to Avoid

- `async` on functions with no `await` — returns unnecessary Promise wrapper
- Sequential `await` in loops when tasks are independent — use `Promise.all`
- `Promise.race` without cleanup of losing tasks
- Blocking the event loop with sync CPU work on main thread ([performance.md](./performance.md))

---

## Best Practices

1. Always handle rejections — `try/catch` or `.catch`
2. Propagate `AbortSignal` through call chains
3. Parallelize independent I/O
4. Use structured concurrency patterns (track in-flight requests)
5. Log async errors with correlation IDs ([errors.md](./errors.md))

---

## Bad Practices

- Floating Promises (no await, no catch)
- Mixing callbacks and Promises without `util.promisify`
- `await` inside `forEach` — does not await serially as intended
- Ignoring microtask ordering assumptions in tests

---

## Async/Await

### ❌ Bad

```javascript
function loadDashboard(userId) {
  fetchUser(userId).then((user) => {
    fetchOrders(user.id).then((orders) => {
      render({ user, orders });
    });
  });
}
```

Callback nesting returns before work completes; errors unhandled.

---

### ✅ Better

```javascript
async function loadDashboard(userId) {
  const user = await fetchUser(userId);
  const orders = await fetchOrders(user.id);
  render({ user, orders });
}
```

---

### ✅ Best

```javascript
async function loadDashboard(userId, { signal } = {}) {
  const user = await fetchUser(userId, { signal });
  const [orders, preferences] = await Promise.all([
    fetchOrders(user.id, { signal }),
    fetchPreferences(user.id, { signal }),
  ]);
  return { user, orders, preferences };
}
```

Parallel independent fetches; cancellation propagated.

**When NOT to use parallel:** Strict ordering or rate limits require sequential execution.

---

## AbortController

### ❌ Bad

```javascript
async function search(query) {
  const res = await fetch(`/api/search?q=${query}`);
  return res.json(); // stale responses overwrite UI on fast typing
}
```

---

### ✅ Best

```javascript
async function search(query, { signal } = {}) {
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal });
  if (!res.ok) throw new HttpError(res.status, await res.text());
  return res.json();
}

// Caller:
const controller = new AbortController();
input.addEventListener(
  'input',
  debounce(async (e) => {
    controller.abort();
    const next = new AbortController();
    // wire next.signal...
  }, 300),
);
```

---

## Event Loop: Microtasks vs Macrotasks

```text
Call stack → Microtasks (Promises, queueMicrotask) → Macrotask (setTimeout, I/O)
```

### ❌ Bad

```javascript
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
// Expecting 1,2,3,4 — actually 1,4,3,2
```

Misunderstanding order causes flaky test assertions.

---

## Before / After

### 39. forEach await

**Before:**

```javascript
async function syncAll(users) {
  users.forEach(async (user) => await syncUser(user));
}
```

**After:**

```javascript
async function syncAll(users) {
  await Promise.all(users.map((user) => syncUser(user)));
}
```

### 40. try/catch with async

**Before:** `.then().catch()` chains scattered

**After:** single `try/catch` in async function

### 41. Parallel map

**Before:** sequential await in loop for independent API calls

**After:** `await Promise.all(items.map(fetchDetails))`

### 42. Timeout pattern

**Before:** manual timer without cleanup

**After:** `AbortSignal.timeout(5000)` (Node 18+ / modern browsers)

### 43. Sleep utility

**Before:** busy loop

**After:** `await new Promise(r => setTimeout(r, ms))` with abort support

### 44. Retry

**Before:** recursive promise chain without backoff

**After:** loop with exponential backoff and max attempts

---

## Common Pitfalls

- **Unhandled rejection** on forgotten `await`
- **async generator** consumption requires `for await`
- **Top-level await** only in modules
- **Microtask starvation** — infinite Promise.resolve loops block macrotasks

---

## Performance

- Parallel I/O reduces latency; respect connection limits
- `Promise.all` fail-fast — use `allSettled` when partial success is useful
- Offload CPU work to Workers ([node.md](./node.md), [browser.md](./browser.md))

---

## References

- [MDN — async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [MDN — AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [MDN — Event loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop)
- [ECMAScript — AsyncFunction](https://tc39.es/ecma262/#sec-async-function-definitions)
- [web.dev — Understanding the event loop](https://web.dev/articles/event-loop)
