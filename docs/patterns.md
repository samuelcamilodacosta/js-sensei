# Patterns for Production JavaScript

Design patterns document recurring solutions with known trade-offs. In JavaScript, prefer **functions and modules** over ceremony unless objects clarify stateful lifecycles.

---

## Introduction

Patterns like **Factory**, **Strategy**, **Adapter**, **Decorator**, **Module**, and **Observer** appear constantly in production codebases — often as plain functions rather than classes. This guide maps pattern **intent** to idiomatic ES2024 JavaScript and explains when each pattern earns its complexity.

---

## When to Use

| Pattern       | Use when                                                            |
| ------------- | ------------------------------------------------------------------- |
| **Factory**   | Object creation requires defaults, validation, or dependency wiring |
| **Strategy**  | Algorithm varies by type/config (pricing, export, tax rules)        |
| **Adapter**   | Third-party API shape differs from internal domain model            |
| **Decorator** | Cross-cutting behavior wraps core logic (retry, log, timing)        |
| **Module**    | Private state via closure or ESM scope                              |
| **Observer**  | Multiple subscribers react to domain events                         |

---

## When to Avoid

- Applying patterns before a second use case exists (YAGNI)
- Class hierarchies when a function map suffices
- Observer networks without unsubscribe/cleanup discipline
- Abstract factories for single-implementation modules

---

## Best Practices

1. Name patterns by problem solved, not Gang-of-Four label in code comments
2. Keep factories pure at the boundary; inject I/O dependencies
3. Prefer composition of functions over deep inheritance
4. Document failure modes in strategy maps (unknown key handling)
5. Test adapters with recorded fixtures from legacy APIs

---

## Bad Practices

- Strategy maps with 50 inline anonymous functions — extract named functions
- Decorators that hide errors or swallow stack traces
- Global observer buses with no ownership
- Adapter that leaks legacy types into domain layer

---

## Strategy (Function Map)

### ❌ Bad

```javascript
async function checkout(cart, paymentMethod) {
  if (paymentMethod === 'card') {
    // 40 lines...
  } else if (paymentMethod === 'wallet') {
    // 40 lines...
  } else if (paymentMethod === 'invoice') {
    // 40 lines...
  }
}
```

Each branch duplicates structure; adding a method edits a giant function.

---

### ✅ Better

```javascript
async function checkout(cart, paymentMethod) {
  if (paymentMethod === 'card') return chargeCard(cart);
  if (paymentMethod === 'wallet') return chargeWallet(cart);
  if (paymentMethod === 'invoice') return chargeInvoice(cart);
  throw new RangeError(`Unsupported method: ${paymentMethod}`);
}
```

Named functions extracted — still linear dispatch.

---

### ✅ Best

```javascript
const paymentStrategies = {
  card: chargeCard,
  wallet: chargeWallet,
  invoice: chargeInvoice,
};

export async function checkout(cart, method) {
  const pay = paymentStrategies[method];
  if (!pay) throw new RangeError(`Unsupported method: ${method}`);
  return pay(cart);
}
```

Open for extension by adding map entries. **When NOT to use:** single payment path — call function directly.

---

## Adapter

### ❌ Bad

```javascript
async function getUser(id) {
  const raw = await legacyApi.fetch_customer(id);
  // legacy fields used throughout UI
  return raw;
}
```

---

### ✅ Better

```javascript
async function getUser(id) {
  const raw = await legacyApi.fetch_customer(id);
  return {
    id: raw.customer_id,
    email: raw.email_address,
    name: raw.full_name,
  };
}
```

---

### ✅ Best

```javascript
export function createLegacyUserAdapter(legacyApi) {
  return {
    async getUser(id) {
      const raw = await legacyApi.fetch_customer(id);
      return mapLegacyCustomer(raw);
    },
  };
}

function mapLegacyCustomer(raw) {
  return { id: raw.customer_id, email: raw.email_address, name: raw.full_name };
}
```

Legacy API isolated; mapping testable without network. Swap adapter when API migrates.

---

## Decorator (Higher-Order Function)

### ❌ Bad

```javascript
async function fetchOrders() {
  console.log('start');
  try {
    const data = await api.get('/orders');
    console.log('done');
    return data;
  } catch (e) {
    console.log('fail', e);
    throw e;
  }
}
```

Logging duplicated on every function.

---

### ✅ Better

```javascript
function withLogging(fn, name) {
  return async (...args) => {
    logger.info({ event: `${name}.start` });
    try {
      const result = await fn(...args);
      logger.info({ event: `${name}.success` });
      return result;
    } catch (error) {
      logger.error({ event: `${name}.error`, error });
      throw error;
    }
  };
}
```

---

### ✅ Best

```javascript
function withRetry(fn, { attempts = 3, delayMs = 100 } = {}) {
  return async (...args) => {
    let lastError;
    for (let i = 0; i < attempts; i++) {
      try {
        return await fn(...args);
      } catch (error) {
        lastError = error;
        if (i < attempts - 1) {
          await new Promise((r) => setTimeout(r, delayMs * 2 ** i));
        }
      }
    }
    throw lastError;
  };
}

export const fetchOrders = withRetry(withLogging(_fetchOrders, 'fetchOrders'));
```

Composable decorators. **Limitation:** stack traces show wrapper frames — acceptable for infrastructure code.

---

## Factory

### ❌ Bad

```javascript
export const db = connect(process.env.DB_URL); // side effect on import
```

---

### ✅ Best

```javascript
export function createUserRepository({ db, logger }) {
  return {
    async findById(id) {
      logger.debug({ event: 'user.find', id });
      return db.query('SELECT * FROM users WHERE id = $1', [id]);
    },
  };
}
```

Explicit wiring in bootstrap ([architecture.md](./architecture.md)).

---

## Before / After

### 79. Singleton abuse

**Before:** `Database.instance` global  
**After:** bootstrap wires single instance into factories

### 80. Builder overkill

**Before:** Builder for 3 fields  
**After:** plain object + `validateUser(input)`

### 81. Event emitter

**Before:** custom pub/sub  
**After:** `EventTarget` or narrow domain events module

### 82. Null object

**Before:** `if (logger) logger.info(...)` everywhere  
**After:** `noopLogger` default

---

## Common Pitfalls

- **Strategy map** with async functions — remember to await
- **Decorator order** matters: retry(logging(fn)) vs logging(retry(fn))
- **Observer memory leaks** — always provide unsubscribe
- **Over-patterning** — functions alone often suffice

---

## Performance

- Indirection through decorators adds negligible overhead vs I/O
- Large strategy maps — O(1) lookup; prefer over long switch if branches are independent
- Observer fan-out — slow handlers block others; consider async queue

---

## References

- [MDN — Inheritance and the prototype chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
- [MDN — Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [ECMAScript Specification](https://tc39.es/ecma262/)
- Gang of Four — _Design Patterns_ (conceptual reference)
