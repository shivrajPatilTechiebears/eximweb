import type { ComboboxOption } from "@/components/ui/FormCombobox";

export interface OrderDetailsFields {
  poType: string;
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

export const PO_TYPE_OPTIONS: ComboboxOption[] = [
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

export type PurchaseOrderStatus = "created" | "pending";

export const STATUS_STYLE: Record<PurchaseOrderStatus, { label: string; color: "success" | "warning" }> = {
  created: { label: "Created", color: "success" },
  pending: { label: "Pending", color: "warning" },
};

export interface PurchaseOrderRecord {
  poNumber: string;
  status: PurchaseOrderStatus;
  orderDetails: OrderDetailsFields;
  items: PurchaseItem[];
  scheduleRows: ScheduleRow[];
}

export const MOCK_PURCHASE_ORDERS: Record<string, PurchaseOrderRecord> = {
  "PO-001": {
    poNumber: "PO-2024-00139",
    status: "created",
    orderDetails: {
      poType: "paddler", currency: "USD", shipmentTerms: "EXW", paymentTerms: "net30",
      transporter: "safelogistics", truckNo: "MH-05-1234",
      driverDetails: "Shivraj Patil (+91 98765 43210)", deliveryLocation: "Mumbai Port Terminal 2",
    },
    items: [
      { id: 1, name: "Steel Wire Mesh G12", qty: 150, price: 12500, uom: "Roll", taxCode: "GST_18", packaging: "Boxed" },
      { id: 2, name: "Hydraulic Seal Kit", qty: 45, price: 3400, uom: "Sets", taxCode: "GST_12", packaging: "Plastic" },
    ],
    scheduleRows: [
      { id: 1, phase: "Initial Inventory Batch", qty: 100, reqDispatch: "24-Oct-2023", reqDelivery: "26-Oct-2023", actionLog: "Waiting for supplier confirm" },
      { id: 2, phase: "Residual Balance Shipment", qty: 50, reqDispatch: "02-Nov-2023", reqDelivery: "05-Nov-2023", actionLog: "Scheduled for Q4" },
    ],
  },
  "PO-002": {
    poNumber: "PO-2024-00140",
    status: "pending",
    orderDetails: {
      poType: "direct", currency: "USD", shipmentTerms: "FOB", paymentTerms: "advance15",
      transporter: "globalfreight", truckNo: "KA01-9988",
      driverDetails: "Amit Singh (+91 91234 56789)", deliveryLocation: "Delhi Warehouse A",
    },
    items: [
      { id: 1, name: "Hydraulic Seal Kit", qty: 45, price: 3400, uom: "Sets", taxCode: "GST_12", packaging: "Plastic" },
    ],
    scheduleRows: [
      { id: 1, phase: "Initial Batch", qty: 45, reqDispatch: "01-Dec-2023", reqDelivery: "05-Dec-2023", actionLog: "Scheduled" },
    ],
  },
};
