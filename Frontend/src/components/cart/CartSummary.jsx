const CartSummary = ({ items }) => {
  const subtotal = items.reduce(
    (acc, item) => acc + (item?.price?.amount || 0) * (item?.quantity || 0),
    0,
  );

  return (
    <div className="mt-10 border-t pt-6 space-y-3">
      <div className="flex justify-between">
        <p className="text-(--text)">Subtotal</p>
        <p className="text-(--text)">₹{subtotal}</p>
      </div>

      <button
        type="button"
        className="w-full bg-[var(--primary-btn)] py-3 text-sm text-[var(--card)]"
      >
        Checkout
      </button>

      <p className="text-center text-xs text-[var(--text-muted)]">
        Taxes and shipping calculated at checkout
      </p>
    </div>
  );
};

export default CartSummary;
