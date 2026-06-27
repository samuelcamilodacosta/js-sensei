// #4 — avoid accidental global

function initBefore() {
  // eslint-disable-next-line no-undef
  counter = 0;
  // eslint-disable-next-line no-undef
  return counter;
}

function initAfter() {
  let counter = 0;
  return {
    increment() {
      counter += 1;
    },
    value() {
      return counter;
    },
  };
}

export { initBefore, initAfter };
