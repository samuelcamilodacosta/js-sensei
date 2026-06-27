/**
 * Recommended pattern — debounce with AbortController for search.
 * See docs/async.md and docs/performance.md
 */

export function createSearchController(searchFn, { debounceMs = 300 } = {}) {
  let timerId = null;
  let controller = null;

  return {
    query(term) {
      if (timerId) clearTimeout(timerId);
      if (controller) controller.abort();

      controller = new AbortController();
      const { signal } = controller;

      return new Promise((resolve, reject) => {
        timerId = setTimeout(async () => {
          try {
            const results = await searchFn(term, { signal });
            resolve(results);
          } catch (error) {
            if (error.name === 'AbortError') return;
            reject(error);
          }
        }, debounceMs);
      });
    },

    cancel() {
      if (timerId) clearTimeout(timerId);
      if (controller) controller.abort();
    },
  };
}
