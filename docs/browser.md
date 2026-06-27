# Browser: DOM, Rendering, Fetch, and Storage

Client-side JavaScript interacts with the DOM, rendering pipeline, network, and storage APIs. Efficient, secure usage improves UX and prevents layout thrashing, memory leaks, and data exposure.

---

## Introduction

The browser parses HTML into a DOM tree, applies CSS, and produces render trees for painting. JavaScript runs primarily on the **main thread**, so expensive synchronous work blocks input and animation. APIs such as **Fetch**, **localStorage**, **sessionStorage**, and **IndexedDB** extend the platform for network and persistence — each with distinct security and performance characteristics.

Understanding **reflow** (layout), **repaint** (pixels), and **composite** (GPU layers) helps you diagnose jank. Understanding storage boundaries prevents token leakage and quota errors.

---

## When to Use

| API / Technique             | Use when                                                 |
| --------------------------- | -------------------------------------------------------- |
| **Fetch + AbortController** | HTTP from the client with cancellation                   |
| **Event delegation**        | Dynamic lists with many similar handlers                 |
| **DocumentFragment**        | Batch DOM inserts to reduce reflows                      |
| **sessionStorage**          | Tab-scoped wizard state, form drafts                     |
| **localStorage**            | Small, non-sensitive UI preferences                      |
| **IndexedDB**               | Large offline datasets, binary blobs, structured records |
| **requestAnimationFrame**   | Visual updates tied to display refresh                   |

---

## When to Avoid

- **localStorage** for auth tokens or PII — readable by any script on the origin (XSS risk)
- **Synchronous layout reads** inside write loops (layout thrashing)
- **innerHTML** with untrusted or partially trusted strings
- **document.write** — blocks parsing; legacy only
- **IndexedDB** for tiny key-value prefs — overhead exceeds benefit
- **Polling** when WebSockets or SSE fit the use case

---

## Best Practices

1. Batch DOM reads, then batch writes ([performance.md](./performance.md))
2. Prefer `textContent` or vetted sanitizers over raw HTML insertion
3. Propagate `AbortSignal` through fetch chains ([async.md](./async.md))
4. Use event delegation for lists that re-render frequently
5. Wrap storage access in small modules with JSON parse error handling
6. Measure with Performance panel before micro-optimizing selectors

---

## Bad Practices

- Querying the DOM inside tight loops on every iteration
- Attaching a new listener per list item on each render
- Ignoring `storage` event for cross-tab preference sync when needed
- Storing large JSON blobs in localStorage (5MB limit, sync API blocks main thread)
- Assuming `fetch` throws on HTTP 4xx/5xx — it only throws on network failure

---

## DOM Updates and Rendering

### ❌ Bad

```javascript
for (const item of items) {
  const height = list.offsetHeight; // read — forces layout
  row.style.height = `${height / items.length}px`; // write
}
```

Interleaved read/write forces the browser to recalculate layout repeatedly.

---

### ✅ Better

```javascript
const height = list.offsetHeight;
const rowHeight = height / items.length;
for (const row of rows) {
  row.style.height = `${rowHeight}px`;
}
```

Single read phase, then write phase.

---

### ✅ Best

```javascript
function distributeRowHeights(list, rows) {
  const { height } = list.getBoundingClientRect();
  const rowHeight = height / rows.length;

  const fragment = document.createDocumentFragment();
  for (const row of rows) {
    row.style.height = `${rowHeight}px`;
    fragment.appendChild(row);
  }
  list.appendChild(fragment);
}
```

Batch DOM mutation off the live tree when inserting many nodes. **Limitation:** extra complexity for small lists — use when inserting 20+ nodes or profiling shows reflow cost.

---

## Fetch API

### ❌ Bad

```javascript
async function loadOrders(userId) {
  const res = await fetch(`/api/orders?userId=${userId}`);
  return res.json(); // throws on invalid JSON; ignores HTTP errors
}
```

