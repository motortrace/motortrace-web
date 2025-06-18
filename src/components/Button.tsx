// src/components/Button.tsx
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
};

export function Button({
  children,
  className = "",
  variant = "default",
  size = "md",
  ...props
}: ButtonProps) {
  const baseClass = "rounded-md font-semibold border shadow-sm transition-colors";

  const variantClass =
    variant === "outline"
      ? "bg-transparent border-gray-300 text-gray-800 hover:bg-gray-100"
      : variant === "ghost"
      ? "bg-transparent text-gray-800 hover:bg-gray-200 border-0"
      : "bg-blue-600 text-white hover:bg-blue-700";

  const sizeClass =
    size === "lg"
      ? "px-8 py-3 text-lg"
      : size === "sm"
      ? "px-3 py-1 text-sm"
      : "px-4 py-2 text-base";

  return (
    <button
      className={`${baseClass} ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
