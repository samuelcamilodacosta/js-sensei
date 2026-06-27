// #90 — array join vs string concat in loop

const parts = ['Hello', ' ', 'world', '!'];

function buildBefore(chunks) {
  let result = '';
  for (const chunk of chunks) result += chunk;
  return result;
}

function buildAfter(chunks) {
  return chunks.join('');
}

export { buildBefore, buildAfter, parts };
