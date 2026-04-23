import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useCart } from "../hooks/useCart";
import Layout from "@/components/layout/Layout";
import CartList from "@/features/cart/components/CartList";
import CartSummary from "@/features/cart/components/CartSummary";
import toast from "react-hot-toast";

const Cart = () => {
  const items = useSelector((state) => state.cart.items);
  const { handleGetCart, handleRemoveFromCart, handleUpdateCartQuantity } =
    useCart();

  useEffect(() => {
    handleGetCart().catch(() => {
      toast.error("Failed to load cart");
    });
  }, []);

  const handleIncrease = async (item) => {
    try {
      await handleUpdateCartQuantity({
        itemId: item._id,
        quantity: item.quantity + 1,
      });
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  const handleDecrease = async (item) => {
    if (item.quantity === 1) {
      try {
        await handleRemoveFromCart({ itemId: item._id });
      } catch {
        toast.error("Failed to remove item");
      }
      return;
    }

    try {
      await handleUpdateCartQuantity({
        itemId: item._id,
        quantity: item.quantity - 1,
      });
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemove = async (item) => {
    try {
      await handleRemoveFromCart({ itemId: item._id });
    } catch {
      toast.error("Failed to remove item");
    }
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

        {items.length > 0 && <CartSummary />}
      </section>
    </Layout>
  );
};

export default Cart;
