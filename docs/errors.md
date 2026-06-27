# Error Handling: try/catch, Custom Errors, and Cause

Robust JavaScript systems treat errors as expected control flow at boundaries while failing fast in domain logic. Structured error types, **`Error.cause`**, stack traces, and logging strategies separate debuggable production services from silent failures.

---

## Introduction

Errors propagate through sync call stacks and async Promise chains differently. **`try/catch`**, **`throw`**, custom **`Error` subclasses**, and the **`cause`** option (ES2022) enable rich context without losing original failures.

---

## When to Use

- **`try/catch`** around await boundaries and JSON parsing
- **Custom errors** for domain failures (`PaymentDeclinedError`, `ValidationError`)
- **`cause`** when wrapping lower-level errors at layer boundaries
- **Result types** (disciplined teams) for expected failures vs exceptions

---

## When to Avoid

- try/catch around every line — obscures flow
- Throwing strings or plain objects — breaks stack traces
- Catching and rethrowing without adding context
- Using errors for normal control flow in hot paths

---

## Best Practices

1. Throw `Error` instances (or subclasses) only
2. Add `cause` when translating errors across layers
3. Log once at boundary; don't log and rethrow same error repeatedly
4. Include machine-readable `code` fields for API clients
5. Preserve async stack traces (`Error.captureStackTrace` in Node when useful)

---

## Bad Practices

- Empty catch blocks
- Generic `catch (e) { return null }` hiding bugs
- Leaking internal stack traces to clients
- `throw undefined`

---

## try/catch and async

### ❌ Bad

```javascript
async function chargeCard(payment) {
  try {
    await gateway.charge(payment);
  } catch (e) {
    return false; // caller cannot distinguish decline vs network vs bug
  }
}
```

---

### ✅ Better

```javascript
async function chargeCard(payment) {
  try {
    await gateway.charge(payment);
  } catch (error) {
    throw new PaymentError('Card charge failed', { cause: error, paymentId: payment.id });
  }
}
```

---

### ✅ Best

```javascript
class PaymentError extends Error {
  constructor(message, { cause, code = 'PAYMENT_FAILED', paymentId } = {}) {
    super(message, { cause });
    this.name = 'PaymentError';
    this.code = code;
    this.paymentId = paymentId;
  }
}

async function chargeCard(payment) {
  try {
    return await gateway.charge(payment);
  } catch (error) {
    if (error.code === 'card_declined') {
      throw new PaymentError('Card declined', {
        cause: error,
        code: 'CARD_DECLINED',
        paymentId: payment.id,
      });
    }
    throw new PaymentError('Payment gateway error', { cause: error, paymentId: payment.id });
  }
}
```

---

## Logging Strategies

### ❌ Bad

```javascript
catch (e) {
  console.log(e);
  console.log(e);
  throw e;
}
```

Duplicate logs across layers.

---

### ✅ Better

```javascript
catch (error) {
  logger.error({ err: error, event: 'charge.failed' });
  throw error; // single log, rethrow for outer handler
}
```

Log once at boundary where context is richest; avoid duplicate logs at every layer.

---

### ✅ Best

Log at outermost handler with structured fields:

```javascript
logger.error({
  err: error,
  requestId,
  userId,
  event: 'checkout.charge_failed',
});
```

Use [Error logging libraries](https://nodejs.org/api/util.html#utilinspect) that serialize `cause` chains.

---

## Before / After

### 51. Throw strings

**Before:** `throw 'not found';`

**After:** `throw new NotFoundError('User not found', { userId });`

### 52. Error cause

**Before:** `throw new Error(\`Failed: ${original.message}\`);`

**After:** `throw new Error('Failed to parse config', { cause: original });`

### 53. JSON parse

**Before:** unguarded `JSON.parse`

**After:** try/catch with `SyntaxError` wrapping

### 54. finally for resources

**Before:** close in try and catch separately

**After:** `try { ... } finally { await release(); }`

### 55. Aggregate errors

**Before:** throw first error only from batch

**After:** `throw new AggregateError(errors, 'Batch failed');`

### 56. Optional chaining on error

**Before:** `if (err && err.response && err.response.status)`

**After:** `err.response?.status`

---

## Common Pitfalls

- **Unhandled promise rejection** in event handlers
- **catch (e)** typed as unknown in TS; in JS assume anything
- **Stack trace** lost when throwing non-Error
- **Domain errors** vs programmer errors — different handling policies

---

## Performance

- try/catch in sync hot loops — historically costly; modern engines improved; still avoid using exceptions for flow control

---

## References

- [MDN — try...catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)
- [MDN — Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- [MDN — Error.cause](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause)
- [ECMAScript — ECMAScript Language: Errors](https://tc39.es/ecma262/#sec-error-objects)
