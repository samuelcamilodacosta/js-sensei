// #17 — spread merge vs Object.assign

const defaults = { theme: 'light', lang: 'en' };
const overrides = { lang: 'pt' };

const mergedBefore = Object.assign({}, defaults, overrides);
const mergedAfter = { ...defaults, ...overrides };

export { mergedBefore, mergedAfter };
