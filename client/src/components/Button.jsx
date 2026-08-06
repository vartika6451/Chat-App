/* eslint-disable */
"use client";

import React from "react";
import { motion } from "framer-motion";
import Loader from "./Loader";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  onClick,
  type = "button",
  className = "",
  iconBefore,
  iconAfter,
  ...props
}) => {
  const baseStyles = "relative inline-flex items-center justify-center font-semibold transition-all focus:outline-none rounded-2xl active:scale-[0.98] select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50";

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3.5 text-base",
  };

  const variants = {
    primary: "bg-gradient-to-r from-[var(--color-brand-accent-pink-light)] to-[var(--color-brand-accent-pink)] hover:opacity-95 text-white shadow-md shadow-pink-500/10 border border-transparent",
    secondary: "bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200 shadow-sm",
    accent: "bg-[var(--color-brand-accent-pink)] hover:opacity-90 text-white shadow-md shadow-pink-500/10 border border-transparent",
    danger: "bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/10 border border-transparent",
    outline: "bg-transparent hover:bg-zinc-50 text-zinc-700 border border-zinc-200",
    glass: "bg-white/30 hover:bg-white/40 border border-white/50 backdrop-blur-md text-zinc-800",
    ghost: "bg-transparent hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 border border-transparent",
  };

  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    if (onClick) onClick(e);
  };

  return (
    <motion.button
      type={type}
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      onClick={handleClick}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      {...props}
    >
      {loading && (
        <span className="mr-2">
          <Loader size="sm" color="current" />
        </span>
      )}
      {!loading && iconBefore && <span className="mr-2 flex items-center">{iconBefore}</span>}
      <span className={loading ? "opacity-90" : ""}>{children}</span>
      {!loading && iconAfter && <span className="ml-2 flex items-center">{iconAfter}</span>}
    </motion.button>
  );
};

export default Button;
