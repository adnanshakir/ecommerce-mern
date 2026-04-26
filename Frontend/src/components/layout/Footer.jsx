import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="mt-20 bg-[var(--footer-bg,#0f0f0f)] text-[var(--footer-text,#d4d4d4)]">
      <div className="mx-auto max-w-7xl px-6 py-12 grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">

        {/* Logo & Tagline */}
        <div className="col-span-2 sm:col-span-1 space-y-2">
          <p className="text-lg font-semibold text-white">YANITED</p>
          <p className="text-xs text-[var(--text-muted)]">
            Minimal fashion. Maximum intent.
          </p>
        </div>

        {/* Links: Shop */}
        <div className="flex flex-col gap-2">
          <h3 className="mb-2 font-semibold text-white">Shop</h3>
          <Link to="/products?category=tops" className="hover:text-white transition-colors duration-200">Tops</Link>
          <Link to="/products?category=bottoms" className="hover:text-white transition-colors duration-200">Bottoms</Link>
        </div>

        {/* Links: Account */}
        <div className="flex flex-col gap-2">
          <h3 className="mb-2 font-semibold text-white">Account</h3>
          <Link to="/orders" className="hover:text-white transition-colors duration-200">Orders</Link>
          <Link to="/cart" className="hover:text-white transition-colors duration-200">Cart</Link>
        </div>
      </div>

      <div className="border-t border-white/10 mt-8 pt-4 pb-6 text-center text-xs text-[var(--text-muted)]">
        © 2026 Yanited
      </div>
    </footer>
  );
};

export default Footer;