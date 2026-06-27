// Before / After #23 — mutating sort vs toSorted

const products = [
  { sku: 'b', price: 20 },
  { sku: 'a', price: 10 },
];

// Before — mutates original
function sortByPriceBefore(items) {
  return items.sort((a, b) => a.price - b.price);
}

// After — non-mutating (ES2023)
function sortByPriceAfter(items) {
  return items.toSorted((a, b) => a.price - b.price);
}

export { products, sortByPriceBefore, sortByPriceAfter };
