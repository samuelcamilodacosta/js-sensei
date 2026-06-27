// #92 — structuredClone vs JSON clone

const original = { meta: { count: 1 }, tags: ['a'] };

const cloneBefore = JSON.parse(JSON.stringify(original));
const cloneAfter = structuredClone(original);

export { original, cloneBefore, cloneAfter };
