import React, { useId } from "react";

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
    const generatedId = useId();
    const inputId = id || generatedId;


    return (
      <div className={`flex flex-col w-full gap-1.5 ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-zinc-500 ml-1"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-4 text-gray-400 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            type={type}
            className={`w-full px-4 py-3 rounded-2xl bg-white border border-zinc-200 text-zinc-800 text-sm placeholder-gray-400 focus:outline-none focus:border-[var(--color-brand-accent-pink)] focus:ring-2 focus:ring-[var(--color-brand-accent-pink)]/10 transition-all duration-200
              ${icon ? "pl-11" : ""}
              ${error ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/10" : ""}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <span className="text-xs text-rose-500 font-medium ml-1 mt-0.5">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
