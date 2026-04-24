import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useCart } from "../hooks/useCart";
import Layout from "@/components/layout/Layout";
import CartList from "@/features/cart/components/CartList";
import CartSummary from "@/features/cart/components/CartSummary";
import toast from "react-hot-toast";
import { useRazorpay } from "react-razorpay";

const Cart = () => {
  const items = useSelector((state) => state.cart.items);
  const { error, isLoading, Razorpay } = useRazorpay();
  const { handleGetCart, handleRemoveFromCart, handleUpdateCartQuantity } = useCart();

  const handlePayment = () => {
    const options = {
      key: "YOUR_RAZORPAY_KEY",
      amount: 50000, // Amount in paise
      currency: "INR",
      name: "Test Company",
      description: "Test Transaction",
      order_id: "order_9A33XWu170gUtm", // Generate order_id on server
      handler: (response) => {
        console.log(response);
        alert("Payment Successful!");
      },
      prefill: {
        name: "John Doe",
        email: "john.doe@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#F37254",
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  };


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

        {items.length > 0 && <CartSummary razorpay={handlePayment} />}
      </section>
    </Layout>
  );
};

export default Cart;
