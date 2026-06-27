# Technical Interview Guide

Structured topics, sample questions, **model answers**, and evaluation rubrics for JavaScript interviews at product engineering companies. Use alongside js-sensei docs for preparation or conducting interviews.

---

## Introduction

Strong interviews assess **reasoning**, **trade-off analysis**, and **production awareness** — not trivia or API memorization. Candidates should explain _why_ a pattern fits, _when_ it does not, and how they would verify behavior in production.

Interviewers: prefer open questions with follow-ups over trick puzzles. Candidates: use MDN and spec language; cite edge cases unprompted.

---

## When to Use This Guide

- Preparing for frontend, backend (Node), or full-stack JavaScript roles
- Building interview loops for your team
- Self-assessment against [introduction.md](./introduction.md) docs index
- Pairing with [code-smells.md](./code-smells.md) for live refactor exercises

---

## When to Avoid

- Treating sample answers as the only correct response
- Whiteboard coding without clarifying requirements first
- Judging candidates on syntax memorization without documentation access
- Single "correct" architecture without business context

---

## Best Practices (Interviewers)

1. State problem constraints explicitly (scale, browser, sync/async)
2. Allow pseudocode; precision matters less than reasoning for senior roles
3. Ask "what would you test?" and "what could go wrong in production?"
4. Use rubrics consistently across candidates
5. Link evaluation to js-sensei topics — not personal style preferences

---

## Bad Practices (Interviewers)

- Trick questions (`typeof null`, obscure spec trivia) as primary filter
- Interrupting before candidate finishes trade-off analysis
- Expecting framework-specific answers for language-focused roles
- No time for candidate questions at end

---

## Junior Level

### Topics

- `const` / `let` / `var`, scope, basic closures
- Array methods (`map`, `filter`, `find`, `some`)
- Promises basics, `async`/`await`
- DOM basics, `fetch`, JSON

### Question 1: `==` vs `===`

**Ask:** Explain the difference. When is either acceptable?

**Strong answer:**

- `===` compares without type coercion — default choice.
- `==` coerces types (`'1' == 1` is true) — surprising bugs.
- Rare intentional use: `value == null` checks both `null` and `undefined`.
- Prefer `===` and explicit checks (`value === null`).

**Weak answer:** "`===" is better" with no explanation of coercion.

**Follow-up:** What is `NaN === NaN`? (false — use `Number.isNaN`.)

---

### Question 2: `var` loop + `setTimeout`