---

### ✅ Better

```javascript
async function loadOrders(userId) {
  const res = await fetch(`/api/orders?userId=${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error(`Orders failed: ${res.status}`);
  return res.json();
}
```

---

### ✅ Best

```javascript
async function loadOrders(userId, { signal } = {}) {
  const res = await fetch(`/api/orders?userId=${encodeURIComponent(userId)}`, {
    signal,
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new HttpError(res.status, body);
  }
  return res.json();
}
```

Cancellation, encoding, explicit Accept header, structured errors ([errors.md](./errors.md)).

---

## Web Storage (localStorage / sessionStorage)

### ❌ Bad

```javascript
localStorage.setItem('accessToken', token);
localStorage.setItem('cart', JSON.stringify(cart)); // large, sync, no schema
```

Tokens in localStorage are stealable via XSS. Large carts belong in IndexedDB or server state.

---

### ✅ Better

```javascript
sessionStorage.setItem('checkout.step', String(step));
```

Tab-scoped, ephemeral UI state only.

---

### ✅ Best

```javascript
const STORAGE_KEY = 'app:preferences';

export function loadPreferences() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PREFERENCES, ...parsed };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(prefs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}
```

Centralized module, defaults, parse guard. **When NOT to use:** secrets — use HttpOnly cookies ([security.md](./security.md)).

---

## IndexedDB

### ❌ Bad

Loading entire catalog into memory on every page load via fetch with no offline fallback.

---

### ✅ Better

Cache API + static assets for simple offline shell.

---

### ✅ Best

```javascript
export function openCatalogDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('catalog', 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('products')) {
        db.createObjectStore('products', { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function putProducts(db, products) {
  const tx = db.transaction('products', 'readwrite');
  const store = tx.objectStore('products');
  for (const product of products) store.put(product);
  return tx.complete;
}
```

Structured offline storage for large product lists. **Trade-off:** verbose API — wrap in a small repository module.

---

## Event Delegation

### ❌ Bad

```javascript
items.forEach((item) => {
  item.addEventListener('click', () => handleSelect(item.id));
});
```

N listeners; must re-bind when list re-renders.

---

### ✅ Best

```javascript
list.addEventListener('click', (event) => {
  const row = event.target.closest('[data-product-id]');
  if (!row || !list.contains(row)) return;
  handleSelect(row.dataset.productId);
});
```

One listener survives DOM child replacement.

---

## Before / After

### 99. DOM query in loop

**Before:** `document.querySelector('#x')` each iteration  
**After:** cache element reference once

### 100. Event delegation

**Before:** listener on every list item  
**After:** `list.addEventListener('click', ...)` + `closest('[data-id]')`

### 101. classList

**Before:** `el.className += ' active'`  
**After:** `el.classList.add('active')`

### 102. createElement vs innerHTML

**Before:** `innerHTML` for nodes with user text  
**After:** `createElement` + `textContent`

---

## Common Pitfalls

- **fetch does not reject on 404** — always check `response.ok`
- **localStorage is synchronous** — large serializations block the main thread
- **sessionStorage clears on tab close** — not durable persistence
- **Detached DOM nodes** retained in closures cause memory leaks ([memory.md](./memory.md))
- **Cross-origin fetch** requires CORS; cookies need `credentials: 'include'` when intentional

---

## Performance

- Reflow cost dominates many UI bottlenecks — batch reads/writes
- `querySelector` on `document` is slower than scoped `element.querySelector`
- IndexedDB is async but transactions have overhead — batch writes
- Use `content-visibility` and virtualization for long lists ([web.dev](https://web.dev/articles/content-visibility))

---

## References

- [MDN — Document Object Model](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
- [MDN — Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [MDN — Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [MDN — IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [web.dev — Rendering performance](https://web.dev/articles/rendering-performance)
- [web.dev — IndexedDB](https://web.dev/articles/indexeddb)
