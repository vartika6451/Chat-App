import React from "react";

const Loader = ({ size = "md", color = "primary", className = "" }) => {
  const sizes = {
    xs: "w-3.5 h-3.5 border",
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  const colors = {
    primary: "border-brand-primary/20 border-t-brand-primary",
    accent: "border-brand-accent/20 border-t-brand-accent",
    white: "border-white/20 border-t-white",
    current: "border-current/20 border-t-current",
  };

  return (
    <div
      className={`rounded-full animate-spin ${sizes[size]} ${colors[color]} ${className}`}
      role="status"
      aria-label="loading"
    />
  );
};

export default Loader;
