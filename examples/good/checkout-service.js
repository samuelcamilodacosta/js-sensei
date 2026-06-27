/**
 * Recommended pattern — checkout service with dependency injection.
 * See docs/architecture.md and docs/async.md
 */

export function createCheckoutService({ paymentGateway, cartRepository, logger }) {
  return {
    async executeCheckout(cartId, { signal } = {}) {
      const cart = await cartRepository.get(cartId, { signal });
      if (!cart?.items?.length) {
        throw new RangeError('Cart is empty');
      }

      const totalCents = cart.items.reduce(
        (sum, item) => sum + item.unitPriceCents * item.quantity,
        0,
      );

      logger.info({ event: 'checkout.start', cartId, totalCents });

      const receipt = await paymentGateway.charge(
        { cartId, totalCents, currency: cart.currency },
        { signal },
      );

      await cartRepository.clear(cartId, { signal });
      logger.info({ event: 'checkout.complete', cartId, receiptId: receipt.id });

      return receipt;
    },
  };
}
