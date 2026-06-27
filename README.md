<p align="center">
  <img src="assets/banner.png" alt="js-sensei — Modern JavaScript Engineering Playbook" width="100%" />
</p>

<p align="center">
  <img src="assets/logo.svg" alt="js-sensei logo" width="88" />
</p>

<h1 align="center">js-sensei</h1>

<p align="center">
  <strong>Master modern JavaScript — the way a sensei teaches craft, not shortcuts.</strong>
</p>

<p align="center">
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"><img src="https://img.shields.io/badge/ECMAScript-2024+-F7DF1E?logo=javascript&logoColor=black" alt="ES2024+" /></a>
  <img src="https://img.shields.io/badge/docs-28%20guides-1e293b" alt="28 guides" />
  <img src="https://img.shields.io/badge/examples-70%20runnable-f97316" alt="70 runnable examples" />
</p>

<p align="center">
  <a href="#about">About</a> •
  <a href="#documentation">Docs</a> •
  <a href="#examples">Examples</a> •
  <a href="#getting-started">Start</a>
</p>

---

## About

**js-sensei** is an open-source playbook for writing production-grade JavaScript. Like training under a sensei, the focus is **discipline, clarity, and mastery** — not memorizing syntax from zero.

This repository is for developers who already write JavaScript and want to improve how they design, review, and maintain real codebases.

Every guide explains:

|                   |                                                     |
| ----------------- | --------------------------------------------------- |
| **Why**           | The reasoning behind a pattern                      |
| **When to use**   | Context where it earns its place                    |
| **When to avoid** | Limits and misapplication                           |
| **Trade-offs**    | Impact on readability, maintenance, and performance |

Examples follow **Bad → Better → Best**. The catalog includes **119 Before/After modernizations**, with **70 runnable files** in `examples/before-after/`.

---

## Who This Is For

| Audience             | Use js-sensei to                                                  |
| -------------------- | ----------------------------------------------------------------- |
| Junior developers    | Build strong habits before they become technical debt             |
| Mid-level developers | Deepen async, architecture, and performance thinking              |
| Senior engineers     | Mentor teams and standardize review language                      |
| Engineering teams    | Align on conventions for PRs and design docs                      |
| Interview prep       | Study structured topics in [docs/interview.md](docs/interview.md) |

---

## Documentation

28 guides organized by topic. Start with [docs/introduction.md](docs/introduction.md).

<details>
<summary><strong>Language fundamentals</strong></summary>

| Guide                                   | Topics                                                    |
| --------------------------------------- | --------------------------------------------------------- |
| [introduction.md](docs/introduction.md) | Philosophy, FAQ, glossary, code review checklist          |
| [variables.md](docs/variables.md)       | `const`, `let`, `var`, scope, TDZ, hoisting               |
| [functions.md](docs/functions.md)       | Closures, HOFs, purity, currying, composition, generators |
| [objects.md](docs/objects.md)           | Destructuring, spread, `?.`, `??`, freeze/seal            |
| [arrays.md](docs/arrays.md)             | `map`, `filter`, `reduce`, `toSorted`, `some`, `every`    |
| [strings.md](docs/strings.md)           | Templates, `replaceAll`, Unicode, normalization           |
| [numbers.md](docs/numbers.md)           | Float precision, `BigInt`, `Intl`, safe parsing           |

</details>

<details>
<summary><strong>Async & modules</strong></summary>

| Guide                           | Topics                                                   |
| ------------------------------- | -------------------------------------------------------- |
| [async.md](docs/async.md)       | `async/await`, event loop, microtasks, `AbortController` |
| [promises.md](docs/promises.md) | `all`, `allSettled`, `any`, `race`                       |
| [errors.md](docs/errors.md)     | Custom errors, `cause`, logging strategies               |
| [modules.md](docs/modules.md)   | ESM, dynamic import, module boundaries                   |

</details>

<details>
<summary><strong>Design & quality</strong></summary>

| Guide                                   | Topics                                  |
| --------------------------------------- | --------------------------------------- |
| [architecture.md](docs/architecture.md) | SoC, DI, feature-based structure        |
| [clean-code.md](docs/clean-code.md)     | SRP, KISS, DRY, YAGNI, composition      |
| [code-smells.md](docs/code-smells.md)   | God objects, boolean flags, duplication |
| [patterns.md](docs/patterns.md)         | Strategy, adapter, decorator, factory   |
| [antipatterns.md](docs/antipatterns.md) | `eval`, globals, callback hell          |

