// Before / After — bounded memoization (performance / memory)

export function memoize(fn, { maxSize = 128, keyFn = (...args) => JSON.stringify(args) } = {}) {
  const cache = new Map();
  return (...args) => {
    const key = keyFn(...args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    if (cache.size >= maxSize) cache.delete(cache.keys().next().value);
    cache.set(key, result);
    return result;
  };
}

// Before: unbounded object cache grows forever
// After: memoize with maxSize eviction
