// Before / After #6 — named predicate for filter callbacks

const users = [
  { active: true, role: 'admin' },
  { active: false, role: 'user' },
  { active: true, role: 'user' },
];

// Before — inline complex predicate
const adminsBefore = users.filter((u) => u.active && u.role === 'admin');

const isActiveAdmin = (user) => user.active && user.role === 'admin';
const adminsAfter = users.filter(isActiveAdmin);

export { adminsBefore, adminsAfter, isActiveAdmin };
