import React from "react";

const Input = React.forwardRef(
  (
    {
      label,
      error,
      icon,
      type = "text",
      className = "",
      containerClassName = "",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className={`flex flex-col w-full gap-1.5 ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold tracking-wider text-gray-400 uppercase ml-1"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-4 text-gray-500 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            type={type}
            className={`w-full px-4 py-3 rounded-xl bg-brand-surface border border-zinc-800 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all duration-200
              ${icon ? "pl-11" : ""}
              ${error ? "border-brand-danger focus:border-brand-danger focus:ring-brand-danger/20" : ""}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <span className="text-xs text-brand-danger font-medium ml-1 mt-0.5">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
