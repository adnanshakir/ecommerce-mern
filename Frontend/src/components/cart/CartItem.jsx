const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
  const itemPrice = item?.price?.amount || 0;
  const itemTotal = itemPrice * (item?.quantity || 0);
  const imageUrl =
    item?.variantData?.images?.[0]?.url ||
    item?.product?.images?.[0]?.url;

  return (
    <div className="flex items-start justify-between border-b border-[var(--border)] py-6">
      <div className="flex gap-4">
        <img
          src={imageUrl}
          alt={item?.product?.name || "Cart product"}
          className="h-28 w-24 object-cover"
        />

        <div className="space-y-1">
          <p className="text-sm text-(--text)">{item?.product?.name}</p>

          {item?.size && (
            <p className="text-xs text-[var(--text-muted)]">Size: {item.size}</p>
          )}

          <button
            type="button"
            onClick={() => onRemove(item)}
            className="text-xs text-red-500"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <p className="w-16 text-center text-sm text-(--text)">₹{itemPrice}</p>

        <div className="flex min-w-24 items-center justify-center border border-[var(--border)]">
          <button type="button" onClick={() => onDecrease(item)} className="px-2">
            -
          </button>
          <span className="px-3">{item?.quantity || 0}</span>
          <button type="button" onClick={() => onIncrease(item)} className="px-2">
            +
          </button>
        </div>

        <p className="w-20 text-right text-sm text-(--text)">₹{itemTotal}</p>
      </div>
    </div>
  );
};

export default CartItem;
