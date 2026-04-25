import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { NAV_ITEMS } from "@/app/nav.config";
import { searchProducts } from "@/features/products/services/product.api";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const user = useSelector((state) => state.auth.user);

  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // search state
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const searchInputRef = useRef(null);

  const closeOverlays = () => {
    setSearchOpen(false);
    setMobileMenuOpen(false);
  };

  const openSearch = () => {
    setMobileMenuOpen(false);
    setQuery("");
    setResults([]);
    setSearchOpen(true);
  };

  const openMenu = () => {
    setSearchOpen(false);
    setMobileMenuOpen(true);
  };

  // debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const data = await searchProducts(query.trim());
        setResults(data.products || []);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen && !mobileMenuOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") closeOverlays();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [searchOpen, mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (scrolled) setMobileMenuOpen(false);
  }, [scrolled]);

  useEffect(() => {
    closeOverlays();
  }, [location.pathname]);

  const isActive = !isHome || scrolled || mobileMenuOpen || searchOpen;

  const navLinkClass = `nav-link ${isActive ? "text-(--text)" : "text-white"}`;

  const goToCategory = (category, sub) => {
    const params = new URLSearchParams({ category });
    if (sub) params.set("sub", sub);
    navigate(`/products?${params.toString()}`);
    closeOverlays();
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 border-b transition-colors duration-200 ${
        isActive
          ? "border-[var(--border)] bg-[var(--card)] text-(--text)"
          : "border-transparent bg-transparent text-white"
      }`}
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-5 md:py-6 sm:px-6">
        <div className="grid grid-cols-3 items-center">

          {/* LEFT — mobile hamburger / desktop category nav */}
          <div className="flex items-center justify-start">
            {/* Hamburger (mobile) */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={[
                "md:hidden",
                isActive
                  ? "text-(--text) hover:bg-[var(--card-subtle)]"
                  : "text-white hover:bg-white/10",
              ].join(" ")}
              onClick={() => (mobileMenuOpen ? setMobileMenuOpen(false) : openMenu())}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </Button>

            {/* Desktop category dropdowns — config-driven */}
            <div className="hidden md:flex items-center gap-6">
              {NAV_ITEMS.map((nav) => (
                <div key={nav.category} className="relative group">
                  <button
                    type="button"
                    onClick={() => goToCategory(nav.category)}
                    className={`${navLinkClass} pb-1`}
                  >
                    {nav.label}
                  </button>

                  {/* Dropdown */}
                  <div className="absolute left-0 top-full pt-2 hidden group-hover:block">
                    <div className="min-w-[160px] border border-[var(--border)] bg-[var(--card)] shadow-lg py-2">
                      {nav.items.map((item) => (
                        <button
                          key={item.sub}
                          type="button"
                          onClick={() => goToCategory(nav.category, item.sub)}
                          className="block w-full text-left px-4 py-2 text-sm text-(--text) hover:bg-[var(--card-subtle)] transition"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CENTER — logo */}
          <div className="flex items-center justify-center">
            <Link
              to="/"
              className={[
                "text-xl md:text-2xl font-extrabold tracking-[0.12em] uppercase leading-none",
                isActive ? "text-(--text)" : "text-white",
              ].join(" ")}
            >
              Yanited
            </Link>
          </div>

          {/* RIGHT — actions */}
          <div className="flex items-center justify-end gap-4 md:gap-6">
            {/* Mobile: cart only when menu closed */}
            <div className="flex items-center md:hidden">
              {!mobileMenuOpen && (
                <Link to="/cart" className={navLinkClass}>
                  Cart
                </Link>
              )}
            </div>

            {/* Desktop */}
            <div className="hidden md:flex items-center gap-6">
              {user?.role === "seller" && (
                <Link to="/seller/dashboard" className={navLinkClass}>
                  Dashboard
                </Link>
              )}

              <button
                type="button"
                onClick={openSearch}
                className={navLinkClass}
              >
                Search
              </button>

              <Link to="/cart" className={navLinkClass}>
                Cart
              </Link>
            </div>
          </div>
        </div>

        {/* ── MOBILE DRAWER ── */}
        <>
          {/* Backdrop */}
          <div
            className={[
              "fixed inset-0 z-40 bg-black/55 backdrop-blur-[3px] transition-opacity duration-300 md:hidden",
              mobileMenuOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none",
            ].join(" ")}
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer */}
          <div
            className={[
              "fixed top-0 left-0 z-50 h-full w-[80%] max-w-sm bg-[var(--card)] p-5 shadow-xl transition-transform duration-300 ease-out will-change-transform md:hidden",
              mobileMenuOpen
                ? "translate-x-0"
                : "-translate-x-full pointer-events-none",
            ].join(" ")}
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm font-medium">MENU</span>
              <button type="button" onClick={() => setMobileMenuOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {/* Mobile search */}
            <input
              placeholder="Search for..."
              className="mb-6 w-full border-b pb-2 bg-transparent outline-none placeholder:text-[var(--text-muted)] text-(--text)"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  navigate(`/products?q=${encodeURIComponent(e.target.value.trim())}`);
                  setMobileMenuOpen(false);
                }
              }}
            />

            <div className="space-y-8 text-base font-semibold">
              {/* Config-driven category links */}
              <div className="space-y-4">
                <p className="text-xs uppercase text-[var(--text-muted)] tracking-wide">
                  Shop
                </p>
                <div className="flex flex-col gap-3">
                  {NAV_ITEMS.map((nav) => (
                    <div key={nav.category} className="space-y-2">
                      <button
                        type="button"
                        onClick={() => goToCategory(nav.category)}
                        className="text-(--text) font-semibold"
                      >
                        {nav.label}
                      </button>
                      <div className="flex flex-col gap-1 pl-3">
                        {nav.items.map((item) => (
                          <button
                            key={item.sub}
                            type="button"
                            onClick={() => goToCategory(nav.category, item.sub)}
                            className="text-sm font-normal text-[var(--text-muted)] text-left hover:text-(--text) transition"
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation links */}
              <div className="space-y-4 border-t border-[var(--border)] pt-6">
                <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                  Navigation
                </p>
                <div className="flex flex-col gap-3">
                  <Link
                    to="/cart"
                    className="text-(--text)"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Cart
                  </Link>
                  {user?.role === "seller" && (
                    <Link
                      to="/seller/dashboard"
                      className="text-(--text)"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  {!user && (
                    <>
                      <Link
                        to="/login"
                        className="nav-link text-(--text)"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="nav-link text-(--text)"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      </div>

      {/* ── SEARCH OVERLAY ── */}
      {searchOpen && (
        <div
          className="fixed inset-0 bg-[var(--card)] z-50"
          onClick={closeOverlays}
        >
          <div
            className="h-full flex flex-col items-center justify-center gap-6 px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-6 right-6 text-(--text)"
              onClick={closeOverlays}
            >
              <X size={20} />
            </button>

            {/* Search input */}
            <div className="w-full max-w-xl relative">
              <input
                ref={searchInputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full border-b border-[var(--border)] bg-transparent text-xl outline-none placeholder:text-[var(--text-muted)] text-(--text) pb-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && query.trim()) {
                    navigate(`/products?q=${encodeURIComponent(query.trim())}`);
                    closeOverlays();
                  }
                }}
              />
            </div>

            {/* Results dropdown */}
            {query.trim() && (
              <div className="w-full max-w-xl border border-[var(--border)] bg-[var(--card)] shadow-lg">
                {searching && (
                  <p className="px-4 py-3 text-sm text-[var(--text-muted)]">
                    Searching...
                  </p>
                )}

                {!searching && results.length === 0 && (
                  <p className="px-4 py-3 text-sm text-[var(--text-muted)]">
                    No results for &ldquo;{query}&rdquo;
                  </p>
                )}

                {!searching &&
                  results.map((product) => (
                    <button
                      key={product._id}
                      type="button"
                      onClick={() => {
                        navigate(`/product/${product._id}`);
                        closeOverlays();
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-[var(--card-subtle)] transition border-b border-[var(--border)] last:border-0"
                    >
                      {product.images?.[0]?.url && (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="h-10 w-8 object-cover shrink-0"
                        />
                      )}
                      <div>
                        <p className="text-sm text-(--text)">{product.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">
                          ₹{product.price?.amount}
                        </p>
                      </div>
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
