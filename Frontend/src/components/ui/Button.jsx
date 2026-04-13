import React from "react";

/**
 * Button — Reusable button component for the Snitch design system.
 *
 * @param {"primary" | "secondary" | "outline"} variant
 * @param {React.ReactNode} children
 * @param {string} [className]
 * @param {boolean} [disabled]
 * @param {string} [type]
 * @param {Function} [onClick]
 */

const variantStyles = {
  primary: [
    "bg-[var(--primary-btn)] text-white",
    "hover:bg-[var(--primary-hover)]",
    "disabled:bg-[#b8a89f] disabled:cursor-not-allowed",
  ].join(" "),

  secondary: [
    "bg-[var(--secondary-bg)] text-[var(--text)]",
    "hover:bg-[#d6d4d4]",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ].join(" "),

  outline: [
    "bg-transparent text-[var(--text)] border border-[var(--border)]",
    "hover:border-[var(--border-focus)] hover:bg-[var(--card-subtle)]",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ].join(" "),
};

const Button = ({
  variant = "primary",
  children,
  className = "",
  disabled = false,
  type = "button",
  onClick,
  ...rest
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        /* base */
        "inline-flex items-center justify-center gap-2",
        "w-full px-5 py-3 rounded-lg",
        "text-sm font-semibold tracking-wide",
        /* motion */
        "transition-all duration-200 ease-in-out",
        "hover:scale-[1.02]",
        "active:scale-[0.98]",
        /* variant */
        variantStyles[variant] ?? variantStyles.primary,
        /* consumer overrides */
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
