import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { getAllProducts } from "../services/product.api";
import Layout from "@/components/layout/Layout";
import { NAV_ITEMS } from "@/app/nav.config";

const Products = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const category = searchParams.get("category");
  const sub = searchParams.get("sub");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAllProducts({ category, sub })
      .then((data) => setProducts(data.products || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category, sub]);

  // derive heading from config
  const navItem = NAV_ITEMS.find((n) => n.category === category);
  const subItem = navItem?.items.find((i) => i.sub === sub);
  const heading = subItem?.label || navItem?.label || "All Products";

  return (
    <Layout>
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <p className="mb-2 text-xs text-[var(--text-muted)]">
          Home{category ? ` / ${navItem?.label || category}` : ""}
          {sub ? ` / ${subItem?.label || sub}` : ""}
        </p>
        <h1 className="mb-8 text-xl font-bold text-(--text)">{heading}</h1>

        {loading && (
          <p className="text-sm text-[var(--text-muted)]">Loading...</p>
        )}

        {!loading && !products.length && (
          <p className="text-sm text-[var(--text-muted)]">No products found.</p>
        )}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <button
              key={product._id}
              type="button"
              onClick={() => navigate(`/product/${product._id}`)}
              className="group text-left"
            >
              <div className="aspect-[3/4] overflow-hidden bg-[var(--card-subtle)]">
                {product.images?.[0]?.url ? (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-[var(--text-muted)]">
                    No image
                  </div>
                )}
              </div>
              <div className="mt-2 space-y-0.5">
                <p className="text-sm font-medium text-(--text) truncate">
                  {product.name}
                </p>
                <p className="text-sm text-[var(--text-muted)]">
                  ₹{product.price?.amount}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Products;
