// Before / After #100 — event delegation pattern (browser)

export function bindProductListBefore(list, items, handler) {
  items.forEach((item) => {
    const row = document.createElement('li');
    row.textContent = item.name;
    row.addEventListener('click', () => handler(item.id));
    list.appendChild(row);
  });
}

export function bindProductListAfter(list, handler) {
  list.addEventListener('click', (event) => {
    const row = event.target.closest('[data-product-id]');
    if (!row || !list.contains(row)) return;
    handler(row.dataset.productId);
  });
}
