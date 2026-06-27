// #55 — AggregateError for batch failures

async function task(id) {
  if (id === 2) throw new Error(`fail ${id}`);
  return id;
}

async function runBatchBefore(ids) {
  for (const id of ids) {
    await task(id); // throws on first failure — others not attempted
  }
}

async function runBatchAfter(ids) {
  const results = await Promise.allSettled(ids.map((id) => task(id)));
  const errors = results.filter((r) => r.status === 'rejected').map((r) => r.reason);
  if (errors.length) throw new AggregateError(errors, 'Batch failed');
}

export { runBatchBefore, runBatchAfter };
