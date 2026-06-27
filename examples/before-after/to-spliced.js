// #23 — toSpliced vs mutating splice

const cart = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];

function removeItemBefore(items, index) {
  items.splice(index, 1);
  return items;
}

function removeItemAfter(items, index) {
  return items.toSpliced(index, 1);
}

export { cart, removeItemBefore, removeItemAfter };
