import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useCart } from "../hooks/useCart";
import Layout from "@/components/layout/Layout";
import CartList from "@/features/cart/components/CartList";
import CartSummary from "@/features/cart/components/CartSummary";

const Cart = () => {
  const items = useSelector((state) => state.cart.items);
  const { handleGetCart, handleRemoveFromCart, handleUpdateCartQuantity } =
    useCart();

  useEffect(() => {
    handleGetCart();
  }, []);

  const handleIncrease = (item) => {
    handleUpdateCartQuantity({
      itemId: item._id,
      quantity: item.quantity + 1,
    });
  };

  const handleDecrease = (item) => {
    if (item.quantity === 1) {
      handleRemoveFromCart({ itemId: item._id });
      return;
    }

    handleUpdateCartQuantity({
      itemId: item._id,
      quantity: item.quantity - 1,
    });
  };

  const handleRemove = (item) => {
    handleRemoveFromCart({ itemId: item._id });
  };

  return (
    <Layout>
      <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <p className="mb-2 text-xs text-[var(--text-muted)]">
          Home / Shopping cart
        </p>
        <h1 className="mb-6 text-xl font-bold text-(--text)">Shopping cart</h1>

        <CartList
          items={items}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          onRemove={handleRemove}
        />

        {items.length > 0 && <CartSummary items={items} />}
      </section>
    </Layout>
  );
};

export default Cart;
