# Before / After Catalog

This catalog indexes **119 modernization examples** distributed across js-sensei documentation and runnable samples. Each entry shows legacy patterns evolved to modern JavaScript (ES2024+).

## Usage

1. Find examples by number or topic below
2. Read the linked document for Bad / Better / Best context
3. Run samples in `examples/before-after/` where available

---

## Variables & Scope (1–5)

| #   | Before                                             | After                          | Doc                               |
| --- | -------------------------------------------------- | ------------------------------ | --------------------------------- |
| 1   | `user && user.profile && user.profile.displayName` | `user?.profile?.displayName`   | [variables](../docs/variables.md) |
| 2   | `options.limit !== undefined ? options.limit : 50` | `options.limit ?? 50`          | variables                         |
| 3   | `var tmp` swap pattern                             | `[a, b] = [b, a]`              | variables                         |
| 4   | `counter = 0` implicit global                      | `const counter = 0` in closure | variables                         |
| 5   | `for (var i...)` leak                              | `findIndex` / `for...of`       | variables                         |

## Functions (6–10)

| #   | Before                       | After                           | Doc                               |
| --- | ---------------------------- | ------------------------------- | --------------------------------- |
| 6   | Anonymous complex filter     | Named predicate `isActiveAdmin` | [functions](../docs/functions.md) |
| 7   | `limit = limit \|\| 50`      | `limit = 50` default param      | functions                         |
| 8   | `Array.from(arguments)`      | Rest `...args`                  | functions                         |
| 9   | `user && user.profile` arrow | `user?.profile?.name`           | functions                         |
| 10  | IIFE async bootstrap         | Top-level await (ESM)           | functions                         |

## Objects (11–18)

| #   | Before                         | After                      | Doc                           |
| --- | ------------------------------ | -------------------------- | ----------------------------- |
| 11  | Nested `&&` property checks    | Optional chaining          | [objects](../docs/objects.md) |
| 12  | `config.timeout != null ? ...` | Destructuring default      | objects                       |
| 13  | Manual field rename            | Destructure rename         | objects                       |
| 14  | Manual omit clone              | Rest destructure           | objects                       |
| 15  | Detached method call           | Bound method / direct call | objects                       |
| 16  | `hasOwnProperty`               | `Object.hasOwn`            | objects                       |
| 17  | `Object.assign({}, a, b)`      | Spread merge               | objects                       |
| 18  | `o[key] = v` two-step          | Computed property          | objects                       |

## Arrays (19–26)

| #   | Before                           | After            | Doc                         |
| --- | -------------------------------- | ---------------- | --------------------------- |
| 19  | `filter(...)[0]`                 | `find`           | [arrays](../docs/arrays.md) |
| 20  | `filter valid length === length` | `every`          | arrays                      |
| 21  | `map().flat()`                   | `flatMap`        | arrays                      |
| 22  | `indexOf !== -1`                 | `includes`       | arrays                      |
| 23  | `splice` mutate                  | `toSpliced`      | arrays                      |
| 24  | Manual unique loop               | `Set`            | arrays                      |
| 25  | Nested loop group                | `Object.groupBy` | arrays                      |
| 26  | Manual chunk loop                | `chunk()` helper | arrays                      |

## Strings (27–32)

| #   | Before                  | After                       | Doc                           |
| --- | ----------------------- | --------------------------- | ----------------------------- |
| 27  | `replace` single        | `replaceAll`                | [strings](../docs/strings.md) |
| 28  | String concat multiline | Template literal            | strings                       |
| 29  | Manual zero pad loop    | `padStart`                  | strings                       |
| 30  | Regex trim              | `trim()`                    | strings                       |
| 31  | `indexOf(prefix) === 0` | `startsWith`                | strings                       |
| 32  | Sort without locale     | `localeCompare` with locale | strings                       |

## Numbers (33–38)

| #   | Before                   | After                    | Doc                           |
| --- | ------------------------ | ------------------------ | ----------------------------- |
| 33  | `isNaN(x)`               | `Number.isNaN(x)`        | [numbers](../docs/numbers.md) |
| 34  | `parseInt(s)`            | `Number.parseInt(s, 10)` | numbers                       |
| 35  | `typeof n === 'number'`  | `Number.isFinite(n)`     | numbers                       |
| 36  | Manual currency string   | `Intl.NumberFormat`      | numbers                       |
| 37  | `Math.random` for tokens | `crypto.getRandomValues` | numbers                       |
| 38  | Inline clamp             | Named `clamp()`          | numbers                       |

## Async & Promises (39–50)

