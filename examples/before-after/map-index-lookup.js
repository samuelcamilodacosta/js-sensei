// #89 — Map index vs find in loop

const products = [
  { id: 'p1', price: 10 },
  { id: 'p2', price: 20 },
];
const orderLines = [{ productId: 'p1' }, { productId: 'p2' }, { productId: 'p1' }];

function totalBefore(lines, catalog) {
  let sum = 0;
  for (const line of lines) {
    const product = catalog.find((p) => p.id === line.productId);
    sum += product.price;
  }
  return sum;
}

function totalAfter(lines, catalog) {
  const byId = new Map(catalog.map((p) => [p.id, p]));
  let sum = 0;
  for (const line of lines) {
    sum += byId.get(line.productId).price;
  }
  return sum;
}

export { totalBefore, totalAfter, products, orderLines };
