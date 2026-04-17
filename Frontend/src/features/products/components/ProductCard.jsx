import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const ProductCard = ({ product, onClick }) => {
  const imageUrl = product?.images?.[0]?.url;
  const name = product?.name || "Untitled product";
  const description = product?.description || "";
  const amount = product?.price?.amount ?? product?.price ?? 0;
  const currency = product?.price?.currency || "INR";

  return (
    <Card
      className="cursor-pointer bg-[var(--card)] transition-all duration-200 hover:shadow-sm"
      onClick={onClick}
      aria-label={`View ${name}`}
    >
      <CardContent className="pt-0 px-3 pb-3 space-y-3">
        <div className="aspect-square overflow-hidden rounded-md bg-[var(--card-subtle)]">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-[11px] text-[var(--text-muted)]">
              No image
            </div>
          )}
        </div>

        <div className="space-y-1">
          <p className="truncate text-sm font-semibold text-[var(--text)]">
            {name}
          </p>
          <p className="text-sm font-medium text-[var(--text)]">
            {currency === "INR" ? "₹" : `${currency} `}
            {amount}
          </p>
          {description ? (
            <p className="line-clamp-2 text-xs text-[var(--text-muted)]">
              {description}
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
