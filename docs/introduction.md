# Introduction

**js-sensei** is an open-source engineering playbook for writing production-grade JavaScript. It is not a beginner tutorial. It assumes you can read and write JavaScript syntax and focuses on **how experienced teams build, review, and maintain JavaScript in real systems**.

This document defines scope, audience, philosophy, and the resources included in the repository.

---

## Purpose

Modern JavaScript evolves quickly. Frameworks change, but language fundamentals, runtime behavior, and engineering trade-offs persist. js-sensei consolidates:

- Language features with clear usage boundaries
- Architectural patterns for scalable applications
- Code smells and antipatterns seen in production reviews
- Security, performance, and debugging guidance grounded in platform behavior

Every recommendation explains **why** it exists, **when** it applies, **when** it does not, and what you trade off.

---

## Audience

| Audience                  | How to use js-sensei                                                   |
| ------------------------- | ---------------------------------------------------------------------- |
| Junior developers         | Learn conventions before they become habits; use Before/After examples |
| Mid-level developers      | Deepen async, architecture, and performance reasoning                  |
| Senior engineers          | Reference for reviews, mentoring, and interview rubrics                |
| Engineering teams         | Shared vocabulary for PRs and design discussions                       |
| Interviewers / candidates | Structured topics in [interview.md](./interview.md)                    |

---

## When to Use This Playbook

- During **code reviews** to justify feedback with references
- When **modernizing legacy code** (see `examples/before-after/`)
- When **designing modules** and choosing between patterns
- When **debugging** subtle async, memory, or security issues
- When preparing for **technical interviews** at product companies

---

## When to Avoid This Playbook

- You need to learn JavaScript syntax from zero — use MDN's [JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide) first
- You want framework-specific docs — js-sensei is runtime- and language-centric (React, Vue, etc. are out of scope unless illustrating a JS pattern)
- You want copy-paste rules without context — we intentionally explain trade-offs

---

## Philosophy

### Readability Over Cleverness

Code is read far more often than written. Prefer explicit control flow, descriptive names, and small functions over compressed one-liners that require mental parsing.

### Context Over Absolutes

`const` by default is good advice in most codebases, but not a moral law. Document why a mutable `let` is required when you use it.

### Production Over Classroom

Examples resemble authentication flows, payment services, data pipelines, and UI state — not `foo` / `bar` unless illustrating a minimal isolate case.

### Compare Solutions

Each topic presents **Bad**, **Better**, and **Best** variants when multiple approaches exist. Single-solution docs hide the decision process.

---

## Repository Map

| Section    | Documents                                                                                                                                                       |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Language   | [variables](./variables.md), [functions](./functions.md), [objects](./objects.md), [arrays](./arrays.md), [strings](./strings.md), [numbers](./numbers.md)      |
| Asynchrony | [async](./async.md), [promises](./promises.md), [errors](./errors.md), [modules](./modules.md)                                                                  |
| Design     | [architecture](./architecture.md), [clean-code](./clean-code.md), [code-smells](./code-smells.md), [patterns](./patterns.md), [antipatterns](./antipatterns.md) |
| Runtime    | [performance](./performance.md), [memory](./memory.md), [browser](./browser.md), [node](./node.md)                                                              |
| Quality    | [testing](./testing.md), [debugging](./debugging.md), [security](./security.md), [tooling](./tooling.md)                                                        |
| Style      | [style-guide](./style-guide.md), [naming](./naming.md), [comments](./comments.md)                                                                               |
| Meta       | [references](./references.md), [interview](./interview.md)                                                                                                      |

---

## Code Review Checklist

Use this checklist in PRs. Detailed rationale lives in linked docs.

### Language and Style

- [ ] `const` by default; `let` only when rebinding is required; no new `var`
- [ ] Functions are small and single-purpose ([clean-code](./clean-code.md))
- [ ] Names reveal intent ([naming](./naming.md))
- [ ] No magic numbers or unexplained boolean flags ([code-smells](./code-smells.md))

