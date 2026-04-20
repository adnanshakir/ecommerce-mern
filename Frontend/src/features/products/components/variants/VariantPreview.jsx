const filePreviewUrlCache = new WeakMap();

const getFilePreviewUrl = (file) => {
  const cached = filePreviewUrlCache.get(file);
  if (cached) return cached;

  const objectUrl = URL.createObjectURL(file);
  filePreviewUrlCache.set(file, objectUrl);
  return objectUrl;
};

const getPreviewImage = (variant) => {
  if (variant.images?.length) {
    const first = variant.images[0];

    if (first?.url) return first.url;

    if (first instanceof File) {
      return getFilePreviewUrl(first);
    }

    if (typeof first === "string") return first;
  }

  if (variant.initialImages?.length) {
    const first = variant.initialImages[0];
    if (first?.url) return first.url;
    if (typeof first === "string") return first;
  }

  return "";
};

const VariantPreviewRow = ({ variant, index, baseCurrency }) => {
  const image = getPreviewImage(variant);

  return (
    <div className="flex gap-4 border border-[var(--border)] p-3 sm:p-4">
      <div className="aspect-[3/4] w-20 shrink-0 overflow-hidden bg-[var(--card-subtle)]">
        {image ? (
          <img
            src={image}
            alt={`Saved variant ${index + 1}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-[var(--text-muted)]">
            No image
          </div>
        )}
      </div>

      <div className="space-y-1.5 text-[var(--text)]">
        <p className="text-sm font-medium leading-tight">
          {baseCurrency} {variant.price?.amount || "Base"}
        </p>

        <p className="text-xs text-[var(--text-muted)]">Stock: {variant.stock}</p>

        {Object.entries(variant.attributes || {}).map(([key, value]) => (
          <p key={`${key}-${value}`} className="text-xs text-[var(--text)]">
            {key}: {value}
          </p>
        ))}
      </div>
    </div>
  );
};

const VariantPreview = ({ variants, baseCurrency }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-base font-semibold text-[var(--text)]">
        Saved Variants
      </h2>

      <div className="grid gap-4">
        {variants.map((variant, index) => (
          <VariantPreviewRow
            key={variant.id || index}
            variant={variant}
            index={index}
            baseCurrency={baseCurrency}
          />
        ))}
      </div>
    </div>
  );
};

export default VariantPreview;
