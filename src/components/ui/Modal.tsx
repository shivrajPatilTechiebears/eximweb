"use client";
import type { ReactNode } from "react";
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from "@headlessui/react";
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
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 transition-opacity duration-300 data-closed:opacity-0"
        style={{ backgroundColor: "rgba(11, 28, 48, 0.4)", backdropFilter: "blur(2px)" }}
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className={`bg-white w-full ${maxWidthClasses[maxWidth]} rounded-xl shadow-xl flex flex-col overflow-hidden transition-all duration-300 data-closed:opacity-0 data-closed:scale-95`}
        >
          <header className="bg-gray-900 px-4 py-2 flex justify-between items-center rounded-t-xl">
            <DialogTitle className="text-white font-bold">{title}</DialogTitle>
            <button
              onClick={onClose}
              className="text-white hover:opacity-80 transition-opacity active:scale-95"
            >
              <Icon name="close" size={18} />
            </button>
          </header>

          <div className="flex-1 overflow-auto">{children}</div>

          {footer && (
            <footer className="p-4 flex justify-end gap-2 border-t border-gray-100 bg-gray-50/60">
              {footer}
            </footer>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
