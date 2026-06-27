// Before / After #67 — early return / guard clauses

function processOrderBefore(order) {
  if (order) {
    if (order.status === 'pending') {
      if (order.items.length > 0) {
        return charge(order);
      }
    }
  }
  return null;
}

function processOrderAfter(order) {
  if (!order) return null;
  if (order.status !== 'pending') return null;
  if (order.items.length === 0) return null;
  return charge(order);
}

function charge(order) {
  return { orderId: order.id, charged: true };
}

export { processOrderBefore, processOrderAfter };
