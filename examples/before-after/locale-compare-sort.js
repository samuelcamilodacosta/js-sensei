// #32 — localeCompare for sorting

const names = ['Zara', 'Åsa', 'Anna'];

const sortedBefore = [...names].sort(); // lexicographic, locale wrong
const sortedAfter = [...names].sort((a, b) => a.localeCompare(b, 'sv'));

export { sortedBefore, sortedAfter };
