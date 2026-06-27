// #60 — conditional dynamic import

let heavyModule;

async function loadHeavyBefore() {
  heavyModule = await import('./memoize-bounded.js');
  return heavyModule;
}

async function loadHeavyAfter(shouldLoad) {
  if (!shouldLoad) return null;
  if (!heavyModule) {
    heavyModule = await import('./memoize-bounded.js');
  }
  return heavyModule;
}

export { loadHeavyBefore, loadHeavyAfter };
