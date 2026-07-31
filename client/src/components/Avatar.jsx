import React from "react";

const Avatar = ({ src, username = "User", status, size = "md", className = "" }) => {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-xl",
    xl: "w-24 h-24 text-3xl",
  };

  const ringSizes = {
    sm: "ring-2 ring-offset-1",
    md: "ring-2 ring-offset-2",
    lg: "ring-4 ring-offset-2",
    xl: "ring-4 ring-offset-2",
  };

  const statusColors = {
    online: "bg-brand-success",
    offline: "bg-gray-500",
    away: "bg-amber-500",
  };

  const statusDotSizes = {
    sm: "w-2 h-2 bottom-0 right-0",
    md: "w-3 h-3 bottom-0 right-0 border-2",
    lg: "w-4.5 h-4.5 bottom-0.5 right-0.5 border-3",
    xl: "w-6 h-6 bottom-1 right-1 border-4",
  };

  return (
    <div className={`relative inline-block select-none shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={username}
          className={`rounded-full object-cover border border-white/5 ${sizes[size]}`}
        />
      ) : (
        <div
          className={`rounded-full flex items-center justify-center font-bold bg-gradient-to-br from-brand-primary/30 to-brand-accent/30 text-white border border-white/10 ${sizes[size]}`}
        >
          {getInitials(username)}
        </div>
      )}

      {status && (
        <span
          className={`absolute rounded-full border-zinc-900 ${statusColors[status]} ${statusDotSizes[size]}`}
          title={status}
        />
      )}
    </div>
  );
};

export default Avatar;
