"use client";

import { useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/ui/FormInput";
import { ImageGalleryModal } from "@/components/ui/ImageGalleryModal";

export interface SampleImage { src: string; label: string }
export interface SampleAttachment { label: string }

function Thumb({ children, label, onRemove }: { children: React.ReactNode; label: string; onRemove?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative">
        {children}
        {onRemove && (
          <button
            onClick={onRemove}
            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm"
            title="Remove"
          >
            <Icon name="close" size={9} />
          </button>
        )}
      </div>
      <span className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">{label}</span>
    </div>
  );
}

// Reuses the app's existing image gallery picker — clicking Attach appends the picked
// image, images can be added one at a time and removed individually.
export function SampleImageField({
  label, images, onChange, disabled = false,
}: { label: string; images: SampleImage[]; onChange: (images: SampleImage[]) => void; disabled?: boolean }) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  return (
    <div>
      <p className="text-[9px] font-semibold text-slate-700 uppercase tracking-wider mb-2">{label}</p>
      <div className="flex items-center gap-3 flex-wrap">
        {images.map((img, i) => (
          <Thumb
            key={i}
            label={img.label}
            onRemove={disabled ? undefined : () => onChange(images.filter((_, idx) => idx !== i))}
          >
            <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-200">
              <Image src={img.src} alt={img.label} fill sizes="56px" className="object-cover" />
            </div>
          </Thumb>
        ))}
        {!disabled && (
          <Button variant="cta-secondary" onClick={() => setIsGalleryOpen(true)}>
            <Icon name="add_photo_alternate" size={13} />
            Attach
          </Button>
        )}
      </div>

      {!disabled && (
        <ImageGalleryModal
          isOpen={isGalleryOpen}
          onClose={() => setIsGalleryOpen(false)}
          onSelectImage={(image) => onChange([...images, { src: image.src, label: image.label }])}
        />
      )}
    </div>
  );
}

// No document gallery exists elsewhere in the app — type a label and attach it,
// consistent with how the rest of this demo data models attachments (label only).
export function AttachmentListField({
  label, items, onChange, placeholder = "Document label…", disabled = false,
}: { label: string; items: SampleAttachment[]; onChange: (items: SampleAttachment[]) => void; placeholder?: string; disabled?: boolean }) {
  const [draft, setDraft] = useState("");

  const handleAttach = () => {
    if (!draft.trim()) return;
    onChange([...items, { label: draft.trim() }]);
    setDraft("");
  };

  return (
    <div>
      <p className="text-[9px] font-semibold text-slate-700 uppercase tracking-wider mb-2">{label}</p>
      <div className="flex items-center gap-3 flex-wrap mb-2">
        {items.map((item, i) => (
          <Thumb
            key={i}
            label={item.label}
            onRemove={disabled ? undefined : () => onChange(items.filter((_, idx) => idx !== i))}
          >
            <div className="w-14 h-14 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
              <Icon name="picture_as_pdf" size={22} />
            </div>
          </Thumb>
        ))}
      </div>
      {!disabled && (
        <div className="flex items-end gap-2 max-w-xs">
          <div className="flex-1">
            <FormInput label="" value={draft} placeholder={placeholder} onChange={setDraft} />
          </div>
          <Button variant="cta-secondary" onClick={handleAttach}>
            Attach
          </Button>
        </div>
      )}
    </div>
  );
}
