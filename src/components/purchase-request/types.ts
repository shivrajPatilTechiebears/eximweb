import type { ComboboxOption } from "@/components/ui/FormCombobox";

export interface RequestDetailsFields {
  prType: string;
  currency: string;
  shipmentTerms: string;
  paymentTerms: string;
  transporter: string;
  truckNo: string;
  driverDetails: string;
  deliveryLocation: string;
}

export interface PurchaseItem {
  id: number;
  name: string;
  qty: number;
  price: number;
  uom: string;
  taxCode: string;
  packaging: string;
  imageUrl?: string;
}

export interface ScheduleRow {
  id: number;
  phase: string;
  qty: number;
  reqDispatch: string;
  reqDelivery: string;
  actionLog: string;
}

export const PR_TYPE_OPTIONS: ComboboxOption[] = [
  { label: "Paddler", value: "paddler" },
  { label: "Direct", value: "direct" },
  { label: "Consignment", value: "consignment" },
];

export const CURRENCY_OPTIONS: ComboboxOption[] = [
  { label: "INR (₹)", value: "INR" },
  { label: "USD ($)", value: "USD" },
  { label: "EUR (€)", value: "EUR" },
];

export const SHIPMENT_TERMS_OPTIONS: ComboboxOption[] = [
  { label: "EXW - Ex Works", value: "EXW" },
  { label: "FOB - Free on Board", value: "FOB" },
  { label: "CIF - Cost Insurance Freight", value: "CIF" },
  { label: "DDP - Delivered Duty Paid", value: "DDP" },
];

export const PAYMENT_TERMS_OPTIONS: ComboboxOption[] = [
  { label: "Net 30 Days", value: "net30" },
  { label: "Net 60 Days", value: "net60" },
  { label: "15% Advance", value: "advance15" },
  { label: "50% Advance", value: "advance50" },
  { label: "100% Advance", value: "advance100" },
];

export const TRANSPORTER_OPTIONS: ComboboxOption[] = [
  { label: "SafeLogistics Pvt Ltd", value: "safelogistics" },
  { label: "Global Freight", value: "globalfreight" },
  { label: "BlueDart Express", value: "bluedart" },
  { label: "DTDC Courier", value: "dtdc" },
];

export type PurchaseRequestStatus = "approved" | "pending";

export const STATUS_STYLE: Record<PurchaseRequestStatus, { label: string; color: "success" | "warning" }> = {
  approved: { label: "Approved", color: "success" },
  pending: { label: "Pending", color: "warning" },
};

export interface PurchaseRequestRecord {
  prNumber: string;
  status: PurchaseRequestStatus;
  requestDetails: RequestDetailsFields;
  items: PurchaseItem[];
  scheduleRows: ScheduleRow[];
}

export const MOCK_PURCHASE_REQUESTS: Record<string, PurchaseRequestRecord> = {
  "PR-001": {
    prNumber: "PR-2024-00087",
    status: "approved",
    requestDetails: {
      prType: "paddler", currency: "USD", shipmentTerms: "EXW", paymentTerms: "net30",
      transporter: "safelogistics", truckNo: "MH-05-1234",
      driverDetails: "Rohit Sharma (+91 98765 43210)", deliveryLocation: "Production Unit, Pune",
    },
    items: [
      { id: 1, name: "Steel Wire Mesh G12", qty: 150, price: 12500, uom: "Roll", taxCode: "GST_18", packaging: "Boxed" },
    ],
    scheduleRows: [
      { id: 1, phase: "Initial Inventory Batch", qty: 150, reqDispatch: "10-Jul-2026", reqDelivery: "15-Jul-2026", actionLog: "Awaiting supplier confirm" },
    ],
  },
  "PR-002": {
    prNumber: "PR-2024-00088",
    status: "pending",
    requestDetails: {
      prType: "direct", currency: "USD", shipmentTerms: "FOB", paymentTerms: "advance15",
      transporter: "globalfreight", truckNo: "KA01-9988",
      driverDetails: "Priya N. (+91 91234 56789)", deliveryLocation: "Warehouse B, Delhi",
    },
    items: [
      { id: 1, name: "Hydraulic Seal Kit", qty: 45, price: 3400, uom: "Sets", taxCode: "GST_12", packaging: "Plastic" },
    ],
    scheduleRows: [
      { id: 1, phase: "Initial Batch", qty: 45, reqDispatch: "15-Jul-2026", reqDelivery: "20-Jul-2026", actionLog: "Pending approval" },
    ],
  },
};
