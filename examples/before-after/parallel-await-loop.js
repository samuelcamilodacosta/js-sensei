// #41 — parallel await in loop

const ids = ['1', '2', '3'];
const fetchById = async (id) => ({ id });

async function fetchAllBefore(list) {
  const results = [];
  for (const id of list) {
    results.push(await fetchById(id));
  }
  return results;
}

async function fetchAllAfter(list) {
  return Promise.all(list.map((id) => fetchById(id)));
}

export { fetchAllBefore, fetchAllAfter, ids };