### Correctness

- [ ] Async errors are handled and not swallowed ([errors](./errors.md))
- [ ] Nullish/optional access uses `?.` and `??` appropriately ([objects](./objects.md))
- [ ] Array searches use `some`/`every`/`find` instead of manual loops where clearer ([arrays](./arrays.md))
- [ ] Immutability preferred for shared state ([variables](./variables.md), [objects](./objects.md))

### Security

- [ ] No `eval`, `new Function`, or unsanitized HTML insertion ([security](./security.md))
- [ ] User input validated at boundaries ([security](./security.md))
- [ ] Secrets not committed; env vars used correctly

### Performance

- [ ] No unnecessary sync work on hot paths ([performance](./performance.md))
- [ ] DOM reads/writes batched where relevant ([browser](./browser.md))
- [ ] Large lists consider pagination, virtualization, or streaming ([node](./node.md))

### Testing

- [ ] Behavior covered by appropriate test level ([testing](./testing.md))
- [ ] Edge cases and failure paths tested

---

## FAQ

### Is js-sensei a linter config?

No. ESLint enforces rules; js-sensei explains **reasoning**. Use both together.

### Which JavaScript version does js-sensei target?

ES2024+ with stable platform APIs. Stage-3 proposals are mentioned only when widely shipped.

### TypeScript?

Out of primary scope, but patterns apply. Many teams use TypeScript **with** these practices.

### Can I use this in interviews?

Yes. See [interview.md](./interview.md) for structured topics and rubrics.

### How are "Bad" examples handled?

They live in `examples/bad/` and are excluded from strict lint rules intentionally. Never copy them into production.

---

## Glossary

| Term              | Definition                                                                           |
| ----------------- | ------------------------------------------------------------------------------------ |
| **TDZ**           | Temporal Dead Zone — period where `let`/`const` bindings exist but are uninitialized |
| **HOF**           | Higher-order function — accepts or returns functions                                 |
| **Pure function** | Same inputs always yield same outputs; no observable side effects                    |
| **Microtask**     | Promise callbacks, `queueMicrotask`; runs before next macrotask                      |
| **Macrotask**     | `setTimeout`, I/O callbacks; scheduled on event loop turns                           |
| **Reflow**        | Layout recalculation after DOM/geometry changes                                      |
| **XSS**           | Cross-site scripting — injecting executable scripts via untrusted input              |
| **SRP**           | Single Responsibility Principle — one reason to change per unit                      |
| **DI**            | Dependency Injection — supplying dependencies from outside a module                  |

Full glossary extensions appear throughout individual documents.

---

## Recommended Resources

### Official

- [MDN JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [ECMAScript Specification](https://tc39.es/ecma262/)
- [TC39 Proposals](https://github.com/tc39/proposals)
- [web.dev](https://web.dev/)

### Books

- _Eloquent JavaScript_ (Marijn Haverbeke) — deep language understanding
- _You Don't Know JS_ series (Kyle Simpson) — mechanics and scope
- _JavaScript: The Good Parts_ (Douglas Crockford) — historical context; read critically
- _Clean Code_ (Robert C. Martin) — principles applicable beyond JS

### Talks

- "What the heck is the event loop anyway?" — Philip Roberts
- "A Tale of Two Codebases" — various conference talks on maintainability
- Chrome DevTools performance/memory sessions (Google I/O)

### Open Source Repositories to Study

- [nodejs/node](https://github.com/nodejs/node) — runtime and libuv integration
- [lodash/lodash](https://github.com/lodash/lodash) — utility API design (evaluate tree-shaking trade-offs)
- [expressjs/express](https://github.com/expressjs/express) — middleware composition
- [vitest-dev/vitest](https://github.com/vitest-dev/vitest) — modern test runner architecture

---

## References

- [MDN — JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [ECMAScript Language Specification](https://tc39.es/ecma262/)
- [TC39 Process](https://tc39.es/process-document/)
- [web.dev — Learn JavaScript](https://web.dev/learn/javascript)
