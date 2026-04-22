import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const user = useSelector((state) => state.auth.user);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeOverlays = () => {
    setSearchOpen(false);
    setMobileMenuOpen(false);
  };

  const openSearch = () => {
    setMobileMenuOpen(false);
    setSearchOpen(true);
  };

  const openMenu = () => {
    setSearchOpen(false);
    setMobileMenuOpen(true);
  };

  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen && !mobileMenuOpen) return;

    const handleKey = (e) => {
      if (e.key === "Escape") {
        closeOverlays();
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  }, [searchOpen, mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (scrolled) setMobileMenuOpen(false);
  }, [scrolled]);

  useEffect(() => {
    closeOverlays();
  }, [location.pathname]);

  const isActive = !isHome || scrolled || mobileMenuOpen || searchOpen;

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
          {/* LEFT */}
          <div className="flex items-center justify-start">
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
              onClick={() => {
                if (mobileMenuOpen) {
                  setMobileMenuOpen(false);
                } else {
                  openMenu();
                }
              }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </Button>

            <div className="hidden md:flex items-center gap-6">
              <Link to="/category/tops" className="nav-link">
                Tops
              </Link>
              <Link to="/category/bottoms" className="nav-link">
                Bottoms
              </Link>
            </div>
          </div>

          {/* CENTER */}
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

          {/* RIGHT */}
          <div className="flex items-center justify-end gap-4 md:gap-6">
            {/* MOBILE */}
            <div className="flex items-center md:hidden">
              {!mobileMenuOpen && (
                <Link
                  to="/cart"
                  className={`nav-link ${isActive ? "text-(--text)" : "text-white"}`}
                >
                  Cart
                </Link>
              )}
            </div>

            {/* DESKTOP */}
            <div className="hidden md:flex items-center gap-6">
              {user?.role === "seller" && (
                <Link
                  to="/seller/dashboard"
                  className={`nav-link ${isActive ? "text-(--text)" : "text-white"}`}
                >
                  Dashboard
                </Link>
              )}

              <button
                type="button"
                onClick={openSearch}
                className={`nav-link ${isActive ? "text-(--text)" : "text-white"}`}
              >
                Search
              </button>

              <Link
                to="/cart"
                className={`nav-link ${isActive ? "text-(--text)" : "text-white"}`}
              >
                Cart
              </Link>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        <>
          {/* backdrop */}
          <div
            className={[
              "fixed inset-0 z-40 bg-black/55 backdrop-blur-[3px] transition-opacity duration-300 md:hidden",
              mobileMenuOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none",
            ].join(" ")}
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* drawer */}
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
                ✕
              </button>
            </div>

            <input
              placeholder="Search for"
              className="mb-6 w-full border-b pb-2 outline-none placeholder:text-[var(--text-muted)]"
            />

            <div className="space-y-8 text-base">
              <div className="space-y-4">
                <p className="text-xs uppercase text-[var(--text-muted)] tracking-wide">
                  Shop
                </p>

                <div className="flex flex-col gap-3">
                  <Link to="/category/tops" className="nav-link">
                    Tops
                  </Link>
                  <Link to="/category/bottoms" className="nav-link">
                    Bottoms
                  </Link>
                </div>
              </div>

              <div className="space-y-4 border-t pt-6">
                <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                  Navigation
                </p>

                <div className="flex flex-col gap-3">
                  <Link
                    to="/cart"
                    className="nav-link text-(--text)"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Cart
                  </Link>
                  {user?.role === "seller" && (
                    <Link
                      to="/seller/dashboard"
                      className="nav-link text-(--text)"
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
      {searchOpen && (
        <div
          className="fixed inset-0 bg-[var(--card)] z-50"
          onClick={closeOverlays}
        >
          <div
            className="h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="absolute top-6 right-6" onClick={closeOverlays}>
              ✕
            </button>

            <input
              autoFocus
              placeholder="Search for"
              className="w-1/2 border-b bg-transparent text-xl outline-none placeholder:text-[var(--text-muted)]"
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
