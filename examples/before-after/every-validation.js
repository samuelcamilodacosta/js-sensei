// #20 — every vs filter length

const items = [{ valid: true }, { valid: true }, { valid: false }];

const allValidBefore = items.filter((i) => i.valid).length === items.length;
const allValidAfter = items.every((i) => i.valid);

export { allValidBefore, allValidAfter };
