// #31 — startsWith vs indexOf

const path = '/api/v1/users';

const isApiBefore = path.indexOf('/api') === 0;
const isApiAfter = path.startsWith('/api');

export { isApiBefore, isApiAfter };
