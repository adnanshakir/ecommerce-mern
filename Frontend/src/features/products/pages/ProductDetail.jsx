import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { useProduct } from "../hooks/useProduct";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import ProductHighlights from "../components/ProductHighlights";

const ProductDetail = () => {
  const { productId } = useParams();
  const { handleGetProductDetails } = useProduct();
  const product = useSelector((state) => state.product.productDetails);

  const [activeIndex, setActiveIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("M");

  const images = useMemo(() => product?.images || [], [product]);
  const activeImageUrl = images[activeIndex]?.url;

  const setPrevImage = () => {
    if (!images.length) return;
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const setNextImage = () => {
    if (!images.length) return;
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  useEffect(() => {
    handleGetProductDetails(productId).catch((error) => {
      console.error("Failed to fetch product details", error);
    });
  }, [productId]);

  useEffect(() => {
    setActiveIndex(0);
    setQuantity(1);
  }, [productId]);

  if (!product) {
    return (
      <main className="min-h-screen bg-[var(--bg)]">
        <Navbar />
        <div className="mx-auto w-full max-w-7xl px-4 pt-28 pb-16 sm:px-6">
          <p className="text-sm text-[var(--text-muted)]">Loading product...</p>
        </div>
        <Footer />
      </main>
    );
  }

  const amount = product?.price?.amount ?? product?.price ?? 0;

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <Navbar />

      <section className="mx-auto w-full max-w-7xl px-4 pt-28 pb-16 sm:px-6">
        <div className="grid items-start gap-10 md:grid-cols-2">
          {/* LEFT */}
          <div>
            <div className="space-y-3 md:grid md:grid-cols-[84px_1fr] md:gap-3 md:space-y-0">
              {/* MAIN IMAGE */}
              <div className="relative group order-1 aspect-[4/5] overflow-hidden bg-[var(--card-subtle)] md:order-2">
                {activeImageUrl ? (
                  <img
                    src={activeImageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover object-center"
                  />
                ) : (
                  <div className="flex aspect-[3/4] items-center justify-center text-xs text-[var(--text-muted)]">
                    No image
                  </div>
                )}

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={setPrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition border border-[var(--border)] bg-[var(--card)] p-1 text-[var(--text)]"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={setNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition border border-[var(--border)] bg-[var(--card)] p-1 text-[var(--text)]"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </>
                )}
              </div>

              {/* THUMBNAILS */}
              <div className="order-2 flex gap-2 overflow-x-auto md:order-1 md:flex-col md:overflow-visible">
                {images.length ? (
                  images.map((image, index) => (
                    <button
                      key={`${image.url}-${index}`}
                      type="button"
                      className={[
                        "h-20 w-16 shrink-0 overflow-hidden border",
                        index === activeIndex
                          ? "border-[var(--border-focus)]"
                          : "border-[var(--border)]",
                      ].join(" ")}
                      onClick={() => setActiveIndex(index)}
                    >
                      <img
                        src={image.url}
                        alt={`${product.name} ${index}`}
                        className="h-full w-full object-cover object-center"
                      />
                    </button>
                  ))
                ) : (
                  <div className="text-xs text-[var(--text-muted)]">
                    No images
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-5">
            <h1 className="text-2xl font-semibold uppercase tracking-[0.08em] text-[var(--text)]">
              {product.name}
            </h1>

            <p className="text-xl text-[var(--text)]">₹{amount}</p>

            <p className="text-sm leading-relaxed text-[var(--text-muted)]">
              {product.description}
            </p>

            {/* SIZE */}
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                Size
              </p>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger className="w-36 border-[var(--border)] bg-[var(--card)] text-[var(--text)]">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {["XS", "S", "M", "L", "XL"].map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* QUANTITY */}
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                Quantity
              </p>
              <div className="inline-flex items-center border border-[var(--border)] bg-[var(--card)]">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-none"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                >
                  <Minus size={14} />
                </Button>
                <span className="min-w-10 px-2 text-center text-sm">
                  {quantity}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-none"
                  onClick={() => setQuantity((prev) => prev + 1)}
                >
                  <Plus size={14} />
                </Button>
                <div className="pt-4">
                  <ProductHighlights />
                </div>{" "}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Button className="bg-[var(--primary-btn)] text-[var(--card)]">
                Add to cart
              </Button>
              <Button variant="outline">Buy now</Button>
            </div>

            {/* INFO */}
            <div className="pt-4">
              <ProductHighlights />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ProductDetail;