| #   | Before                     | After                   | Doc                             |
| --- | -------------------------- | ----------------------- | ------------------------------- |
| 39  | `forEach(async ...)`       | `Promise.all(map)`      | [async](../docs/async.md)       |
| 40  | `.then` catch chains       | `try/catch` async       | async                           |
| 41  | Sequential await loop      | `Promise.all`           | async                           |
| 42  | Manual timeout timer       | `AbortSignal.timeout`   | async                           |
| 43  | Busy wait sleep            | Promise + setTimeout    | async                           |
| 44  | Recursive retry            | Loop + backoff          | async                           |
| 45  | Callback API               | Promise wrapper         | [promises](../docs/promises.md) |
| 46  | Nested `.then`             | Flat async/await        | promises                        |
| 47  | Empty `.catch`             | Log + rethrow           | promises                        |
| 48  | Duplicate cleanup          | `.finally`              | promises                        |
| 49  | `Promise.all` partial fail | `allSettled`            | promises                        |
| 50  | EventEmitter deferred      | `Promise.withResolvers` | promises                        |

## Errors (51–56)

| #   | Before                  | After                  | Doc                         |
| --- | ----------------------- | ---------------------- | --------------------------- |
| 51  | `throw 'string'`        | Custom Error class     | [errors](../docs/errors.md) |
| 52  | Message-only wrap       | `{ cause }`            | errors                      |
| 53  | Unguarded JSON.parse    | try/catch SyntaxError  | errors                      |
| 54  | Duplicate finally close | Single `finally`       | errors                      |
| 55  | First error only batch  | `AggregateError`       | errors                      |
| 56  | `err && err.response`   | `err.response?.status` | errors                      |

## Modules (57–61)

| #   | Before                | After                  | Doc                           |
| --- | --------------------- | ---------------------- | ----------------------------- |
| 57  | `module.exports`      | `export default`       | [modules](../docs/modules.md) |
| 58  | `require` destructure | `import`               | modules                       |
| 59  | `__dirname`           | `import.meta.url`      | modules                       |
| 60  | Conditional require   | Dynamic `import()`     | modules                       |
| 61  | Deep package import   | Public `exports` field | modules                       |

## Architecture & Clean Code (62–71)

| #   | Before                  | After                    | Doc                                     |
| --- | ----------------------- | ------------------------ | --------------------------------------- |
| 62  | Global config import    | Injected config          | [architecture](../docs/architecture.md) |
| 63  | `Date.now()` in domain  | Injected clock           | architecture                            |
| 64  | `Math.random()` IDs     | `idGenerator` DI         | architecture                            |
| 65  | Scattered feature files | Feature folder           | architecture                            |
| 66  | 200-line route handler  | Thin route + service     | architecture                            |
| 67  | Nested if pyramid       | Early return             | [clean-code](../docs/clean-code.md)     |
| 68  | if/else return          | Guard return             | clean-code                              |
| 69  | Magic number timeout    | Named constant           | clean-code                              |
| 70  | Double negative         | Positive condition       | clean-code                              |
| 71  | Repeated event strings  | `Events` constant object | clean-code                              |

## Code Smells (72–78)

| #   | Before                 | After                    | Doc                                   |
| --- | ---------------------- | ------------------------ | ------------------------------------- |
| 72  | Giant switch           | Handler map              | [code-smells](../docs/code-smells.md) |
| 73  | Long param list        | Options object           | code-smells                           |
| 74  | Callback pyramid       | async/await              | code-smells                           |
| 75  | Duplicated email regex | Shared validator         | code-smells                           |
| 76  | God `api()` function   | Feature clients          | code-smells                           |
| 77  | Feature envy tax calc  | Method on domain/service | code-smells                           |
| 78  | Magic retry delay      | `RETRY_DELAY_MS`         | code-smells                           |

## Patterns & Antipatterns (79–88)

| #   | Before                  | After                    | Doc                                     |
| --- | ----------------------- | ------------------------ | --------------------------------------- |
| 79  | Singleton global DB     | Bootstrap wiring         | [patterns](../docs/patterns.md)         |
| 80  | Builder for 3 fields    | Plain object + validate  | patterns                                |
| 81  | Custom pub/sub          | `EventTarget`            | patterns                                |
| 82  | Null logger checks      | Null object noop         | patterns                                |
| 83  | `innerHTML` user bio    | `textContent` / sanitize | [antipatterns](../docs/antipatterns.md) |
| 84  | `with` statement        | Explicit access          | antipatterns                            |
| 85  | `arguments.callee`      | Named function           | antipatterns                            |
| 86  | Sync XHR                | fetch async              | antipatterns                            |
| 87  | `__proto__` assign      | `Object.create`          | antipatterns                            |
| 88  | `slice.call(arguments)` | Rest params              | antipatterns                            |

## Performance & Memory (89–98)

| #   | Before                 | After              | Doc                                   |
| --- | ---------------------- | ------------------ | ------------------------------------- |
| 89  | `find` in loop         | `Map` index        | [performance](../docs/performance.md) |
| 90  | String += in loop      | `join`             | performance                           |
| 91  | Unneeded array copy    | `for...of`         | performance                           |
| 92  | JSON clone perf        | `structuredClone`  | performance                           |
| 93  | RegExp in loop         | Compile once       | performance                           |
| 94  | Interleaved layout R/W | Batch R/W          | performance                           |
| 95  | Detached DOM cache     | Store id / WeakRef | [memory](../docs/memory.md)           |
| 96  | Listener leak          | AbortController    | memory                                |
| 97  | Closure huge capture   | Minimal capture    | memory                                |
| 98  | Interval leak          | clear on dispose   | memory                                |

