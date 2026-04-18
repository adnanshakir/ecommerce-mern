import React from "react";
import { useNavigate } from "react-router";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-[var(--border)] mt-20">
      <div className="max-w-5xl  mx-auto px-4 py-10 flex flex-col items-center gap-4 text-sm text-[var(--text-muted)]">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/")}
            className="hover:text-[var(--text)] transition"
          >
            Home
          </button>
        </div>

        <div className="flex items-center gap-4">
          <a href="#" aria-label="Instagram" className="hover:text-[var(--text)] transition">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm5 5a5 5 0 110 10 5 5 0 010-10zm6.5-.8a1.3 1.3 0 11-2.6 0 1.3 1.3 0 012.6 0zM12 9a3 3 0 100 6 3 3 0 000-6z" />
            </svg>
          </a>
        </div>

        <p>© 2026 SNITCH</p>
      </div>
    </footer>
  );
};

export default Footer;