</details>

<details>
<summary><strong>Runtime & platform</strong></summary>

| Guide                                 | Topics                                 |
| ------------------------------------- | -------------------------------------- |
| [performance.md](docs/performance.md) | Big-O, memoization, debounce, throttle |
| [memory.md](docs/memory.md)           | Leaks, retention, bounded caches       |
| [browser.md](docs/browser.md)         | DOM, fetch, localStorage, IndexedDB    |
| [node.md](docs/node.md)               | Streams, buffers, worker threads       |
| [security.md](docs/security.md)       | XSS, CSRF, CSP, prototype pollution    |

</details>

<details>
<summary><strong>Workflow & craft</strong></summary>

| Guide                                 | Topics                                      |
| ------------------------------------- | ------------------------------------------- |
| [testing.md](docs/testing.md)         | Unit, integration, E2E, mocks, stubs, spies |
| [debugging.md](docs/debugging.md)     | DevTools, profiling, heap analysis          |
| [tooling.md](docs/tooling.md)         | ESLint, Prettier, CI                        |
| [style-guide.md](docs/style-guide.md) | Formatting and conventions                  |
| [naming.md](docs/naming.md)           | Variables, functions, files                 |
| [comments.md](docs/comments.md)       | When and how to document                    |
| [references.md](docs/references.md)   | MDN, ECMAScript, TC39, books, talks         |
| [interview.md](docs/interview.md)     | Questions, model answers, rubrics           |

</details>

---

## Examples

```text
examples/
├── bad/              # Intentionally wrong — study, do not copy
├── good/             # Recommended production patterns
├── before-after/     # 70 runnable modernizations
└── benchmarks/       # Performance comparisons
```

| Sample                                                             | What it teaches                         |
| ------------------------------------------------------------------ | --------------------------------------- |
| [optional-chaining.js](examples/before-after/optional-chaining.js) | Nested guards → `?.`                    |
| [async-parallel.js](examples/before-after/async-parallel.js)       | `forEach` async pitfall → `Promise.all` |
| [checkout-service.js](examples/good/checkout-service.js)           | DI + async orchestration                |
| [safe-merge.js](examples/before-after/safe-merge.js)               | Prototype pollution prevention          |
| [duplicate-skus.js](examples/benchmarks/duplicate-skus.js)         | O(n²) vs O(n) in practice               |

Full catalog: [examples/before-after/README.md](examples/before-after/README.md)

---

## Getting Started

**Read**

1. [docs/introduction.md](docs/introduction.md) — scope and philosophy
2. Pick a topic from the tables above
3. Open matching files in `examples/before-after/`

**Run locally**

```bash
git clone <your-repo-url>
cd js-sensei
npm install
npm run lint
npm run format:check
```

**Benchmarks**

```bash
node examples/benchmarks/some-vs-filter.js
node examples/benchmarks/duplicate-skus.js
```

---

## Project Structure

```text
js-sensei/
├── README.md
├── package.json
├── eslint.config.js
├── .prettierrc
├── assets/                 # banner.png, logo.svg
├── docs/                   # 28 topic guides
├── examples/
│   ├── bad/
│   ├── good/
│   ├── before-after/
│   └── benchmarks/
└── .github/workflows/      # CI (lint + format)
```

---

## Code Review Checklist

Quick pass before merging. Full version: [introduction.md#code-review-checklist](docs/introduction.md#code-review-checklist).

- [ ] `const` by default; no new `var`
- [ ] Async errors handled; no floating Promises
- [ ] `?.` and `??` where semantically correct
- [ ] No `eval`, unsanitized HTML, or prototype pollution risks
- [ ] Changes explained with Bad / Better / Best when non-trivial

---

## At a Glance

|                              |                     |
| ---------------------------- | ------------------- |
| Documentation guides         | 28                  |
| Before/After catalog entries | 119                 |
| Runnable example files       | 70                  |
| Example pattern              | Bad → Better → Best |
| Target                       | ES2024+             |

---

<p align="center">
  <strong>js-sensei</strong> — train the craft. Ship better JavaScript.<br />
  <sub>Branding inspired by the ninja sensei discipline — mastery through practice.</sub>
</p>
