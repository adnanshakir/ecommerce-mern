import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { NAV_ITEMS } from "@/app/nav.config";
import { searchProducts } from "@/features/products/services/product.api";
import MobileDrawer from "./MobileDrawer";
import SearchOverlay from "./SearchOverlay";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const user = useSelector((state) => state.auth.user);

  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* Desktop search state — owned here, passed to SearchOverlay */
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const searchInputRef = useRef(null);

  /* ── Helpers ── */
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

  const goToCategory = (category, sub) => {
    const params = new URLSearchParams({ category });
    if (sub) params.set("sub", sub);
    navigate(`/products?${params.toString()}`);
    closeOverlays();
  };

  /* ── Debounced desktop search ── */
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

  /* Lock body scroll + focus input when search opens */
  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [searchOpen]);

  /* Escape key closes any open overlay */
  useEffect(() => {
    if (!searchOpen && !mobileMenuOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") closeOverlays();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [searchOpen, mobileMenuOpen]);

  /* Scroll detection */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (scrolled) setMobileMenuOpen(false);
  }, [scrolled]);

  /* Close on route change */
  useEffect(() => {
    closeOverlays();
  }, [location.pathname]);

  /* ── Derived styles ── */
  const isActive = !isHome || scrolled || mobileMenuOpen || searchOpen;
  const navLinkClass = `nav-link ${isActive ? "text-(--text)" : "text-white"}`;

  return (
    <>
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

              {/* Desktop category dropdowns */}
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
                SNITCH
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
                <button type="button" onClick={openSearch} className={navLinkClass}>
                  Search
                </button>
                <Link to="/cart" className={navLinkClass}>
                  Cart
                </Link>
                {!user && (
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className={navLinkClass}
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ── */}
      <MobileDrawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        goToCategory={goToCategory}
        user={user}
      />

      {/* ── DESKTOP SEARCH OVERLAY ── */}
      <SearchOverlay
        open={searchOpen}
        query={query}
        results={results}
        searching={searching}
        inputRef={searchInputRef}
        onQueryChange={setQuery}
        onClose={closeOverlays}
      />
    </>
  );
};

export default Navbar;
