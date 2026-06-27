// Before / After — debounce and throttle utilities (performance)

export function debounce(fn, waitMs) {
  let timerId = null;
  return (...args) => {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => {
      timerId = null;
      fn(...args);
    }, waitMs);
  };
}

export function throttle(fn, intervalMs) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= intervalMs) {
      last = now;
      fn(...args);
    }
  };
}

// Before: raw listener fires every event
// After: wrap handler with debounce(search, 300) or throttle(onScroll, 100)
