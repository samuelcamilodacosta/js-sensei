// Before / After — WeakMap for auxiliary metadata (memory)

const metadata = new WeakMap();

// Before — Map keeps objects alive
// const metadata = new Map();
// metadata.set(domainObject, { cachedAt: Date.now() });

export function attachMeta(obj, meta) {
  metadata.set(obj, meta);
}

export function readMeta(obj) {
  return metadata.get(obj);
}

// When obj is GC'd, WeakMap entry disappears automatically
