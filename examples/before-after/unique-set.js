// #24 — unique values with Set

const tags = ['js', 'node', 'js', 'web', 'node'];

const uniqueBefore = tags.filter((t, i) => tags.indexOf(t) === i);
const uniqueAfter = [...new Set(tags)];

export { uniqueBefore, uniqueAfter };
