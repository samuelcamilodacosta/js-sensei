// Before / After #39 — forEach with async does not await

async function syncUser(user) {
  return { id: user.id, synced: true };
}

const _users = [{ id: '1' }, { id: '2' }];

// Before — returns before work completes
async function syncAllBefore(list = _users) {
  list.forEach(async (user) => {
    await syncUser(user);
  });
}

// After
async function syncAllAfter(list = _users) {
  await Promise.all(list.map((user) => syncUser(user)));
}

export { syncAllBefore, syncAllAfter };
