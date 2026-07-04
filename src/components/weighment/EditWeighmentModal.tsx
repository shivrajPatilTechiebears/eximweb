"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from "@headlessui/react";
import { Icon } from "@/components/ui/Icon";
import { FormInput } from "@/components/ui/FormInput";

export interface WeighmentWeights {
  grossWeight: string;
  emptyWeight: string;
  weightUom: string;
}

interface EditWeighmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initial: WeighmentWeights;
  onSave: (weights: WeighmentWeights) => void;
}

export function EditWeighmentModal({ isOpen, onClose, initial, onSave }: EditWeighmentModalProps) {
  const [grossWeight, setGrossWeight] = useState(initial.grossWeight);
  const [emptyWeight, setEmptyWeight] = useState(initial.emptyWeight);

  // Re-sync from the row being edited each time the modal opens (a different row's
  // values may have been passed in since it last closed).
  useEffect(() => {
    if (isOpen) {
      setGrossWeight(initial.grossWeight);
      setEmptyWeight(initial.emptyWeight);
    }
  }, [isOpen, initial.grossWeight, initial.emptyWeight]);

  const handleSave = () => {
    onSave({ grossWeight, emptyWeight, weightUom: initial.weightUom });
    onClose();
  };

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
          className="gallery-panel w-full max-w-md flex flex-col rounded-2xl overflow-hidden transition-all duration-300 data-closed:opacity-0 data-closed:scale-95"
        >

          {/* ── Header ── */}
          <header className="gallery-header flex items-center justify-between px-4 py-2.5 rounded-t-2xl">
            <div className="flex items-center gap-2.5">
              {/* Brand badge — mirrors FloatingNavbar logo square */}
              <div className="w-6 h-6 bg-[#884D70] rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                <Icon name="local_shipping" size={13} className="text-white" />
              </div>
              {/* Pink divider — mirrors FloatingNavbar separator */}
              <div className="w-px h-4 nav-separator shrink-0" />
              <DialogTitle className="text-[13px] font-bold text-gray-900 tracking-tight">
                Edit Gross Weight
              </DialogTitle>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-[#884D70]/50 hover:text-[#884D70] hover:bg-[#884D70]/10 transition-all"
            >
              <Icon name="close" size={15} />
            </button>
          </header>

          {/* ── Body ── */}
          <div className="gallery-divider px-5 py-4 space-y-5">
            <div>
              <p className="text-[13px] font-bold text-slate-800 mb-2">Gross weight</p>
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Weight of truck"
                  value={grossWeight}
                  placeholder="Enter the weight"
                  onChange={setGrossWeight}
                />
                <FormInput label="Unit of Measure" value={initial.weightUom} disabled />
              </div>
            </div>

            <div>
              <p className="text-[13px] font-bold text-slate-800 mb-2">Empty weight</p>
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Weight of truck"
                  value={emptyWeight}
                  placeholder="Enter the weight"
                  onChange={setEmptyWeight}
                />
                <FormInput label="Unit of Measure" value={initial.weightUom} disabled />
              </div>
            </div>
          </div>

          {/* ── Footer ── */}
          <footer className="gallery-footer px-5 py-3 rounded-b-2xl flex items-center justify-end gap-2">
            <button onClick={onClose} className="gallery-btn-cancel">
              Close
            </button>
            <button onClick={handleSave} className="gallery-btn-select">
              Save
            </button>
          </footer>

        </DialogPanel>
      </div>
    </Dialog>
  );
}
