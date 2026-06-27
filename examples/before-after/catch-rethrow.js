// #47 — do not swallow errors

async function fetchUserBefore(id) {
  try {
    return await fakeFetch(id);
  } catch {
    return null;
  }
}

async function fetchUserAfter(id) {
  try {
    return await fakeFetch(id);
  } catch (error) {
    console.error({ event: 'fetchUser.failed', id, error });
    throw error;
  }
}

function fakeFetch(id) {
  if (id === 'bad') return Promise.reject(new Error('not found'));
  return Promise.resolve({ id });
}

export { fetchUserBefore, fetchUserAfter };
