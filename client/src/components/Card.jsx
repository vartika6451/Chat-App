"use client";

import React from "react";
import { motion } from "framer-motion";

const Card = ({
  children,
  variant = "default",
  hoverEffect = false,
  className = "",
  onClick,
  ...props
}) => {
  const baseStyles = "rounded-[24px] border border-zinc-200/60 dark:border-zinc-800/40 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300";

  const variants = {
    default: "bg-brand-surface",
    card: "bg-brand-card",
    glass: "bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md",
    gradient: "relative bg-brand-surface before:absolute before:inset-0 before:p-[1px] before:bg-gradient-to-r before:from-brand-primary before:to-brand-accent before:rounded-[24px] before:content-[''] before:-z-10 bg-clip-border",
  };

  const interactiveProps = onClick
    ? {
        onClick,
        whileHover: hoverEffect ? { y: -3, scale: 1.01, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" } : {},
        whileTap: { scale: 0.99 },
        className: `${baseStyles} ${variants[variant]} cursor-pointer select-none ${className}`,
      }
    : {
        className: `${baseStyles} ${variants[variant]} ${className}`,
      };

  const Component = onClick ? motion.div : "div";

  return (
    <Component {...interactiveProps} {...props}>
      {children}
    </Component>
  );
};

export default Card;
