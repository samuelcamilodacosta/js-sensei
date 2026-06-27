// Before / After #22 — includes vs indexOf

const roles = ['admin', 'editor', 'viewer'];

const isAdminBefore = roles.indexOf('admin') !== -1;
const isAdminAfter = roles.includes('admin');

export { isAdminBefore, isAdminAfter };
