// Before / After #14 — rest destructuring to omit sensitive fields

const user = { id: '1', name: 'Ada', email: 'ada@example.com', password: 'secret' };

// Before — manual clone omitting password
const publicBefore = { id: user.id, name: user.name, email: user.email };

// After — rest omit
const { password: _password, ...publicAfter } = user;

export { publicBefore, publicAfter };
