"use client";

import { useCallback, useState } from "react";
import { FormInput } from "@/components/ui/FormInput";
import { FormCombobox } from "@/components/ui/FormCombobox";
import { CardHeader } from "@/components/ui/CardHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PO_OPTIONS, QTY_OPTIONS, UOM_OPTIONS } from "./sampleFieldOptions";
import { SampleImageField, AttachmentListField, type SampleImage, type SampleAttachment } from "./AttachmentFields";

export interface TestSampleFields {
  poId: string;
  shipmentNumber: string;
  itemName: string;
  sampleQty: string;
  sampleBatchNo: string;
  uom: string;
  sampleImages: SampleImage[];
  documents: SampleAttachment[];
  testReports: SampleAttachment[];
}

export const DEFAULT_TEST_SAMPLE_FIELDS: TestSampleFields = {
  poId: "", shipmentNumber: "", itemName: "",
  sampleQty: "", sampleBatchNo: "", uom: "",
  sampleImages: [], documents: [], testReports: [],
};

export type TestSampleFormProps = {
  mode: "create" | "view" | "edit";
  initial?: TestSampleFields;
  onSubmit: (fields: TestSampleFields) => void;
  onCancel: () => void;
};

export function TestSampleForm({ mode, initial, onSubmit, onCancel }: TestSampleFormProps) {
  const isCreate = mode === "create";
  const isView = mode === "view";
  const disabled = isView;

  const [fields, setFields] = useState<TestSampleFields>(initial ?? DEFAULT_TEST_SAMPLE_FIELDS);
  // Create starts gated behind Apply; view/edit already have a real record so show everything.
  const [applied, setApplied] = useState(!isCreate);

  const set = useCallback(<K extends keyof TestSampleFields>(key: K, value: TestSampleFields[K]) => {
    setFields((f) => ({ ...f, [key]: value }));
  }, []);

  const canApply = fields.poId !== "" && fields.shipmentNumber.trim() !== "" && fields.itemName.trim() !== "";
  const showDetails = !isCreate || applied;

  return (
    <div className="px-5 py-4 space-y-5">

      {/* ── Identification ── */}
      <Card className="bg-transparent border-none shadow-none">
        <CardHeader title="Test Sample Details" hint={disabled ? undefined : "Tab · Enter to move between fields"} />
        <div className="pt-3 grid grid-cols-3 gap-4">
          <FormCombobox
            disabled={disabled} label="PO No"
            options={PO_OPTIONS} value={fields.poId}
            placeholder="Select PO…"
            onChange={(v) => set("poId", v)}
          />
          <FormInput
            disabled={disabled} label="Shipment No"
            value={fields.shipmentNumber}
            placeholder="Enter shipment no…"
            onChange={(v) => set("shipmentNumber", v)}
          />
          <FormInput
            disabled={disabled} label="Material / Item Name"
            value={fields.itemName}
            placeholder="Enter item name…"
            onChange={(v) => set("itemName", v)}
          />
        </div>
      </Card>

      {isCreate && !applied && (
        <div className="flex justify-end gap-2">
          <Button variant="ghost-glass" onClick={() => setFields(DEFAULT_TEST_SAMPLE_FIELDS)}>
            Clear
          </Button>
          <Button variant="cta-sunset" disabled={!canApply} onClick={() => setApplied(true)}>
            Apply
          </Button>
        </div>
      )}

      {/* ── Sample details + attachments (gated behind Apply when creating) ── */}
      {showDetails && (
        <>
          <div className="grid grid-cols-3 gap-4">
            <FormCombobox
              disabled={disabled} label="Sample Qty"
              options={QTY_OPTIONS} value={fields.sampleQty}
              placeholder="Select qty…"
              onChange={(v) => set("sampleQty", v)}
            />
            <FormInput
              disabled={disabled} label="Sample Batch No"
              value={fields.sampleBatchNo}
              placeholder="Enter batch no…"
              onChange={(v) => set("sampleBatchNo", v)}
            />
            <FormCombobox
              disabled={disabled} label="Unit of Measure"
              options={UOM_OPTIONS} value={fields.uom}
              placeholder="Select UOM…"
              onChange={(v) => set("uom", v)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SampleImageField
              label="Sample Image" disabled={disabled}
              images={fields.sampleImages}
              onChange={(v) => set("sampleImages", v)}
            />
            <AttachmentListField
              label="Link Document" disabled={disabled}
              items={fields.documents}
              onChange={(v) => set("documents", v)}
            />
          </div>

          {/* Test Report only applies once a sample record actually exists */}
          {!isCreate && (
            <AttachmentListField
              label="Test Report" disabled={disabled}
              items={fields.testReports}
              onChange={(v) => set("testReports", v)}
              placeholder="Test report label…"
            />
          )}
        </>
      )}

      {/* ── Footer ── */}
      <div className="flex items-center justify-end gap-2 pt-1">
        {isView ? (
          <Button variant="ghost-glass" onClick={onCancel}>Close</Button>
        ) : (
          <>
            <Button variant="ghost-glass" onClick={onCancel}>Cancel</Button>
            {showDetails && (
              <Button variant="cta-sunset" onClick={() => onSubmit(fields)}>
                {isCreate ? "Save Details" : "Submit"}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