**Ask:** What prints? How do you fix it?

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```

**Strong answer:**

- Prints `3` three times — single function-scoped `i`, shared across callbacks.
- Fix: `let i` (block binding per iteration), or `for...of` with closure factory.
- Reference: [variables.md](./variables.md), [examples/before-after/var-loop-closure.js](../examples/before-after/var-loop-closure.js).

---

### Question 3: Callback to Promise

**Ask:** Wrap `getUser(id, callback)` in Promise-based API.

**Strong answer:**

```javascript
function getUser(id) {
  return new Promise((resolve, reject) => {
    getUserCallback(id, (err, user) => (err ? reject(err) : resolve(user)));
  });
}
// Better: promisify once at module boundary; prefer fs/promises patterns
```

Mention promisify utilities in Node; prefer native Promise APIs when available.

### Junior Rubric

| Signal      | Pass                  | Concern          |
| ----------- | --------------------- | ---------------- |
| Explanation | Own words + edge case | Memorized phrase |
| Reference   | Knows MDN exists      | Guesses behavior |
| Fix quality | `let` / block scope   | Hack without why |

---

## Mid Level

### Topics

- Event loop, microtasks vs macrotasks
- Error handling, custom errors, `cause`
- Module design, dependency injection
- Testing: unit vs integration, mocks vs stubs
- Code smells and refactors

### Question 1: Debounced search with cancellation

**Strong answer:**

- Debounce input (300ms typical) to reduce API calls.
- `AbortController` per request; abort previous on new input.
- Handle `AbortError` separately from real failures.
- Reference: [examples/good/debounced-search.js](../examples/good/debounced-search.js), [async.md](./async.md).

**Trade-offs:** debounce delays last keystroke unless trailing flush on blur.

---

### Question 2: Refactor nested conditionals

**Strong answer:**

- Apply guard clauses / early return.
- Extract predicates (`isEligibleForDiscount(order)`).
- Mention tests before refactor.
- Reference: [examples/before-after/early-return.js](../examples/before-after/early-return.js).

---

### Question 3: Debug memory leak in SPA

**Strong answer:**

1. Reproduce — heap grows after navigation?
2. Chrome DevTools → Memory → heap snapshot diff.
3. Look for detached DOM nodes, listeners not removed, global caches.
4. Fix: `AbortSignal`, teardown hooks, bounded caches.
5. Reference: [memory.md](./memory.md), [debugging.md](./debugging.md).

### Mid Rubric

| Signal     | Pass                       | Concern              |
| ---------- | -------------------------- | -------------------- |
| Trade-offs | Unprompted                 | Single solution      |
| Testing    | Mentions tests             | No verification plan |
| Production | User impact, observability | Code-only answer     |

---

## Senior Level

### Topics

- Architecture boundaries, feature modules
- Performance profiling methodology
- Security (XSS, CSRF, prototype pollution)
- Migrations (CJS→ESM, callbacks→async)
- Team standards and review culture

### Question 1: Checkout service testable without HTTP

**Strong answer:**

```javascript
export function createCheckoutService({ paymentGateway, cartRepository, logger }) {
  return {
    async executeCheckout(cartId, options) {
      const cart = await cartRepository.get(cartId, options);
      const totalCents = calculateCartTotal(cart.items);
      await paymentGateway.charge({ cartId, totalCents }, options);
      await cartRepository.clear(cartId, options);
    },
  };
}
```

- Domain `calculateCartTotal` pure; gateways injected; tests use stubs.
- HTTP only in adapter implementing `paymentGateway`.
- Reference: [architecture.md](./architecture.md), [examples/good/checkout-service.js](../examples/good/checkout-service.js).

---

### Question 2: Module mutates shared config

**Flags:** import side effects, exported mutable singleton, importers share reference.

**Strong answer:**

- Prefer factory + `Object.freeze` or deep clone at bootstrap.
- Config injected, not imported from mutable module.
- Code review checklist item: shared mutable module state.

---

### Question 3: Immutability without GC regression

**Strong answer:**

- Immutable updates allocate — profile hot paths first.
- Use structural sharing (libraries) or mutate locally owned copies only.
- `const` binding ≠ deep freeze.
- Batch updates; avoid deep clone entire state tree every keystroke.

### Senior Rubric

| Signal           | Pass                             | Concern           |
| ---------------- | -------------------------------- | ----------------- |
| Systems thinking | Layers, boundaries               | Single-file focus |
| Unknowns         | States assumptions, verification | Bluffs            |
| Mentoring        | Teaches trade-offs               | Gatekeeps jargon  |

---

## Practical Exercises

| Exercise                            | Skills               | Solution reference                                                |
| ----------------------------------- | -------------------- | ----------------------------------------------------------------- |
| Implement `Promise.all` behavior    | Promises, edge cases | [promises.md](./promises.md)                                      |
| Fix callback hell module            | Async refactor       | [examples/bad/callback-hell.js](../examples/bad/callback-hell.js) |
| Identify smells in 50-line function | Review               | [code-smells.md](./code-smells.md)                                |
| CSRF-safe form submit               | Security             | [security.md](./security.md)                                      |
| Stream parse log file               | Node I/O             | [node.md](./node.md)                                              |

---

## Anti-Patterns in Interviews

- Trick questions with no production relevance
- Requiring memorization without documentation
- One "correct" architecture without context
- Live coding without clarifying requirements
- Not leaving time for candidate questions

---

## Before / After (Interview Mindset)

### Weak candidate pattern

Memorizes API → fails when question rephrased.

### Strong candidate pattern

States assumptions → explains options → picks one with trade-offs → describes tests.

---

## Common Pitfalls

- **Coding before clarifying** — ask about inputs, errors, scale
- **Silent struggle** — think aloud; interviewers help with hints
- **Ignoring edge cases** — empty array, null, network failure
- **Over-engineering** — YAGNI in timed exercises

---

## Performance

Interview loops should be time-boxed. Take-home exercises: cap scope (4–8 hours max) with clear evaluation criteria.

---

## References

- [MDN JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [introduction.md](./introduction.md) — FAQ, glossary, and checklist
- [references.md](./references.md) — books and talks
