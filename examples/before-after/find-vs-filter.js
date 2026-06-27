// Before / After #19 — find vs filter()[0]

const users = [
  { id: '1', name: 'Ada' },
  { id: '2', name: 'Bob' },
];

function findUserBefore(id) {
  return users.filter((u) => u.id === id)[0];
}

function findUserAfter(id) {
  return users.find((u) => u.id === id);
}

export { findUserBefore, findUserAfter };
