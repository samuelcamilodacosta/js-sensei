// #3 — swap without temp variable
let a = 1;
let b = 2;

function swapBefore() {
  const tmp = a;
  a = b;
  b = tmp;
  return { a, b };
}

function swapAfter() {
  [a, b] = [b, a];
  return { a, b };
}

export { swapBefore, swapAfter };
