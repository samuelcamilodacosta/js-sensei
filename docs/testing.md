# Testing: Unit, Integration, E2E, Mocks, Stubs, and Spies

Testing strategy balances confidence, speed, and maintainability. JavaScript projects combine **unit** tests for pure logic, **integration** tests for real boundaries, and **E2E** tests for critical user journeys — each level catches different failure classes.

---

## Introduction

Test doubles isolate the **system under test**:

- **Stub** — returns canned data; no behavior verification
- **Spy** — wraps real function; records calls
- **Mock** — pre-programmed expectations; fails if interaction differs

Over-mocking creates brittle tests that break on refactor without behavior change. Prefer real implementations for pure code; fake at I/O boundaries.

---

## When to Use

| Level           | Use when                                            |
| --------------- | --------------------------------------------------- |
| **Unit**        | Pure functions, pricing rules, validators           |
| **Integration** | Repository + test DB, HTTP handler + app            |
| **E2E**         | Login, checkout, payment — revenue paths            |
| **Stub**        | External API unavailable in CI                      |
| **Spy**         | Verify analytics fired without blocking side effect |
| **Mock**        | Assert email service called with correct payload    |

---

## When to Avoid

- Mocking every dependency in unit tests
- E2E for all edge cases — slow, flaky, expensive
- Testing private functions directly
- Shared mutable state between tests without reset
- Snapshot testing huge UI trees without review discipline

---

## Best Practices

1. **Arrange-Act-Assert** structure in every test
2. One logical behavior per test; multiple expects ok if same behavior
3. Factory functions for test data (`createOrder`, `createUser`)
4. Reset mocks in `afterEach`; use `vi.restoreAllMocks()`
5. Fake timers for debounce/throttle/time-dependent code
6. Test failure paths — not only happy path

---

## Bad Practices

- Tests with no assertions
- Asserting internal call order when output suffices
- `setTimeout` waits instead of `await` + fake timers
- Flaky tests tolerated without quarantine/fix
- Testing implementation details (private method spy counts)

---

## Unit Test

### ❌ Bad

```javascript
test('processOrder', () => {
  processOrder(mockOrder); // no assertion — always passes
});
```

---

### ✅ Better

```javascript
test('processOrder returns total', () => {
  const total = calculateTotal(createOrder({ subtotal: 100_00 }));
  expect(total).toBe(100_00);
});
```

---

### ✅ Best

```javascript
describe('calculateTotal', () => {
  test('applies discount before tax', () => {
    const order = createOrder({ subtotal: 100_00, discountPercent: 10, taxRate: 0 });
    expect(calculateTotal(order)).toBe(90_00);
  });

  test('throws when subtotal negative', () => {
    expect(() => calculateTotal(createOrder({ subtotal: -1 }))).toThrow(RangeError);
  });
});
```

Table-driven tests for multiple cases; edge cases explicit.

---

## Stub vs Spy vs Mock

### Stub (returns fixed data)

```javascript
const userRepo = {
  findById: async () => ({ id: '1', name: 'Ada', email: 'ada@example.com' }),
};

test('greeting uses repository name', async () => {
  const service = createGreetingService({ userRepo });
  await expect(service.greet('1')).resolves.toBe('Hello, Ada');
});
```

---

### Spy (records calls, optional real implementation)

```javascript
import { vi } from 'vitest';

test('analytics tracks signup', async () => {
  const analytics = { track: vi.fn() };
  await registerUser(validInput, { analytics });
  expect(analytics.track).toHaveBeenCalledWith('user.registered', expect.any(Object));
});
```

---

### Mock (strict interaction contract)

```javascript
test('welcome email sent on register', async () => {
  const mailer = { send: vi.fn().mockResolvedValue({ id: 'msg-1' }) };
  await registerUser(validInput, { mailer });
  expect(mailer.send).toHaveBeenCalledOnce();
  expect(mailer.send).toHaveBeenCalledWith(
    expect.objectContaining({ to: validInput.email, template: 'welcome' }),
  );
});
```

Use mocks when **collaboration** is the behavior under test. Prefer stubs when only return value matters.

---

## Integration Test

### ✅ Best

```javascript
test('POST /orders creates order in database', async () => {
  const app = createApp({ db: testDb });
  const res = await request(app)
    .post('/orders')
    .send({ items: [{ sku: 'A1', qty: 2 }] })
    .expect(201);

  const row = await testDb.query('SELECT * FROM orders WHERE id = $1', [res.body.id]);
  expect(row.rows[0].status).toBe('pending');
});
```

Real DB (test container or sqlite); verifies wiring, not mocks.

---

## E2E

Reserve for critical paths: authentication, payment, data export. Run fewer, slower, in CI nightly or pre-release — not on every keystroke.

---

## Before / After

### 106. Test implementation

**Before:** `expect(service._internalCache.size).toBe(1)`  
**After:** assert public API output

### 107. Flaky timeout

**Before:** `await new Promise(r => setTimeout(r, 1000))`  
**After:** `vi.useFakeTimers(); await vi.runAllTimersAsync()`

---

## Common Pitfalls

- **Mocking Date** globally without restore — breaks other tests
- **Order-dependent tests** — run isolated with `describe` + clean db
- **Testing third-party libraries** — trust them; test your usage
- **Coverage as goal** — 100% coverage with weak asserts misleads

---

## Performance

- Unit tests: milliseconds each — run thousands per CI minute
- Integration: use transactions rolled back per test for speed
- E2E: parallelize sharded suites; avoid serial bottleneck

---

## References

- [MDN — Testing](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing)
- [Vitest — Mocking](https://vitest.dev/guide/mocking.html)
- [Node.js — Test runner](https://nodejs.org/api/test.html)
- [web.dev — Testing strategies](https://web.dev/explore/testing)
