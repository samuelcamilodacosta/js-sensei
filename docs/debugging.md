# Debugging: DevTools, Profiling, and Memory Analysis

Effective debugging is systematic: reproduce, isolate, instrument, verify. Random `console.log` sprawl wastes time and leaks data in production. Interactive tools and structured logging complement each other.

---

## Introduction

**Chrome DevTools** (and Firefox Developer Tools) provide breakpoints, watch expressions, network inspection, performance recordings, and heap snapshots. **Node.js** supports `--inspect` for the same protocol. Production debugging relies on **correlation IDs**, log aggregation, and safe reproduction environments — not `debugger` in shipped code.

---

## When to Use

| Technique                  | Use when                                 |
| -------------------------- | ---------------------------------------- |
| **Breakpoint**             | Stepping through unfamiliar control flow |
| **Conditional breakpoint** | Bug occurs only for specific input       |
| **Performance panel**      | Jank, long tasks, layout cost            |
| **Memory heap snapshot**   | Steadily growing heap in SPA             |
| **Network panel**          | Failed fetch, CORS, slow API             |
| **Structured logs**        | Production incidents with requestId      |
| **git bisect**             | Regression between releases              |

---

## When to Avoid

- Logging PII/passwords to console in any environment
- Leaving `debugger` statements in committed code
- Optimizing without profiler evidence
- Changing multiple variables at once without hypothesis
- Debugging minified production bundles without source maps

---

## Best Practices

1. **Minimize reproduction** — smallest input, single test, isolated module
2. Form a **hypothesis** before changing code
3. Use **correlation IDs** across async boundaries in logs
4. Capture **HAR** file for network bugs before closing browser tab
5. Compare **heap snapshots** (delta) not single snapshot in vacuum
6. Fix root cause; avoid defensive patches without understanding

---

## Bad Practices

- Shotgun debugging — change random things until it "works"
- Ignoring flaky tests instead of fixing race
- `console.log` objects that stringify poorly (circular refs)
- Debugging in production without read-only safeguards

---

## Breakpoints and Stepping

### ❌ Bad

```javascript
function processInvoice(invoice) {
  debugger; // shipped to production — pauses all users in some setups
  return calculateTotal(invoice);
}
```

---

### ✅ Better

```javascript
function processInvoice(invoice) {
  logger.debug({
    event: 'invoice.process',
    invoiceId: invoice.id,
    lineCount: invoice.lines.length,
  });
  return calculateTotal(invoice);
}
```

Structured log in development/staging only.

---

### ✅ Best

Set **conditional breakpoint** in DevTools: `invoice.id === 'inv-bug-42'`. Step through with call stack + scope panel. No source modification.

---

## Performance Profiling

### ❌ Bad

"It feels slow" → rewrite algorithm without measurement.

---

### ✅ Better

Record Performance profile during slow interaction; inspect Long Tasks > 50ms.

---

### ✅ Best

1. Record Performance + Screenshots
2. Identify longest task — click to source location
3. Check **Bottom-Up** and **Call Tree** for hot functions
4. Cross-reference [browser.md](./browser.md) reflow patterns
5. Re-profile after fix to confirm improvement

For Node CPU: `node --cpu-prof` or clinic.js flamegraphs.

---

## Memory Leak Detection

### Workflow

1. Open heap snapshot baseline (after app load)
2. Perform suspect action repeatedly (navigate away/back 10x)
3. Force GC (DevTools trash icon)
4. Take second snapshot → **Comparison** view
5. Inspect **Retainers** chain for detached DOM nodes or growing arrays

Common culprits: listeners, closures, global caches ([memory.md](./memory.md)).

---

## Node.js Debugging

```bash
node --inspect-brk app.js
```

Open `chrome://inspect` → dedicated DevTools for Node. Use for async stack inspection and breakpoint in server middleware.

---

## Before / After

### 108. console.log debugging

**Before:** 50 unstructured `console.log` statements  
**After:** `logger.info({ requestId, event, durationMs })`

### 109. debugger in source

**Before:** `debugger` committed  
**After:** DevTools conditional breakpoint

---

## Common Pitfalls

- **Heisenbugs** — logging changes timing; use breakpoints
- **Source map mismatch** — wrong line numbers in DevTools
- **Async gaps** — enable async stack traces in Chrome
- **Optimizing cold paths** — profile hot paths only

---

## Performance

Profiling adds overhead during recording — acceptable for diagnosis. Remove verbose debug logging in production hot paths.

---

## References

- [Chrome DevTools Documentation](https://developer.chrome.com/docs/devtools)
- [Node.js — Debugging](https://nodejs.org/en/learn/getting-started/debugging)
- [web.dev — Performance insights](https://web.dev/performance)
- [MDN — Console API](https://developer.mozilla.org/en-US/docs/Web/API/console)
