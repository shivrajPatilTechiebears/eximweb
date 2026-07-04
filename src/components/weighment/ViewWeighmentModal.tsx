"use client";

import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from "@headlessui/react";
import { Icon } from "@/components/ui/Icon";

export interface WeighmentDetail {
  itemName: string;
  shipmentQty: number;
  price: string;
  uom: string;
  taxCode: string;
  packagingType: string;
  driver: string;
  truck: string;
  status: string;
}

interface ViewWeighmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  weighment: WeighmentDetail | null;
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="text-[12px] font-bold text-slate-700">{value}</p>
    </div>
  );
}

export function ViewWeighmentModal({ isOpen, onClose, weighment }: ViewWeighmentModalProps) {
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
          className="gallery-panel w-full max-w-lg flex flex-col rounded-2xl overflow-hidden transition-all duration-300 data-closed:opacity-0 data-closed:scale-95"
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
                View Weighment Details
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
          {weighment && (
            <div className="gallery-divider px-5 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <DetailField label="Item Name" value={weighment.itemName} />
                <DetailField label="Shipment Qty" value={String(weighment.shipmentQty)} />
                <DetailField label="Price" value={weighment.price} />
                <DetailField label="UOM" value={weighment.uom} />
                <DetailField label="Tax Code" value={weighment.taxCode} />
                <DetailField label="Packaging Type" value={weighment.packagingType} />
                <DetailField label="Driver" value={weighment.driver} />
                <DetailField label="Truck" value={weighment.truck} />
                <DetailField label="Status" value={weighment.status} />
              </div>
            </div>
          )}

          {/* ── Footer ── */}
          <footer className="gallery-footer px-5 py-3 rounded-b-2xl flex items-center justify-end gap-2">
            <button onClick={onClose} className="gallery-btn-cancel">
              Close
            </button>
          </footer>

        </DialogPanel>
      </div>
    </Dialog>
  );
}
