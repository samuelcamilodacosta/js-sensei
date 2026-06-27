// #63 — inject clock for testable time

function createTokenBefore() {
  return { issuedAt: Date.now(), ttlMs: 3600000 };
}

function createTokenAfter(clock = Date) {
  return { issuedAt: clock.now(), ttlMs: 3600000 };
}

export { createTokenBefore, createTokenAfter };
