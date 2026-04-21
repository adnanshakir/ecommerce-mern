import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { Menu, ShoppingBag, X, Search } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const user = useSelector((state) => state.auth.user);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

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
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (scrolled) setMobileMenuOpen(false);
  }, [scrolled]);

  useEffect(() => {
    closeOverlays();
  }, [location.pathname]);

  const isActive =
    !isHome || scrolled || (isDesktop && hovered) || mobileMenuOpen;

  return (
    <nav
      onMouseEnter={() => {
        if (!mobileMenuOpen && isDesktop) setHovered(true);
      }}
      onMouseLeave={() => {
        if (isDesktop) setHovered(false);
      }}
      className={`${
        isHome ? "fixed top-0" : "relative"
      } w-full z-50 transition-colors duration-200 ${
        isActive
          ? "bg-[var(--card)] text-[var(--text)]"
          : "bg-transparent text-white"
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
                  ? "text-[var(--text)] hover:bg-[var(--card-subtle)]"
                  : "text-white hover:bg-white/10",
              ].join(" ")}
              onClick={() => {
                if (mobileMenuOpen) {
                  setMobileMenuOpen(false);
                } else {
                  openMenu();
                }
                setHovered(false);
              }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </Button>
          </div>

          {/* CENTER */}
          <div className="flex items-center justify-center">
            <Link
              to="/"
              className={[
                "text-xl md:text-2xl font-extrabold tracking-[0.12em] uppercase leading-none",
                isActive ? "text-[var(--text)]" : "text-white",
              ].join(" ")}
            >
              SNITCH
            </Link>
          </div>

          {/* RIGHT */}
          <div className="flex items-center justify-end gap-2">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className={[
                isActive
                  ? "text-[var(--text)] hover:bg-[var(--card-subtle)]"
                  : "text-white hover:bg-white/10",
                mobileMenuOpen
                  ? "opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto"
                  : "",
              ].join(" ")}
            >
              <Link to="/cart">
                <ShoppingBag size={18} />
              </Link>
            </Button>

            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <>
                  {/* SELLER ONLY */}
                  {user.role === "seller" && (
                    <Button
                      asChild
                      variant="ghost"
                      className={
                        isActive
                          ? "text-[var(--text)] hover:bg-[var(--card-subtle)]"
                          : "text-white hover:bg-white/10 hover:text-white"
                      }
                    >
                      <Link to="/seller/dashboard">Dashboard</Link>
                    </Button>
                  )}

                  {/* SEARCH */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={
                      isActive
                        ? "text-[var(--text)] hover:bg-[var(--card-subtle)]"
                        : "text-white hover:bg-white/10"
                    }
                    onClick={openSearch}
                  >
                    <Search size={18} />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    asChild
                    variant="ghost"
                    className={
                      isActive
                        ? "text-[var(--text)] hover:bg-[var(--card-subtle)]"
                        : "text-white hover:bg-white/10 hover:text-white"
                    }
                  >
                    <Link to="/login">Login</Link>
                  </Button>

                  <Button
                    asChild
                    variant="ghost"
                    className={
                      isActive
                        ? "text-[var(--text)] hover:bg-[var(--card-subtle)]"
                        : "text-white hover:bg-white/10 hover:text-white"
                    }
                  >
                    <Link to="/register">Register</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <>
            {/* backdrop */}
            <div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* drawer */}
            <div className="fixed top-0 left-0 h-full w-[80%] max-w-sm bg-[var(--card)] z-50 p-5 transition-transform duration-300 md:hidden">
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

              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-xs text-[var(--text-muted)]">Shop</p>
                  <p className="text-base text-[var(--text)]">Tops</p>
                  <p className="text-base text-[var(--text)]">Bottoms</p>
                </div>

                <div className="space-y-3 border-t pt-6">
                  <p className="text-xs text-[var(--text-muted)]">Navigation</p>
                  {user?.role === "seller" && (
                    <Link
                      to="/seller/dashboard"
                      className="block text-base text-[var(--text)]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  {!user && (
                    <>
                      <Link
                        to="/login"
                        className="block text-base text-[var(--text)]"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="block text-base text-[var(--text)]"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
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
            <button
              className="absolute top-6 right-6"
              onClick={closeOverlays}
            >
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
