// #35 — Number.isFinite

function isValidQuantityBefore(n) {
  return typeof n === 'number';
}

function isValidQuantityAfter(n) {
  return Number.isFinite(n) && n >= 0;
}

export { isValidQuantityBefore, isValidQuantityAfter };
