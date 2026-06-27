// #18 — computed property names

const key = 'status';
const value = 'active';

const objBefore = {};
objBefore[key] = value;

const objAfter = { [key]: value };

export { objBefore, objAfter };
