import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { useProduct } from "../hooks/useProduct";
import { Button } from "@/components/ui/Button";
import ProductBaseInfo from "../components/variants/ProductBaseInfo";
import VariantCard from "../components/variants/VariantCard";
import {
  createVariant,
  formatVariantsPayload,
} from "../components/variants/variant.helpers";

const SellerProductDetail = () => {
  const { productId } = useParams();
  const { handleGetProductDetails } = useProduct();
  const product = useSelector((state) => state.product.productDetails);
  const [variants, setVariants] = useState([]);

  const baseImages = useMemo(() => product?.images || [], [product]);
  const basePriceAmount = product?.price?.amount ?? 0;
  const baseCurrency = product?.price?.currency || "INR";

  const initialVariants = useMemo(() => {
    if (!product?.varients?.length) return [];

    return product.varients.map((variant) => ({
      images: [],
      initialImages: variant.images || [],
      stock: variant.stock ?? 0,
      price: {
        amount: variant?.price?.amount ? String(variant.price.amount) : "",
        currency: variant?.price?.currency || product.price.currency,
      },
      attributes: Object.fromEntries(
        Object.entries(variant?.attributes || {}).map(([k, v]) => [k, v ?? ""]),
      ),
      useCustomImages: !!variant?.images?.length,
      useCustomPrice: !!variant?.price?.amount,
    }));
  }, [product]);

  useEffect(() => {
    handleGetProductDetails(productId).catch((error) => {
      console.error("Failed to fetch product details", error);
    });
  }, [handleGetProductDetails, productId]);

  useEffect(() => {
    if (initialVariants.length && variants.length === 0) setVariants(initialVariants);
  }, [initialVariants]);

  const updateVariant = (index, updater) => {
    setVariants((prev) => prev.map((v, i) => (i === index ? updater(v) : v)));
  };

  const handleAddVariant = () => {
    setVariants((prev) => [...prev, createVariant(baseCurrency)]);
  };

  const removeVariant = (index) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!product) return;

    console.log(
      formatVariantsPayload(variants, baseImages, basePriceAmount, baseCurrency),
    );
  };

  if (!product) {
    return (
      <main className="min-h-screen bg-[var(--bg)] px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-7xl text-sm text-[var(--text-muted)]">
          Loading product details...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="grid items-start gap-8 lg:grid-cols-[320px_1fr]">
          <ProductBaseInfo
            product={product}
            baseCurrency={baseCurrency}
            basePrice={basePriceAmount}
            baseImages={baseImages}
          />

          <section className="mt-10 space-y-6 lg:mt-0">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-[var(--text)]">Variants</h2>
              <Button type="button" onClick={handleAddVariant}>
                Add Variant
              </Button>
            </div>

            {variants.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)]">
                No variants added yet.
              </p>
            ) : (
              variants.map((variant, index) => (
                <VariantCard
                  key={`variant-${index}`}
                  variant={variant}
                  index={index}
                  onChange={updateVariant}
                  onRemove={removeVariant}
                  baseImages={baseImages}
                  basePrice={basePriceAmount}
                  baseCurrency={baseCurrency}
                />
              ))
            )}

            <div className="pt-2">
              <Button type="button" onClick={handleSubmit}>
                Save Variants
              </Button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default SellerProductDetail;
