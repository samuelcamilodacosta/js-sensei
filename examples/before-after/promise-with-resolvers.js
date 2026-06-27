// #50 — Promise.withResolvers (ES2024)

function createGateBefore() {
  let resolve;
  let reject;
  const ready = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { ready, resolve, reject };
}

function createGateAfter() {
  return Promise.withResolvers();
}

export { createGateBefore, createGateAfter };
