// Before / After #2, #12 — nullish coalescing vs || and ternary

const config = { timeout: 0, retries: null };

// Before — 0 is falsy, wrongly replaced
const timeoutBefore = config.timeout || 5000;

// After — only null/undefined trigger default
const timeoutAfter = config.timeout ?? 5000;
const retriesAfter = config.retries ?? 3;

export { timeoutBefore, timeoutAfter, retriesAfter };
