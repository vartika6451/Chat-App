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
  const baseStyles = "rounded-2xl border border-zinc-800 overflow-hidden";

  const variants = {
    default: "bg-brand-surface",
    card: "bg-brand-card",
    glass: "glass-panel",
    gradient: "relative bg-brand-surface before:absolute before:inset-0 before:p-[1px] before:bg-gradient-to-r before:from-brand-primary before:to-brand-accent before:rounded-2xl before:content-[''] before:-z-10 bg-clip-border",
  };

  const interactiveProps = onClick
    ? {
        onClick,
        whileHover: hoverEffect ? { y: -4, scale: 1.01 } : {},
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
