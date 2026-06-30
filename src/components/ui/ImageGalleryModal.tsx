"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from "@headlessui/react";
import { Icon } from "./Icon";

interface GalleryImage {
  id: string;
  src: string;
  label: string;
  alt?: string;
}

interface ImageGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage?: (image: GalleryImage) => void;
}

const SAMPLE_IMAGES: GalleryImage[] = [
  { id: "img-001", src: "/images/gallery/1.jpg",  label: "Img-001", alt: "Material sample 1"  },
  { id: "img-002", src: "/images/gallery/2.png",  label: "Img-002", alt: "Material sample 2"  },
  { id: "img-003", src: "/images/gallery/3.png",  label: "Img-003", alt: "Material sample 3"  },
  { id: "img-004", src: "/images/gallery/4.png",  label: "Img-004", alt: "Material sample 4"  },
  { id: "img-005", src: "/images/gallery/5.png",  label: "Img-005", alt: "Material sample 5"  },
  { id: "img-006", src: "/images/gallery/6.png",  label: "Img-006", alt: "Material sample 6"  },
  { id: "img-007", src: "/images/gallery/7.png",  label: "Img-007", alt: "Material sample 7"  },
  { id: "img-008", src: "/images/gallery/8.png",  label: "Img-008", alt: "Material sample 8"  },
  { id: "img-009", src: "/images/gallery/9.png",  label: "Img-009", alt: "Material sample 9"  },
  { id: "img-010", src: "/images/gallery/10.png", label: "Img-010", alt: "Material sample 10" },
  { id: "img-011", src: "/images/gallery/11.png", label: "Img-011", alt: "Material sample 11" },
  { id: "img-012", src: "/images/gallery/12.png", label: "Img-012", alt: "Material sample 12" },
];

export function ImageGalleryModal({ isOpen, onClose, onSelectImage }: ImageGalleryModalProps) {
  const [searchQuery, setSearchQuery]     = useState("");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    if (!isOpen) { setSelectedImage(null); setSearchQuery(""); }
  }, [isOpen]);

  const handleSelect = () => {
    if (selectedImage && onSelectImage) {
      onSelectImage(selectedImage);
      setSelectedImage(null);
      onClose();
    }
  };

  const handleClose = () => { setSelectedImage(null); setSearchQuery(""); onClose(); };

  const filtered = SAMPLE_IMAGES.filter((img) =>
    img.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">

      {/* Backdrop */}
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/40 backdrop-blur-[4px] transition-opacity duration-300 data-closed:opacity-0"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className="gallery-panel w-full max-w-2xl flex flex-col rounded-2xl overflow-hidden transition-all duration-300 data-closed:opacity-0 data-closed:scale-95"
        >

          {/* ── Header ── */}
          <header className="gallery-header flex items-center justify-between px-4 py-2.5 rounded-t-2xl">
            <div className="flex items-center gap-2.5">
              {/* Brand badge — mirrors FloatingNavbar logo square */}
              <div className="w-6 h-6 bg-[#884D70] rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                <Icon name="photo_library" size={13} className="text-white" />
              </div>
              {/* Pink divider — mirrors FloatingNavbar separator */}
              <div className="w-px h-4 bg-[#FFDBCB] shrink-0" />
              <DialogTitle className="text-[13px] font-bold text-gray-900 tracking-tight">
                Image Gallery
              </DialogTitle>
            </div>
            <button
              onClick={handleClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-[#884D70]/50 hover:text-[#884D70] hover:bg-[#884D70]/10 transition-all"
            >
              <Icon name="close" size={15} />
            </button>
          </header>

          {/* ── Toolbar ── */}
          <div className="gallery-divider px-5 pt-4 pb-3 space-y-3">
            {/* Search */}
            <div className="relative">
              <Icon
                name="search"
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search images…"
                className="gallery-search w-full h-9 pl-9 pr-4 rounded-xl text-[12px] text-slate-700 placeholder-gray-400 outline-none transition-all focus:gallery-search-focus"
              />
            </div>

            {/* Filter chips + count */}
            <div className="flex items-center gap-2 flex-wrap">
              <GlassChip icon="calendar_today" label="Last 30 Days" />
              <GlassChip icon="sell"           label="Tags" />
              <GlassChip icon="person"         label="Created by" />
              <span className="ml-auto text-[10px] font-medium text-gray-400">
                <span className="font-bold text-slate-600">{filtered.length}</span>
                {" "}of{" "}
                <span className="font-bold text-slate-600">{SAMPLE_IMAGES.length}</span>
                {" "}images
              </span>
            </div>
          </div>

          {/* ── Image Grid ── */}
          <div className="px-5 py-4 overflow-y-auto max-h-95 scrollbar-thin">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <Icon name="add_photo_alternate" size={36} className="text-gray-300 mb-2" />
                <p className="text-[12px] text-gray-400">No images match &ldquo;{searchQuery}&rdquo;</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {filtered.map((image) => {
                  const sel = selectedImage?.id === image.id;
                  return (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => setSelectedImage(sel ? null : image)}
                      className="group flex flex-col items-center gap-1.5 focus:outline-none"
                    >
                      <div className={`relative w-full aspect-square rounded-xl overflow-hidden transition-all duration-200 ${sel ? "gallery-tile-selected" : "gallery-tile"}`}>
                        <img
                          src={image.src}
                          alt={image.alt || image.label}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />

                        {/* Hover glow (unselected) */}
                        {!sel && (
                          <div className="gallery-tile-overlay-hover absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                        )}

                        {/* Selected overlay + checkmark */}
                        {sel && (
                          <div className="gallery-tile-overlay-selected absolute inset-0 flex items-center justify-center">
                            <div className="gallery-check-badge w-6 h-6 rounded-full flex items-center justify-center">
                              <Icon name="check" size={13} className="text-white" />
                            </div>
                          </div>
                        )}
                      </div>

                      <span className={`text-[9px] font-semibold uppercase tracking-wide transition-colors ${sel ? "stepper-label-active" : "text-slate-400 group-hover:text-slate-500"}`}>
                        {image.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Selected preview strip ── */}
          {selectedImage && (
            <div className="gallery-preview-strip mx-5 mb-3 flex items-center gap-3 px-3 py-2 rounded-xl">
              <img
                src={selectedImage.src}
                alt={selectedImage.label}
                className="gallery-preview-thumb w-8 h-8 rounded-lg object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold stepper-label-active truncate">{selectedImage.label}</p>
                <p className="text-[10px] text-gray-400 truncate">{selectedImage.src}</p>
              </div>
              <button onClick={() => setSelectedImage(null)} className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
                <Icon name="close" size={14} />
              </button>
            </div>
          )}

          {/* ── Footer ── */}
          <footer className="gallery-footer px-5 py-3 rounded-b-2xl flex items-center justify-end gap-2">
            <button onClick={handleClose} className="gallery-btn-cancel">
              Cancel
            </button>
            {onSelectImage && (
              <button onClick={handleSelect} disabled={!selectedImage} className="gallery-btn-select">
                Select Image
              </button>
            )}
          </footer>

        </DialogPanel>
      </div>
    </Dialog>
  );
}

function GlassChip({ icon, label }: { icon: string; label: string }) {
  return (
    <button className="gallery-chip flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:gallery-chip-hover transition-all">
      <Icon name={icon} size={12} className="stepper-label-active" />
      {label}
      <Icon name="expand_more" size={12} className="text-gray-400" />
    </button>
  );
}
