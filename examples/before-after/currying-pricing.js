// Before / After — currying vs options object (functions)

const products = [{ price: 100 }, { price: 200 }];

// Before — easy to swap argument order
function priceWithBefore(discount, tax, unit) {
  return unit * (1 - discount) * (1 + tax);
}

// After — curried configuration
function withDiscount(discount) {
  return (tax) => (unit) => unit * (1 - discount) * (1 + tax);
}

const salePrice = withDiscount(0.1)(0.08);
const pricesAfter = products.map((p) => salePrice(p.price));

// Best in docs: applyPricing({ discountPercent, taxRate }) — see functions.md

export { priceWithBefore, withDiscount, pricesAfter };
