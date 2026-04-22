import { Trash2 } from "lucide-react";

const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
  const imageUrl = item.image;
  const name = item.name;
  const price = item.price?.amount || 0;
  const size = item.size;
  const total = price * (item.quantity || 0);

  const QtyControls = () => (
    <div className="flex items-center border border-[var(--border)]">
      <button
        type="button"
        onClick={() => onDecrease(item)}
        className="px-3 py-1 text-sm hover:bg-[var(--card-subtle)] transition"
      >
        -
      </button>
      <span className="px-3 text-sm">{item.quantity || 0}</span>
      <button
        type="button"
        onClick={() => onIncrease(item)}
        className="px-3 py-1 text-sm hover:bg-[var(--card-subtle)] transition"
      >
        +
      </button>
    </div>
  );

  return (
    <div className="border-b border-[var(--border)] py-6">
      {/* ── MOBILE LAYOUT ── */}
      <div className="flex gap-4 md:hidden">
        <img
          src={imageUrl}
          alt={name || "Cart product"}
          className="w-20 h-24 object-cover shrink-0"
        />

        <div className="flex-1 flex flex-col justify-between">
          {/* Name + remove */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-base font-medium leading-tight text-(--text)">
                {name}
              </p>
              {size && (
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Size: {size}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onRemove(item)}
              className="text-red-500 hover:opacity-80 transition shrink-0"
              aria-label="Remove item"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {/* Price · Qty · Total — single row */}
          <div className="flex items-center justify-between mt-3">
            <p className="text-sm text-[var(--text-muted)]">₹{price}</p>
            <QtyControls />
            <p className="text-sm font-medium text-(--text)">₹{total}</p>
          </div>
        </div>
      </div>

      {/* ── DESKTOP LAYOUT ── */}
      <div className="hidden md:flex md:items-center md:justify-between gap-6">
        {/* Left — image + info */}
        <div className="flex gap-4">
          <img
            src={imageUrl}
            alt={name || "Cart product"}
            className="w-20 h-24 object-cover shrink-0"
          />
          <div className="space-y-1">
            <p className="text-base font-medium leading-tight text-(--text)">
              {name}
            </p>
            {size && (
              <p className="text-xs text-[var(--text-muted)]">Size: {size}</p>
            )}
            <button
              type="button"
              onClick={() => onRemove(item)}
              className="text-red-500 hover:opacity-80 transition mt-1"
              aria-label="Remove item"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Right — price / qty / total */}
        <div className="flex items-center gap-8">
          <p className="w-16 text-center text-sm text-(--text)">₹{price}</p>
          <QtyControls />
          <p className="w-20 text-right text-sm font-medium text-(--text)">
            ₹{total}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
