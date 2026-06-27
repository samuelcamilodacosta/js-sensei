// Before / After #19 — filter()[0] vs find

const users = [
  { id: '1', active: true, role: 'admin' },
  { id: '2', active: false, role: 'user' },
];

// Before
const adminBefore = users.filter((u) => u.role === 'admin')[0];

// After
const adminAfter = users.find((u) => u.role === 'admin');

// Before / After — filter().length > 0 vs some
const hasActiveBefore = users.filter((u) => u.active).length > 0;
const hasActiveAfter = users.some((u) => u.active);

export { adminBefore, adminAfter, hasActiveBefore, hasActiveAfter };
