// #93 — compile RegExp outside loop

const inputs = ['foo-bar', 'baz-qux'];

function matchBefore(items, pattern) {
  const results = [];
  for (const item of items) {
    results.push(new RegExp(pattern).test(item));
  }
  return results;
}

const WORD_RE = /^\w+-\w+$/;

function matchAfter(items) {
  return items.map((item) => WORD_RE.test(item));
}

export { matchBefore, matchAfter, inputs };
