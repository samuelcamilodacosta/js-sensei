// Before / After — prototype pollution safe merge (security)

const BLOCKED = new Set(['__proto__', 'constructor', 'prototype']);

function mergeUnsafe(target, source) {
  for (const key in source) {
    if (typeof source[key] === 'object' && source[key]) {
      target[key] = target[key] || {};
      mergeUnsafe(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

function mergeSafe(target, source) {
  for (const key of Object.keys(source)) {
    if (BLOCKED.has(key)) continue;
    const value = source[key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      target[key] = mergeSafe(target[key] || {}, value);
    } else {
      target[key] = value;
    }
  }
  return target;
}

export { mergeUnsafe, mergeSafe };
