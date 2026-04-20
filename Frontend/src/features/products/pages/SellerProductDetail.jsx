import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { useProduct } from "../hooks/useProduct";
import { Button } from "@/components/ui/Button";
import ProductBaseInfo from "../components/variants/ProductBaseInfo";
import VariantCard from "../components/variants/VariantCard";
import VariantPreview from "../components/variants/VariantPreview";
import {
  createVariant,
  formatVariantsPayload,
} from "../components/variants/variant.helpers";

const SellerProductDetail = () => {
  const { productId } = useParams();
  const { handleGetProductDetails } = useProduct();
  const product = useSelector((state) => state.product.productDetails);
  const [variants, setVariants] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [viewMode, setViewMode] = useState("edit");
  const initializedRef = useRef(false);

  const baseImages = useMemo(() => product?.images || [], [product]);
  const basePriceAmount = product?.price?.amount ?? 0;
  const baseCurrency = product?.price?.currency || "INR";

  const mappedVariants = useMemo(() => {
    const sourceVariants = product?.variants ?? product?.varients;
    if (!sourceVariants?.length) return [];

    return sourceVariants.map((variant) => ({
      images: [],
      initialImages: variant.images || [],
      stock: variant.stock ?? 0,
      price: {
        amount: variant?.price?.amount ? String(variant.price.amount) : "",
        currency: variant?.price?.currency || product?.price?.currency || "INR",
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
  }, [productId]);

  useEffect(() => {
    initializedRef.current = false;
    setVariants([]);
    setSaved(false);
    setViewMode("edit");
  }, [productId]);

  useEffect(() => {
    if (!product || initializedRef.current) return;

    if (mappedVariants.length) {
      setVariants(mappedVariants);
    } else {
      setVariants([createVariant(product?.price?.currency || "INR")]);
    }

    initializedRef.current = true;
  }, [mappedVariants, product]);

  const updateVariant = (index, updater) => {
    setVariants((prev) => prev.map((v, i) => (i === index ? updater(v) : v)));
  };

  const handleAddVariant = () => {
    setVariants((prev) => [...prev, createVariant(baseCurrency)]);
  };

  const removeVariant = (index) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!product) return;

    try {
      setSaving(true);
      setSaved(false);

      const payload = formatVariantsPayload(
        variants,
        baseImages,
        basePriceAmount,
        baseCurrency,
      );

      console.log(payload);
      await new Promise((res) => setTimeout(res, 800));
      setSaved(true);
      setViewMode("preview");
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
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
    <main className="min-h-screen bg-[var(--bg)]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-2">
        <ProductBaseInfo
          product={product}
          baseCurrency={baseCurrency}
          basePrice={basePriceAmount}
          baseImages={baseImages}
        />

        <section className="space-y-6">
          {viewMode === "edit" ? (
            <>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-[var(--text)]">Variants</h2>
              <Button type="button" variant="outline" onClick={handleAddVariant}>
                Add Variant
              </Button>
            </div>

            {variants.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)]">
                No variants yet. Add one to start.
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
              <Button type="button" onClick={handleSubmit} disabled={saving}>
                {saving ? "Saving..." : saved ? "Saved ✓" : "Save Variants"}
              </Button>
            </div>
            </>
          ) : (
            <>
              <VariantPreview variants={variants} baseCurrency={baseCurrency} />

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setViewMode("edit")}>
                  Edit Variants
                </Button>

                <Button
                  onClick={() => {
                    handleAddVariant();
                    setViewMode("edit");
                  }}
                >
                  Add More
                </Button>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
};

export default SellerProductDetail;
