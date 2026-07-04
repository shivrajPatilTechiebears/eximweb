"use client";

import Image from "next/image";
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from "@headlessui/react";
import { Icon } from "@/components/ui/Icon";

export interface TestSampleImage { src: string; label: string }
export interface TestSampleAttachment { label: string }

export interface TestSampleDetail {
  poNumber: string;
  shipmentNumber: string;
  itemName: string;
  sampleQty: number;
  sampleBatchNo: string;
  uom: string;
  sampleImages: TestSampleImage[];
  documents: TestSampleAttachment[];
  testReports: TestSampleAttachment[];
}

interface ViewTestSampleModalProps {
  isOpen: boolean;
  onClose: () => void;
  sample: TestSampleDetail | null;
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="text-[12px] font-bold text-slate-700">{value}</p>
    </div>
  );
}

function AttachmentThumb({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="w-16 h-16 rounded-xl gallery-tile flex items-center justify-center bg-white/50">
        <Icon name="picture_as_pdf" size={26} className="text-gray-400" />
      </div>
      <span className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">{label}</span>
    </div>
  );
}

export function ViewTestSampleModal({ isOpen, onClose, sample }: ViewTestSampleModalProps) {
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
          className="gallery-panel w-full max-w-2xl flex flex-col rounded-2xl overflow-hidden transition-all duration-300 data-closed:opacity-0 data-closed:scale-95"
        >

          {/* ── Header ── */}
          <header className="gallery-header flex items-center justify-between px-4 py-2.5 rounded-t-2xl">
            <div className="flex items-center gap-2.5">
              {/* Brand badge — mirrors FloatingNavbar logo square */}
              <div className="w-6 h-6 bg-[#884D70] rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                <Icon name="description" size={13} className="text-white" />
              </div>
              {/* Pink divider — mirrors FloatingNavbar separator */}
              <div className="w-px h-4 nav-separator shrink-0" />
              <DialogTitle className="text-[13px] font-bold text-gray-900 tracking-tight">
                View Test Sample Details
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
          {sample && (
            <div className="gallery-divider px-5 py-4 overflow-y-auto max-h-95 scrollbar-thin space-y-5">
              <div className="grid grid-cols-3 gap-4">
                <DetailField label="PO No" value={sample.poNumber} />
                <DetailField label="Shipment No" value={sample.shipmentNumber} />
                <DetailField label="Material / Item Name" value={sample.itemName} />
                <DetailField label="Sample Qty" value={String(sample.sampleQty)} />
                <DetailField label="Sample Batch No" value={sample.sampleBatchNo} />
                <DetailField label="Unit of Measure" value={sample.uom} />
              </div>

              <div>
                <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Sample Image
                </p>
                <div className="flex gap-3 flex-wrap">
                  {sample.sampleImages.map((img, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden gallery-tile">
                        <Image src={img.src} alt={img.label} fill sizes="64px" className="object-cover" />
                      </div>
                      <span className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                        {img.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    Link Document
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    {sample.documents.map((doc, i) => (
                      <AttachmentThumb key={i} label={doc.label} />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    Test Report
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    {sample.testReports.map((report, i) => (
                      <AttachmentThumb key={i} label={report.label} />
                    ))}
                  </div>
                </div>
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
