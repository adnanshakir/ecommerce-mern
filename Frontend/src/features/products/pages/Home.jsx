import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useProduct } from "../hooks/useProduct";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "../components/ProductCard";

const HERO_IMAGE_URL =
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1800&q=80";

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
    <main className="bg-[var(--bg)]">
      <section className="relative h-screen min-h-[600px] w-full">
        <img
          src={HERO_IMAGE_URL}
          alt="SNITCH hero"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />

        <Navbar />

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
        className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16"
      >
        <h2 className="text-xl font-medium text-[var(--text)]">Latest Drops</h2>

        {products?.length ? (
          <div
            className={products.length < 4 ? "mx-auto mt-8 max-w-6xl" : "mt-8"}
          >
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
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
          </div>
        ) : (
          <div className="mt-10 flex flex-col items-center justify-center space-y-3 text-center">
            <p className="text-sm text-[var(--text-muted)]">No products yet</p>
            <button
              onClick={() => navigate("/seller/create-product")}
              className="border border-[var(--border)] px-5 py-2 text-sm text-[var(--text)] transition-colors duration-200 hover:bg-[var(--card-subtle)]"
            >
              Create Product
            </button>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
};

export default Home;
