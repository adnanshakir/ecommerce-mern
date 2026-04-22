import CartItem from "@/components/cart/CartItem";

const CartList = ({ items, onIncrease, onDecrease, onRemove }) => {
  if (!items?.length) {
    return (
      <div className="rounded border border-[var(--border)] bg-[var(--card)] p-6 text-sm text-[var(--text-muted)]">
        Your cart is empty.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-8 text-xs text-[var(--text-muted)]">
          <p className="w-16 text-center">Price</p>
          <p className="w-24 text-center">Qty</p>
          <p className="w-20 text-right">Total</p>
        </div>
      </div>

      {items.map((item, index) => (
        <CartItem
          key={item?._id || `${item?.product?._id || "item"}-${index}`}
          item={item}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default CartList;
