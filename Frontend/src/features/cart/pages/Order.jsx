import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import Layout from "@/components/layout/Layout";
import { CheckCircle, ShoppingBag, ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getPaymentByOrderId } from "../service/cart.api";

// ── Helpers ────────────────────────────────────────────────────────────────

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

const StatusBadge = ({ status }) => {
  const map = {
    paid: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    failed: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${map[status] ?? "bg-gray-100 text-gray-600"}`}
    >
      {status === "paid" && (
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
      )}
      {status ?? "—"}
    </span>
  );
};

// ── Skeleton ───────────────────────────────────────────────────────────────

const Skeleton = () => (
  <section className="mx-auto w-full max-w-5xl animate-pulse space-y-5 px-4 py-10 sm:px-6">
    <div className="flex flex-col items-center gap-3">
      <div className="h-20 w-20 rounded-full bg-[var(--card-subtle)]" />
      <div className="h-7 w-64 rounded bg-[var(--card-subtle)]" />
      <div className="h-4 w-48 rounded bg-[var(--card-subtle)]" />
    </div>
    <div className="h-32 rounded-lg bg-[var(--card-subtle)]" />
    <div className="h-40 rounded-lg bg-[var(--card-subtle)]" />
  </section>
);

// ── Main Component ─────────────────────────────────────────────────────────

const Order = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    setLoading(true);
    getPaymentByOrderId(orderId)
      .then((data) => {
        if (data?.success && data?.payment) {
          setOrder(data.payment);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [orderId]);

  // ── Guards ──────────────────────────────────────────────────────────────

  if (!orderId) return null;

  if (loading) {
    return (
      <Layout>
        <Skeleton />
      </Layout>
    );
  }

  if (notFound) {
    return (
      <Layout>
        <section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 px-4 py-20 text-center sm:px-6">
          <Package size={48} className="text-[var(--text-muted)]" strokeWidth={1.2} />
          <h1 className="text-xl font-semibold text-(--text)">Order not found</h1>
          <p className="text-sm text-[var(--text-muted)]">
            We couldn&apos;t find an order for this ID.
          </p>
          <Button
            onClick={() => navigate("/")}
            className="mt-2 bg-[var(--primary-btn)] text-[var(--card)]"
          >
            Go Home
          </Button>
        </section>
      </Layout>
    );
  }

  const subtotal = order?.price?.amount ?? 0;
  const orderItems = order?.orderItems ?? [];

  return (
    <Layout>
      <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="mb-10 flex flex-col items-center text-center">
          <span className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 ring-8 ring-green-100">
            <CheckCircle size={42} className="text-green-500" strokeWidth={1.6} />
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-(--text) sm:text-3xl">
            Order placed successfully
          </h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Thank you for your purchase! We&apos;re preparing your items.
          </p>
        </div>

        {/* ── Order Details Card ───────────────────────────────────────── */}
        <div className="mb-6 rounded-lg border border-[var(--border)] bg-[var(--card)] p-5">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            Order Details
          </h2>

          <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <div>
              <p className="mb-0.5 text-[var(--text-muted)]">Order ID</p>
              <p className="truncate font-medium text-(--text)" title={order?.razorpay?.orderId}>
                <span className="font-mono text-xs">
                  {order?.razorpay?.orderId ?? "—"}
                </span>
              </p>
            </div>

            <div>
              <p className="mb-0.5 text-[var(--text-muted)]">Date</p>
              <p className="font-medium text-(--text)">{formatDate(order?.createdAt)}</p>
            </div>

            <div>
              <p className="mb-0.5 text-[var(--text-muted)]">Payment</p>
              <StatusBadge status={order?.status} />
            </div>

            <div>
              <p className="mb-0.5 text-[var(--text-muted)]">Total</p>
              <p className="font-semibold text-(--text)">₹{subtotal}</p>
            </div>
          </div>
        </div>

        {/* ── Order Items ──────────────────────────────────────────────── */}
        {orderItems.length > 0 && (
          <div className="mb-6 rounded-lg border border-[var(--border)] bg-[var(--card)]">
            <h2 className="border-b border-[var(--border)] px-5 py-3 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              Items Ordered
            </h2>

            <ul>
              {orderItems.map((item, i) => (
                <li
                  key={item?.productId ?? i}
                  className={`flex items-start gap-4 px-5 py-4 ${
                    i < orderItems.length - 1
                      ? "border-b border-[var(--border)]"
                      : ""
                  }`}
                >
                  {/* Image */}
                  <button
                    type="button"
                    onClick={() =>
                      item?.productId && navigate(`/product/${item.productId}`)
                    }
                    className="shrink-0 overflow-hidden rounded bg-[var(--card-subtle)] focus:outline-none"
                    aria-label={`View ${item?.title}`}
                  >
                    {item?.images?.url ? (
                      <img
                        src={item.images.url}
                        alt={item.title ?? "Product"}
                        className="h-24 w-20 object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-24 w-20 items-center justify-center text-[10px] text-[var(--text-muted)]">
                        No image
                      </div>
                    )}
                  </button>

                  {/* Details */}
                  <div className="flex flex-1 flex-col gap-1 text-sm">
                    <button
                      type="button"
                      onClick={() =>
                        item?.productId && navigate(`/product/${item.productId}`)
                      }
                      className="text-left font-medium text-(--text) hover:underline focus:outline-none"
                    >
                      {item?.title ?? "—"}
                    </button>

                    <div className="flex flex-wrap gap-3 text-xs text-[var(--text-muted)]">
                      {item?.size && <span>Size: {item.size}</span>}
                      <span>Qty: {item?.quantity ?? 1}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <p className="shrink-0 text-sm font-semibold text-(--text)">
                    ₹{((item?.price?.amount ?? 0) * (item?.quantity ?? 1)).toLocaleString("en-IN")}
                  </p>
                </li>
              ))}
            </ul>

            {/* Subtotal row */}
            <div className="flex justify-end border-t border-[var(--border)] px-5 py-3 text-sm">
              <span className="text-[var(--text-muted)]">Subtotal&nbsp;</span>
              <span className="font-semibold text-(--text)">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        )}

        {/* ── What's next banner ───────────────────────────────────────── */}
        <div className="mb-8 flex items-start gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
          <ShoppingBag
            size={20}
            className="mt-0.5 shrink-0 text-[var(--text-muted)]"
          />
          <div>
            <p className="text-sm font-medium text-(--text)">What happens next?</p>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">
              You&apos;ll receive a confirmation shortly. Your order will be
              dispatched within 1–2 business days.
            </p>
          </div>
        </div>

        {/* ── Actions ─────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={() => navigate("/")}
            className="w-full bg-[var(--primary-btn)] text-[var(--card)] sm:w-auto"
          >
            Continue Shopping
            <ArrowRight size={16} className="ml-1" />
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/orders")}
            className="w-full sm:w-auto"
          >
            View Orders
          </Button>
        </div>

      </section>
    </Layout>
  );
};

export default Order;