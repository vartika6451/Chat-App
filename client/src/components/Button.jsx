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
  const baseStyles = "relative inline-flex items-center justify-center font-medium transition-all focus:outline-none rounded-xl active:scale-[0.98] select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50";

  const sizes = {
    sm: "px-3.5 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-7 py-3.5 text-lg",
  };

  const variants = {
    primary: "bg-brand-primary hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 border border-transparent",
    secondary: "bg-brand-card hover:bg-zinc-700 text-white border border-zinc-700/50",
    accent: "bg-brand-accent hover:bg-violet-600 text-white shadow-lg shadow-violet-500/20 border border-transparent",
    danger: "bg-brand-danger hover:bg-red-600 text-white shadow-lg shadow-red-500/20 border border-transparent",
    outline: "bg-transparent hover:bg-zinc-800 text-white border border-zinc-700",
    glass: "glass-panel hover:bg-zinc-800/80 text-white border border-white/10 backdrop-blur-md",
    ghost: "bg-transparent hover:bg-zinc-800 text-gray-300 hover:text-white border border-transparent",
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