## Browser & Node (99–105)

| #   | Before                 | After            | Doc                           |
| --- | ---------------------- | ---------------- | ----------------------------- |
| 99  | Query DOM in loop      | Cache reference  | [browser](../docs/browser.md) |
| 100 | Per-item listeners     | Event delegation | browser                       |
| 101 | `className +=`         | `classList`      | browser                       |
| 102 | innerHTML simple nodes | createElement    | browser                       |
| 103 | fs callbacks           | `fs/promises`    | [node](../docs/node.md)       |
| 104 | Scattered env reads    | Config module    | node                          |
| 105 | Error-first callback   | Promises         | node                          |

## Testing, Debugging, Security, Tooling (106–119)

| #   | Before                  | After                       | Doc                                   |
| --- | ----------------------- | --------------------------- | ------------------------------------- |
| 106 | Test internals          | Test behavior               | [testing](../docs/testing.md)         |
| 107 | Real setTimeout test    | Fake timers                 | testing                               |
| 108 | console.log debug       | Structured logger           | [debugging](../docs/debugging.md)     |
| 109 | `debugger` in source    | DevTools breakpoint         | debugging                             |
| 110 | Unvalidated user URL    | Protocol allowlist          | [security](../docs/security.md)       |
| 111 | Trust JSON.parse        | Schema validation           | security                              |
| 112 | Manual format debate    | Prettier CI                 | [tooling](../docs/tooling.md)         |
| 113 | No linter               | ESLint no-var               | tooling                               |
| 114 | ASI hazard lines        | Prettier consistency        | [style-guide](../docs/style-guide.md) |
| 115 | Default export drift    | Named exports               | style-guide                           |
| 116 | `const data = ...`      | Domain name `users`         | [naming](../docs/naming.md)           |
| 117 | Generic `handleClick`   | Specific handler name       | naming                                |
| 118 | `i++ // increment`      | Remove noise                | [comments](../docs/comments.md)       |
| 119 | Magic number no context | Named constant + policy ref | comments                              |

---

## Runnable Samples (70 files)

Examples grouped by topic. Run any file with Node ESM: `node examples/before-after/<file>.js`

| Category             | Files                                                                                                                                                                                                           |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Variables & scope    | `optional-chaining.js`, `nullish-coalescing.js`, `var-loop-closure.js`, `swap-destructuring.js`, `avoid-global.js`                                                                                              |
| Functions            | `default-params.js`, `rest-params.js`, `named-predicate.js`, `currying-pricing.js`                                                                                                                              |
| Objects              | `destructuring-rest.js`, `destructuring-rename.js`, `object-has-own.js`, `object-spread-merge.js`, `computed-property.js`, `object-freeze-config.js`, `safe-merge.js`                                           |
| Arrays               | `array-existence.js`, `find-vs-filter.js`, `flatmap-teams.js`, `includes-vs-indexof.js`, `immutable-sort.js`, `to-spliced.js`, `unique-set.js`, `group-by-category.js`, `chunk-array.js`, `every-validation.js` |
| Strings              | `replace-all.js`, `template-multiline.js`, `pad-start.js`, `trim-whitespace.js`, `starts-with.js`, `locale-compare-sort.js`                                                                                     |
| Numbers              | `parse-int-radix.js`, `number-is-nan.js`, `number-is-finite.js`, `intl-currency.js`, `clamp-helper.js`                                                                                                          |
| Async / promises     | `async-parallel.js`, `parallel-await-loop.js`, `promise-all-settled.js`, `nested-then-chain.js`, `catch-rethrow.js`, `finally-cleanup.js`, `promise-with-resolvers.js`                                          |
| Errors               | `error-cause.js`, `json-parse-guard.js`, `aggregate-error-batch.js`                                                                                                                                             |
| Modules              | `fs-promises.js`, `import-meta-dirname.js`, `dynamic-import-heavy.js`                                                                                                                                           |
| Architecture / DI    | `inject-config.js`, `inject-clock.js`, `early-return.js`, `else-after-return.js`, `handler-map.js`, `options-object.js`                                                                                         |
| Performance / memory | `debounce-throttle.js`, `memoize-bounded.js`, `map-index-lookup.js`, `string-join-loop.js`, `structured-clone.js`, `regex-outside-loop.js`, `weakmap-metadata.js`                                               |
| Browser / security   | `event-delegation.js`, `classlist-toggle.js`, `local-storage-prefs.js`, `csrf-token-fetch.js`, `fetch-response-ok.js`                                                                                           |
| Clean code           | `magic-number-constant.js`, `duplicate-email-validator.js`                                                                                                                                                      |

See also `examples/good/` and `examples/bad/` for Bad / Better / Best pairs.
