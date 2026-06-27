// #33 — Number.isNaN vs global isNaN

const values = [NaN, 'hello', undefined];

const checksBefore = values.map((v) => isNaN(v));
const checksAfter = values.map((v) => Number.isNaN(v));

export { checksBefore, checksAfter };
