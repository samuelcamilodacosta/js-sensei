// #16 — Object.hasOwn vs hasOwnProperty

const record = { id: '1' };

// eslint-disable-next-line no-prototype-builtins
const hasIdBefore = record.hasOwnProperty('id');
const hasIdAfter = Object.hasOwn(record, 'id');

export { hasIdBefore, hasIdAfter };
