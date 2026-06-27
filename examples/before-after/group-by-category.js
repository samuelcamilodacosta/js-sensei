// #25 — Object.groupBy (ES2024)

const products = [
  { name: 'Pen', category: 'office' },
  { name: 'Desk', category: 'furniture' },
  { name: 'Paper', category: 'office' },
];

function groupBefore(items) {
  const groups = {};
  for (const item of items) {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  }
  return groups;
}

function groupAfter(items) {
  return Object.groupBy(items, (item) => item.category);
}

export { groupBefore, groupAfter, products };
