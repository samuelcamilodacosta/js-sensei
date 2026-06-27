// Before / After #72 — switch / if-else chain vs handler map

function dispatchBefore(action, payload) {
  if (action === 'CREATE') return create(payload);
  if (action === 'UPDATE') return update(payload);
  if (action === 'DELETE') return remove(payload);
  throw new Error('unknown');
}

const handlers = {
  CREATE: create,
  UPDATE: update,
  DELETE: remove,
};

function dispatchAfter(action, payload) {
  const handler = handlers[action];
  if (!handler) throw new RangeError(`Unknown action: ${action}`);
  return handler(payload);
}

function create(p) {
  return { op: 'create', p };
}
function update(p) {
  return { op: 'update', p };
}
function remove(p) {
  return { op: 'delete', p };
}

export { dispatchBefore, dispatchAfter };
