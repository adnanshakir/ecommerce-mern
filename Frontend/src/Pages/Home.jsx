import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Layout from "@/components/layout/Layout";
import { useProduct } from "@/features/products/hooks/useProduct";
import ProductCard from "@/features/products/components/ProductCard";
import { Link } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const products = useSelector((state) => state.product.products);
  const { handleGetAllProducts } = useProduct();

  useEffect(() => {
    handleGetAllProducts().catch((error) => {
      console.error("Failed to fetch products", error);
    });
  }, []);

  return (
    <Layout mainClassName="bg-[var(--bg)]">
      <section className="relative h-screen min-h-[600px] w-full">
        <picture>
          {/* mobile */}
          <source
            media="(max-width: 640px)"
            srcSet="https://plus.unsplash.com/premium_photo-1688497831503-235238709bd2?auto=format&fit=crop&w=600&q=80&crop=faces"
          />

          {/* tablet */}
          <source
            media="(max-width: 1024px)"
            srcSet="https://images.unsplash.com/photo-1749222200222-93399b2b65dd?auto=format&fit=crop&w=1200&q=80"
          />

          {/* desktop */}
          <img
            src="https://images.unsplash.com/photo-1724184888128-a9967d0542ad?auto=format&fit=crop&w=1800&q=80"
            alt="SNITCH hero"
            className="absolute inset-0 h-full w-full object-cover object-[center_top]"
          />
        </picture>
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white sm:px-6">
          <button
            onClick={() =>
              document
                .getElementById("products")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="mt-6 border border-white px-6 py-2 text-sm text-white transition-colors duration-200 hover:bg-white hover:text-black"
          >
            Shop
          </button>
        </div>
      </section>

      <section
        id="products"
        className="mx-auto w-full max-w-7xl px-4 py-20 text-center sm:px-6"
      >
        <h2 className="mb-10 text-2xl font-medium tracking-tight text-(--text)">
          Latest Drops
        </h2>

        {products?.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="block"
              >
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-10 flex flex-col items-center justify-center space-y-3 text-center">
            <p className="text-sm text-[var(--text-muted)]">No products yet</p>
            <button
              onClick={() => navigate("/seller/create-product")}
              className="border border-[var(--border)] px-5 py-2 text-sm text-(--text) transition-colors duration-200 hover:bg-[var(--card-subtle)]"
            >
              Create Product
            </button>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Home;
