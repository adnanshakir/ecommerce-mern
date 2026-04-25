const Footer = () => {
  return (
    <footer className="mt-16 border-t border-[var(--border)]">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-10 text-sm md:grid-cols-4">
        <div>
          <h3 className="mb-3 font-semibold text-(--text)">Shop</h3>
          <p className="text-[var(--text-muted)]">Tops</p>
          <p className="text-[var(--text-muted)]">Bottoms</p>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-(--text)">Company</h3>
          <p className="text-[var(--text-muted)]">About</p>
          <p className="text-[var(--text-muted)]">Contact</p>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-(--text)">Help</h3>
          <p className="text-[var(--text-muted)]">Returns</p>
          <p className="text-[var(--text-muted)]">Shipping</p>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-(--text)">Follow</h3>
          <p className="text-[var(--text-muted)]">Instagram</p>
        </div>
      </div>

      <div className="pb-6 text-center text-xs text-[var(--text-muted)]">
        © 2026 Yanited
      </div>
    </footer>
  );
};

export default Footer;