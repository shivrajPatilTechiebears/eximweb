"use client";
import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";

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
  {
    id: "img-001",
    src: "/images/gallery/1.jpg",
    label: "Img-001",
    alt: "Material sample 1",
  },
  {
    id: "img-002",
    src: "/images/gallery/2.png",
    label: "Img-002",
    alt: "Material sample 2",
  },
  {
    id: "img-003",
    src: "/images/gallery/3.png",
    label: "Img-003",
    alt: "Material sample 3",
  },
  {
    id: "img-004",
    src: "/images/gallery/4.png",
    label: "Img-004",
    alt: "Material sample 4",
  },
  {
    id: "img-005",
    src: "/images/gallery/5.png",
    label: "Img-005",
    alt: "Material sample 5",
  },
  {
    id: "img-006",
    src: "/images/gallery/6.png",
    label: "Img-006",
    alt: "Material sample 6",
  },
  {
    id: "img-007",
    src: "/images/gallery/7.png",
    label: "Img-007",
    alt: "Material sample 7",
  },
  {
    id: "img-008",
    src: "/images/gallery/8.png",
    label: "Img-008",
    alt: "Material sample 8",
  },
  {
    id: "img-009",
    src: "/images/gallery/9.png",
    label: "Img-009",
    alt: "Material sample 9",
  },
  {
    id: "img-010",
    src: "/images/gallery/10.png",
    label: "Img-010",
    alt: "Material sample 10",
  },
  {
    id: "img-011",
    src: "/images/gallery/11.png",
    label: "Img-011",
    alt: "Material sample 11",
  },
  {
    id: "img-012",
    src: "/images/gallery/12.png",
    label: "Img-012",
    alt: "Material sample 12",
  },
];

export function ImageGalleryModal({ isOpen, onClose, onSelectImage }: ImageGalleryModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // Reset selected image when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedImage(null);
      setSearchQuery("");
    }
  }, [isOpen]);

  const handleImageClick = (image: GalleryImage) => {
    setSelectedImage(image);
  };

  const handleSelectImage = () => {
    if (selectedImage && onSelectImage) {
      onSelectImage(selectedImage);
      setSelectedImage(null);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedImage(null);
    setSearchQuery("");
    onClose();
  };

  const filteredImages = SAMPLE_IMAGES.filter((img) =>
    img.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Image gallery"
      footer={
        <>
          <Button variant="outlined" onClick={handleClose}>
            Close
          </Button>
          {onSelectImage && selectedImage && (
            <Button variant="primary" onClick={handleSelectImage}>
              Select Image
            </Button>
          )}
        </>
      }
    >
      <div className="p-4 space-y-2">
        {/* Search Bar */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-outline text-[18px]">
            search
          </span>
          <input
            className="w-full h-[36px] bg-background border border-outline-variant rounded-md pl-9 pr-4 text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            placeholder="Search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-2">
          <button className="flex items-center gap-1 px-2 py-1 border border-outline-variant rounded hover:bg-surface-container transition-colors active:scale-95">
            <span className="material-symbols-outlined text-primary text-[18px]">calendar_today</span>
            <span className="text-body-sm font-semibold">Last 30 Days</span>
            <span className="material-symbols-outlined text-outline text-[18px]">expand_more</span>
          </button>
          <button className="flex items-center gap-1 px-2 py-1 border border-outline-variant rounded hover:bg-surface-container transition-colors active:scale-95">
            <span className="material-symbols-outlined text-primary text-[18px]">sell</span>
            <span className="text-body-sm font-semibold">Tags</span>
            <span className="material-symbols-outlined text-outline text-[18px]">expand_more</span>
          </button>
          <button className="flex items-center gap-1 px-2 py-1 border border-outline-variant rounded hover:bg-surface-container transition-colors active:scale-95">
            <span className="material-symbols-outlined text-primary text-[18px]">person</span>
            <span className="text-body-sm font-semibold">Created by</span>
            <span className="material-symbols-outlined text-outline text-[18px]">expand_more</span>
          </button>
          <div className="ml-auto self-center text-body-sm text-on-surface-variant">
            Showing <span className="font-bold">{filteredImages.length}</span> records out of{" "}
            <span className="font-bold">{SAMPLE_IMAGES.length}</span>
          </div>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
          {filteredImages.map((image) => (
            <button
              key={image.id}
              type="button"
              className="group cursor-pointer focus:outline-none"
              onClick={() => handleImageClick(image)}
            >
              <div
                className={`aspect-square bg-surface-dim rounded-md overflow-hidden border-2 transition-all ${
                  selectedImage?.id === image.id
                    ? "border-primary ring-2 ring-primary shadow-lg"
                    : "border-outline-variant group-hover:border-primary"
                }`}
              >
                <img
                  alt={image.alt || image.label}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  src={image.src}
                />
              </div>
              <p className="text-label-caps font-label-caps text-on-surface-variant mt-1 text-center truncate">
                {image.label}
              </p>
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}
