import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={`rounded-xl ${className ?? "bg-white border border-gray-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.06)]"}`}
    >
      {children}
    </div>
  );
}
