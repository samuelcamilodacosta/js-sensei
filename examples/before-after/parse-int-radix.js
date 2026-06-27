// Before / After #34 — parseInt with explicit radix

const input = '42';

const parsedBefore = parseInt(input);
const parsedAfter = Number.parseInt(input, 10);

export { parsedBefore, parsedAfter };
