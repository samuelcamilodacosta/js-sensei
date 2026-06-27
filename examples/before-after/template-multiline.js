// #28 — multiline template literal

const name = 'Ada';
const orderId = 'ORD-42';

const messageBefore =
  'Hello ' + name + ',\n' + 'Your order ' + orderId + ' shipped.\n' + 'Thank you.';

const messageAfter = `Hello ${name},
Your order ${orderId} shipped.
Thank you.`;

export { messageBefore, messageAfter };
