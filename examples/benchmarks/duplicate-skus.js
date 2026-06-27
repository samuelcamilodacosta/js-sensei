/**
 * Performance comparison — O(n²) duplicate find vs O(n) Set approach.
 * Run: node examples/benchmarks/duplicate-skus.js
 * See docs/performance.md
 */

const products = Array.from({ length: 10_000 }, (_, i) => ({
  sku: `SKU-${i % 5000}`,
  name: `Product ${i}`,
}));

function findDupesQuadratic(items) {
  const dupes = [];
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      if (items[i].sku === items[j].sku && !dupes.includes(items[i].sku)) {
        dupes.push(items[i].sku);
      }
    }
  }
  return dupes;
}

function findDupesLinear(items) {
  const seen = new Set();
  const dupes = new Set();
  for (const { sku } of items) {
    if (seen.has(sku)) dupes.add(sku);
    seen.add(sku);
  }
  return [...dupes];
}

function bench(label, fn) {
  const start = performance.now();
  const result = fn();
  const ms = performance.now() - start;
  console.log(`${label}: ${ms.toFixed(2)}ms (${result.length} dupes)`);
}

bench('O(n²) nested loops', () => findDupesQuadratic(products));
bench('O(n) Set scan', () => findDupesLinear(products));
