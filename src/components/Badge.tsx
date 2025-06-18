import React from "react";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "secondary"; // Add any variants you need
};

export function Badge({ children, className = "", variant = "default" }: BadgeProps) {
  const baseClass = "px-3 py-1 text-sm font-medium rounded-full";
  const variantClass =
    variant === "secondary"
      ? "bg-blue-100 text-blue-700"
      : "bg-gray-200 text-gray-800";

  return (
    <span className={`${baseClass} ${variantClass} ${className}`}>
      {children}
    </span>
  );
}
