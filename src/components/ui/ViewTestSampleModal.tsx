/* eslint-disable @next/next/no-img-element */
"use client";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { Icon } from "./Icon";

interface TestSampleDetails {
  poNo: string;
  shipmentNo: string;
  materialName: string;
  sampleQty: number;
  sampleBatchNo: string;
  uom: string;
  sampleImages: Array<{ src: string; label: string }>;
  documents: Array<{ label: string }>;
  testReports: Array<{ label: string }>;
}

interface ViewTestSampleModalProps {
  isOpen: boolean;
  onClose: () => void;
  sampleDetails?: TestSampleDetails;
}

const DEFAULT_SAMPLE: TestSampleDetails = {
  poNo: "PO-2024-00139",
  shipmentNo: "SH-00012",
  materialName: "Steel-1",
  sampleQty: 70,
  sampleBatchNo: "Batch-1",
  uom: "Kg",
  sampleImages: [
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBlXNtUPtSug28kSuPvyW89bfmC0E7B4vokZIYtaPAahpzBRlalzP2hz6DF1tSzaIQe83XtPC093-OZgdJTcmQF0Fi5DUAx4z3RaUdRfjxoO3FwXB6SqpZRe9UeL7bQxGsAdK7Ozwe7yxFX3N0foX9GxFcm_YNS6dkYujEdV1NC5Xx9kUMcOKtDjs2CPIrmyHd1v5QIqZ43nue75FW7rsCWRuf44AwH_0pRvbJ62r5vQNBZKoKi6bNeHzq0lGC4pru5iAjl40xk41zS",
      label: "Img-002",
    },
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2groUSohxTYcVPGWsD9uegr4MQeLbZfa-SCkxccx9dlhTzkppDGxDWJ9abRzcQ6k1sVJ4VXTrmPSY7CVcaCAQgMJcD9LgsSO7ZwoqSfqKYA14v6ZV7chbr2cXixaXPRm78Lo2y-l2bS3II2pX1gP4SPhVexJr6hylowu4ujc9p-fD0ed2f5fL1C1H1sGFYcFPW9sQ9htBheZgza_HcgAmB6sOOSD5FoOVr9Yr00Umpqs3spToha8Ht9dOko1E0nYFPB6gHcWaE731",
      label: "Img-002",
    },
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDAKrvIhuP8B1t06K9p6YVabkKtX6rB1Q4JL6wmed2OY_kTyUfw9n735XKeWQSqlopZw-_94V9vn6IuBahNsUQH-LFDFbD8eeyGFNbD4Jq0JzbTXshzi01-vfZ4-tikMIjx5RM_Ln8lwr8w99v57oBawJ3PqVflunabCpPOB1U5Veb4hufQfI5KKyAr9xMCeTpPXyJufTezv5KZHO_EnGd7gXpEjs7XsepgEm7Xtn7kMgakzj3kcZr-JTf_VYQKd1NCbbR2pHZ-pym9",
      label: "Img-002",
    },
  ],
  documents: [{ label: "Pdgsd-PDF" }, { label: "Pdgsd-PDF" }, { label: "Pdgsd-PDF" }],
  testReports: [{ label: "Img-002" }, { label: "Img-002" }],
};

export function ViewTestSampleModal({ isOpen, onClose, sampleDetails = DEFAULT_SAMPLE }: ViewTestSampleModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="View Test Sample Details"
      maxWidth="2xl"
      footer={
        <Button variant="primary" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="p-6 overflow-y-auto max-h-[600px] space-y-6">
        {/* Section: Test Sample Details */}
        <section>
          <h3 className="font-headline-md text-primary mb-4 border-b border-outline-variant pb-1">
            Test Sample Details
          </h3>
          <div className="grid grid-cols-3 gap-x-4 gap-y-3">
            <div className="space-y-1">
              <label className="font-table-header text-table-header text-on-surface-variant uppercase">
                PO no *
              </label>
              <div className="bg-surface-container-high px-2 py-1.5 border border-outline-variant rounded font-body-sm text-body-sm font-bold text-primary">
                {sampleDetails.poNo}
              </div>
            </div>
            <div className="space-y-1">
              <label className="font-table-header text-table-header text-on-surface-variant uppercase">
                Shipment no *
              </label>
              <div className="bg-surface-container-high px-2 py-1.5 border border-outline-variant rounded font-body-sm text-body-sm font-bold text-primary">
                {sampleDetails.shipmentNo}
              </div>
            </div>
            <div className="space-y-1">
              <label className="font-table-header text-table-header text-on-surface-variant uppercase">
                Material/ item Name *
              </label>
              <div className="bg-surface-container-high px-2 py-1.5 border border-outline-variant rounded font-body-sm text-body-sm font-bold text-primary">
                {sampleDetails.materialName}
              </div>
            </div>
            <div className="space-y-1">
              <label className="font-table-header text-table-header text-on-surface-variant uppercase">
                Sample qty*
              </label>
              <div className="bg-surface-container-high px-2 py-1.5 border border-outline-variant rounded font-body-sm text-body-sm font-bold text-primary">
                {sampleDetails.sampleQty}
              </div>
            </div>
            <div className="space-y-1">
              <label className="font-table-header text-table-header text-on-surface-variant uppercase">
                Sample Batch No *
              </label>
              <div className="bg-surface-container-high px-2 py-1.5 border border-outline-variant rounded font-body-sm text-body-sm font-bold text-primary">
                {sampleDetails.sampleBatchNo}
              </div>
            </div>
            <div className="space-y-1">
              <label className="font-table-header text-table-header text-on-surface-variant uppercase">
                Unit of measure*
              </label>
              <div className="bg-surface-container-high px-2 py-1.5 border border-outline-variant rounded font-body-sm text-body-sm font-bold text-primary">
                {sampleDetails.uom}
              </div>
            </div>
          </div>

          {/* Attachments Row */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="space-y-2">
              <label className="font-table-header text-table-header text-on-surface-variant uppercase">
                Sample Image *
              </label>
              <div className="flex gap-2">
                {sampleDetails.sampleImages.map((image, index) => (
                  <div key={index} className="group relative">
                    <img
                      className="w-20 h-20 object-cover rounded border border-outline-variant hover:border-primary transition-colors cursor-pointer"
                      src={image.src}
                      alt={image.label}
                    />
                    <p className="font-label-caps text-[9px] text-center mt-1 text-on-surface-variant">
                      {image.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="font-table-header text-table-header text-on-surface-variant uppercase">
                Link Document *
              </label>
              <div className="flex gap-2">
                {sampleDetails.documents.map((doc, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-on-surface-variant/20 rounded flex items-center justify-center text-on-surface-variant hover:bg-on-surface-variant/30 transition-colors cursor-pointer">
                      <Icon name="picture_as_pdf" size={32} />
                    </div>
                    <p className="font-label-caps text-[9px] text-center mt-1 text-on-surface-variant uppercase">
                      {doc.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section: Test report */}
        <section>
          <h3 className="font-headline-md text-primary mb-4 border-b border-outline-variant pb-1">
            Test report
          </h3>
          <div className="flex gap-4">
            {sampleDetails.testReports.map((report, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-20 h-20 bg-on-surface-variant/20 rounded flex items-center justify-center text-on-surface-variant hover:bg-on-surface-variant/30 transition-colors cursor-pointer border border-outline-variant/30 shadow-inner">
                  <Icon name="picture_as_pdf" size={36} />
                </div>
                <p className="font-label-caps text-[10px] text-center mt-1 text-on-surface-variant">
                  {report.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Modal>
  );
}
