import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Menu, ShoppingBag, X } from "lucide-react";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (scrolled) setMobileMenuOpen(false);
  }, [scrolled]);

  const isActive = scrolled || hovered || mobileMenuOpen;

  return (
    <nav
      onMouseEnter={() => !mobileMenuOpen && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={[
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isActive
          ? "bg-[var(--card)] text-[var(--text)]"
          : "bg-transparent text-white",
      ].join(" ")}
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-5 md:py-6 sm:px-6">
        <div className="grid grid-cols-3 items-center">
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
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </Button>

            <div className="hidden md:flex items-center gap-2 text-sm">
              {user ? (
                <Link
                  to="/seller/dashboard"
                  className={isActive ? "text-[var(--text)]" : "text-white"}
                >
                  Dashboard
                </Link>
              ) : null}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Link
              to="/"
              className={[
                "text-xl md:text-2xl font-semibold tracking-[0.12em] uppercase leading-none",
                isActive ? "text-[var(--text)]" : "text-white",
              ].join(" ")}
            >
              SNITCH
            </Link>
          </div>

          <div className="flex items-center justify-end gap-2">
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <Button
                  asChild
                  variant="outline"
                  className="border-[var(--border)] bg-transparent text-[var(--text)] hover:bg-[var(--card-subtle)]"
                >
                  <Link to="/seller/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button
                    asChild
                    variant="ghost"
                    className={isActive ? "text-[var(--text)] hover:bg-[var(--card-subtle)]" : "text-white hover:bg-white/10 hover:text-white"}
                  >
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className={isActive ? "text-[var(--text)] hover:bg-[var(--card-subtle)]" : "text-white hover:bg-white/10 hover:text-white"}
                  >
                    <Link to="/register">Register</Link>
                  </Button>
                </>
              )}
            </div>

            <Button
              asChild
              variant="ghost"
              size="icon"
              className={isActive ? "text-[var(--text)] hover:bg-[var(--card-subtle)]" : "text-white hover:bg-white/10"}
              aria-label="Bag"
            >
              <Link to="/">
                <ShoppingBag size={18} />
              </Link>
            </Button>
          </div>
        </div>

        {mobileMenuOpen ? (
          <div className="md:hidden absolute top-full left-0 w-full bg-[var(--card)] border-t border-[var(--border)] p-4">
            {user ? (
              <Button
                asChild
                variant="ghost"
                className="w-full justify-start text-[var(--text)] hover:bg-[var(--card-subtle)]"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link to="/seller/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start text-[var(--text)] hover:bg-[var(--card-subtle)]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link to="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start text-[var(--text)] hover:bg-[var(--card-subtle)]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
          </div>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;