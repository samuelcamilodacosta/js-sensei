// Before / After #27 — replaceAll for global string replacement

const text = 'foo bar foo baz foo';

// Before — regex required for global replace with string pattern
const onceBefore = text.replace('foo', 'qux');
const globalBefore = text.replace(/foo/g, 'qux');

// After — explicit global replace
const globalAfter = text.replaceAll('foo', 'qux');

export { onceBefore, globalBefore, globalAfter };
