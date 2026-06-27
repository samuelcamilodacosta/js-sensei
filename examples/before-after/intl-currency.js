// #36 — Intl.NumberFormat for currency

const cents = 1999;

const displayBefore = '$' + (cents / 100).toFixed(2);
const displayAfter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
}).format(cents / 100);

export { displayBefore, displayAfter };
