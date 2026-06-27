# Architecture: Separation of Concerns and Modular Design

Software architecture in JavaScript applications determines how teams scale features, test behavior, and replace infrastructure without rewriting domain logic.

---

## Introduction

Effective architectures **separate concerns**: UI, application services, domain rules, and infrastructure (HTTP, database, cache). **Dependency injection**, **layered** and **feature-based** structures trade initial setup cost for long-term velocity.

---

## When to Use

- **Feature-based folders** — product teams owning vertical slices
- **Layered boundaries** — strict domain free of DOM/fetch
- **Dependency injection** — pass `logger`, `httpClient`, `clock` into services
- **Ports and adapters** — swap implementations in tests

---

## When to Avoid

- Layers for layers' sake in tiny scripts
- DI frameworks when constructor params suffice
- Micro-frontends before team/org scale justifies complexity
- Abstract factories before second implementation exists (YAGNI)

---

## Best Practices

1. Domain logic pure and framework-agnostic
2. Infrastructure at edges; validate at boundaries
3. Explicit module public APIs
4. Feature flags and config injected, not imported globally
5. Document dependency direction (domain never imports UI)

---

## Bad Practices

- God services importing half the codebase
- Business rules in React components / route handlers only
- Shared mutable singletons for app state
- Cross-feature imports bypassing public API

---

## Separation of Concerns

### ❌ Bad

```javascript
// CheckoutButton.jsx
async function handleClick() {
  const cart = JSON.parse(localStorage.getItem('cart'));
  const total = cart.items.reduce((s, i) => s + i.price * i.qty, 0);
  const res = await fetch('/api/charge', { method: 'POST', body: JSON.stringify({ total }) });
  if (!res.ok) alert('failed');
  localStorage.removeItem('cart');
}
```

UI, storage, pricing, and payment coupled.

---

### ✅ Better

```javascript
async function handleClick() {
  const cart = cartRepository.load();
  await checkoutService.executeCheckout(cart);
}
```

Extract service call — component no longer knows payment HTTP details.

---

### ✅ Best

```javascript
// domain/calculateCartTotal.js
export function calculateCartTotal(items) {
  /* pure */
}

// application/checkoutService.js
export function createCheckoutService({ paymentGateway, cartRepository }) {
  return {
    async executeCheckout(cartId) {
      const cart = await cartRepository.get(cartId);
      const total = calculateCartTotal(cart.items);
      await paymentGateway.charge({ cartId, totalCents: total });
      await cartRepository.clear(cartId);
    },
  };
}
```

Component calls service; tests mock gateways.

---

## Dependency Injection

### ❌ Bad

```javascript
import { fetch } from 'undici';
export async function syncInventory() {
  return fetch(process.env.API_URL).then((r) => r.json());
}
```

Hard to test without network.

---

### ✅ Better

```javascript
export async function syncInventory(apiUrl = process.env.API_URL) {
  const res = await fetch(apiUrl);
  return res.json();
}
```

URL injectable in tests — still couples to global `fetch`.

---

### ✅ Best

```javascript
export function createInventorySync({ httpClient, baseUrl, logger }) {
  return {
    async sync() {
      const data = await httpClient.get(`${baseUrl}/inventory`);
      logger.info({ count: data.length, event: 'inventory.synced' });
      return data;
    },
  };
}
```

---

## Before / After

### 62. Config import

**Before:** `import config from '../config'` everywhere

**After:** inject config into factories at bootstrap

### 63. Date/time

**Before:** `Date.now()` inside domain logic

**After:** inject `clock.now()` for testable time

### 64. Randomness

**Before:** `Math.random()` in ID generation inside domain

**After:** inject `idGenerator` interface

### 65. Feature folder

**Before:** `components/UserList`, `api/users`, `hooks/useUsers` scattered

**After:** `features/users/{components,api,hooks,services}`

### 66. Route handler logic

**Before:** 200-line Express route

**After:** route validates input → calls application service → maps result to HTTP

---

## Common Pitfalls

- **Anemic domain** — services are CRUD only
- **Leaky abstraction** — ORM entities exposed to UI
- **Circular feature dependencies** — extract shared kernel to `shared/`

---

## Performance

- Modular code enables lazy loading routes/features
- Over-abstraction adds indirection — measure bundle and call depth

---

## References

- [MDN — JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [web.dev — Application architecture](https://web.dev/explore/architecture)
- Martin Fowler — Patterns of Enterprise Application Architecture (conceptual)
