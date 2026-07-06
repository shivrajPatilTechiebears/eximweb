import { MOCK_PURCHASE_ORDERS } from "@/components/purchase-order/types";
import type { ComboboxOption } from "@/components/ui/FormCombobox";

// PO numbers are always picked from existing purchase orders app-wide — reuse that
// same source of truth here instead of a free-text field.
export const PO_OPTIONS: ComboboxOption[] = Object.entries(MOCK_PURCHASE_ORDERS).map(
  ([id, po]) => ({ label: po.poNumber, value: id })
);

export const QTY_OPTIONS: ComboboxOption[] = ["5", "10", "20", "50", "70", "100"].map((v) => ({
  label: v,
  value: v,
}));

export const UOM_OPTIONS: ComboboxOption[] = [
  { label: "Kg", value: "Kg" },
  { label: "Ton", value: "Ton" },
  { label: "Litre", value: "Litre" },
  { label: "Piece", value: "Piece" },
  { label: "Box", value: "Box" },
];
