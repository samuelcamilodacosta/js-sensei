/**
 * Micro-benchmark — some vs filter.length for existence check.
 * Run: node examples/benchmarks/some-vs-filter.js
 */

const users = Array.from({ length: 100_000 }, (_, i) => ({
  id: String(i),
  active: i === 99_999,
}));

function hasActiveFilter(list) {
  return list.filter((u) => u.active).length > 0;
}

function hasActiveSome(list) {
  return list.some((u) => u.active);
}

function bench(label, fn) {
  const start = performance.now();
  for (let i = 0; i < 100; i++) fn();
  console.log(`${label}: ${(performance.now() - start).toFixed(2)}ms (100 iterations)`);
}

bench('filter().length > 0', () => hasActiveFilter(users));
bench('some()', () => hasActiveSome(users));
