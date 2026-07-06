"use client";

import type { ReactNode } from "react";
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from "@headlessui/react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  /** Icon shown in the brand badge next to the title. Defaults to a generic document icon. */
  icon?: string;
  /** Optional footer row — omit when the content itself renders its own actions. */
  footer?: ReactNode;
  children: ReactNode;
  maxWidth?: "md" | "lg" | "xl" | "2xl" | "3xl";
}

const maxWidthClasses = {
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
};

// The app's common modal shell — same glassmorphism visual language ImageGalleryModal
// established (gallery-panel/gallery-header/gallery-footer CSS utilities). Use this for
// any new modal instead of hand-copying the Dialog/DialogPanel/header/footer markup.
// Consumers only supply title/icon/footer/children.
export function GlassModal({ isOpen, onClose, title, icon = "description", footer, children, maxWidth = "2xl" }: GlassModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">

      {/* Backdrop */}
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/40 backdrop-blur-[4px] transition-opacity duration-300 data-closed:opacity-0"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className={`gallery-panel w-full ${maxWidthClasses[maxWidth]} flex flex-col rounded-2xl overflow-hidden transition-all duration-300 data-closed:opacity-0 data-closed:scale-95`}
        >

          {/* ── Header ── */}
          <header className="gallery-header flex items-center justify-between px-4 py-2.5 rounded-t-2xl">
            <div className="flex items-center gap-2.5">
              {/* Brand badge — mirrors FloatingNavbar logo square */}
              <div className="w-6 h-6 bg-[#884D70] rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                <Icon name={icon} size={13} className="text-white" />
              </div>
              {/* Pink divider — mirrors FloatingNavbar separator */}
              <div className="w-px h-4 nav-separator shrink-0" />
              <DialogTitle className="text-[13px] font-bold text-gray-900 tracking-tight">
                {title}
              </DialogTitle>
            </div>
            <Button variant="modal-close" onClick={onClose}>
              <Icon name="close" size={15} />
            </Button>
          </header>

          {/* ── Body ── */}
          <div className="gallery-divider overflow-y-auto max-h-[70vh] scrollbar-thin">
            {children}
          </div>

          {/* ── Footer ── */}
          {footer && (
            <footer className="gallery-footer px-5 py-3 rounded-b-2xl flex items-center justify-end gap-2">
              {footer}
            </footer>
          )}

        </DialogPanel>
      </div>
    </Dialog>
  );
}
