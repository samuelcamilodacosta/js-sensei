// #69 — magic number to named constant

function retryBefore(fn) {
  return attempt(fn, 86400000);
}

const MS_PER_DAY = 86_400_000;

function retryAfter(fn) {
  return attempt(fn, MS_PER_DAY);
}

function attempt(fn, delayMs) {
  return { fn, delayMs };
}

export { retryBefore, retryAfter, MS_PER_DAY };
