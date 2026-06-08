"use client";
import { ReactNode, useEffect } from "react";
import { Icon } from "@/components/ui/Icon";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
};

export function Modal({ isOpen, onClose, title, children, footer, maxWidth = "2xl" }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(11, 28, 48, 0.4)", backdropFilter: "blur(2px)" }}
      onClick={onClose}
    >
      <div
        className={`bg-surface-container-lowest w-full ${maxWidthClasses[maxWidth]} rounded-lg shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <header className="bg-primary-container px-4 py-2 flex justify-between items-center">
          <h2 className="text-on-primary-container font-headline-md text-headline-md font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-on-primary-container hover:opacity-80 transition-opacity active:scale-95"
          >
            <Icon name="close" size={18} />
          </button>
        </header>

        {/* Modal Content */}
        <div className="flex-1 overflow-auto">{children}</div>

        {/* Modal Footer */}
        {footer && (
          <footer className="p-4 flex justify-end gap-2 border-t border-outline-variant bg-surface-container-low">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
