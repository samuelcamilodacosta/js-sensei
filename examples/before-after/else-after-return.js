// #68 — else after return

function statusBefore(user) {
  if (user.active) {
    return 'active';
  } else {
    return 'inactive';
  }
}

function statusAfter(user) {
  if (user.active) return 'active';
  return 'inactive';
}

export { statusBefore, statusAfter };
