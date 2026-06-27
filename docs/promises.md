# Promises: Composition, Aggregation, and Error Propagation

Promises represent deferred values and are the foundation of modern async JavaScript. Mastering creation, chaining, aggregation utilities, and error boundaries prevents subtle production failures.

---

## Introduction

A Promise is a proxy for a value that may be available now, later, or never. **`then`/`catch`/`finally`**, static methods **`Promise.all`**, **`allSettled`**, **`any`**, **`race`**, and the **`async`/`await`** syntax form the standard toolkit for network clients, job queues, and UI data loading.

---

## When to Use

- Wrapping callback APIs once at module boundary
- Composing sequential and parallel async steps
- Expressing error propagation through chains
- Aggregating multiple async results with well-defined failure semantics

---

## When to Avoid

- Promise wrapper around sync code — return value directly
- Nested `.then` when flat chain or async/await reads clearer
- `new Promise` executor with `async` callback — rejection handling bugs
- `Promise.race` for timeouts without aborting underlying work

---

## Best Practices

1. Return Promises from async boundaries; don't mix callback styles
2. Always attach error handling at application boundary
3. Use `Promise.allSettled` for bulk operations reporting per-item status
4. Prefer `async/await` for imperative flow; Promises for libraries
5. Document failure mode: fail-fast vs partial success

---

## Bad Practices

- **Promise constructor antipattern** — wrapping already-Promise values
- Swallowing errors with empty `.catch(() => {})`
- Non-return inside `.then` breaking chain
- Creating new Promise per call without caching when deduplication needed

---

## Creating Promises

### ❌ Bad

```javascript
function fetchUser(id) {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(await api.get(`/users/${id}`));
    } catch (e) {
      reject(e);
    }
  });
}
```

Async executor — rejections may become unhandled.

---

### ✅ Better

```javascript
function fetchUser(id, options) {
  return api.get(`/users/${id}`, options);
}
```

Return the Promise from `api.get` directly — no `new Promise` wrapper.

---

### ✅ Best

```javascript
async function fetchUser(id, options) {
  return api.get(`/users/${id}`, options);
}
```

If already async, return directly — no manual Promise.

---

## Aggregation

### ❌ Bad

```javascript
async function backupAll(databases) {
  const results = [];
  for (const db of databases) {
    try {
      results.push(await backup(db));
    } catch {
      // silent partial failure
    }
  }
  return results;
}
```

---

### ✅ Better

```javascript
async function backupAll(databases) {
  return Promise.allSettled(databases.map((db) => backup(db)));
}
```

---

### ✅ Best

```javascript
async function backupAll(databases) {
  const results = await Promise.allSettled(databases.map((db) => backup(db)));
  const failures = results.filter((r) => r.status === 'rejected');
  if (failures.length) {
    throw new AggregateError(
      failures.map((f) => f.reason),
      'Backup partially failed',
    );
  }
  return results.map((r) => r.value);
}
```

Explicit policy for partial failure with `AggregateError`.

---

## Promise.any and Promise.race

### ❌ Bad

```javascript
const fastest = await Promise.race(endpoints.map(fetchHealth));
// losing requests continue — resource leak
```

---

### ✅ Better

```javascript
async function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms));
  return Promise.race([promise, timeout]);
}
```

Adds timeout but still does not cancel losing fetch — resource may leak.

---

### ✅ Best

```javascript
async function firstHealthyEndpoint(endpoints, { signal } = {}) {
  const controllers = endpoints.map(() => new AbortController());
  signal?.addEventListener('abort', () => controllers.forEach((c) => c.abort()));

  try {
    return await Promise.any(
      endpoints.map((url, i) => fetchHealth(url, { signal: controllers[i].signal })),
    );
  } finally {
    controllers.forEach((c) => c.abort());
  }
}
```

---

## Before / After

### 45. Callback to Promise

**Before:** `function get(url, cb) { ... cb(err, data) }`

**After:** `function get(url) { return fetch(url).then(r => r.json()); }`

### 46. Nested then

**Before:** `.then(a => api.b(a).then(b => api.c(b)))`

**After:** async/await or flat chain with return

### 47. Error swallow

**Before:** `.catch(() => null)`

**After:** `.catch(err => { logger.error(err); throw err; })`

### 48. finally usage

**Before:** duplicate cleanup in then and catch

**After:** `.finally(() => spinner.hide())`

### 49. all vs allSettled

**Before:** `Promise.all` when one failure should not cancel reporting others

**After:** `Promise.allSettled`

### 50. Deferred pattern

**Before:** manual event emitter for one-shot ready

**After:** exported `ready = Promise.withResolvers()` (ES2024) or documented deferred helper

---

## Common Pitfalls

- Forgetting `return` in `.then`
- `throw` in async callback vs sync throw in executor
- `Promise.all([])` resolves immediately to `[]`
- Mixing sync throw and Promise rejection in same API

---

## Performance

- Promise allocation overhead negligible vs I/O
- `allSettled` waits for all — slower wall time than fail-fast `all`
- Debounce duplicate in-flight requests with Map of Promises

---

## References

- [MDN — Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [MDN — Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
- [MDN — Promise.allSettled](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)
- [ECMAScript — Promise Objects](https://tc39.es/ecma262/#sec-promise-objects)
