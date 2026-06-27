// Before / After #8 — arguments vs rest parameters

function sumBefore() {
  return Array.from(arguments).reduce((a, b) => a + b, 0);
}

function sumAfter(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}

export { sumBefore, sumAfter };
