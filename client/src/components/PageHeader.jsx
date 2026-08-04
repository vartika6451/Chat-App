import React from "react";

const PageHeader = ({ title, description, actions, className = "" }) => {
  return (
    <div
      className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-zinc-800/80 mb-6 ${className}`}
    >
      <div>
        <h1 className="text-2xl font-bold text-[#2E2A25] tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-brand-text-secondary mt-1">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
};

export default PageHeader;
