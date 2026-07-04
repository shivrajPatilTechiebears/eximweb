import type { ComboboxOption } from "@/components/ui/FormCombobox";
import { MOCK_PURCHASE_ORDERS } from "@/components/purchase-order/types";

// ── Form field groups (flattened from the shipments schema) ────────────────────
// Excluded on purpose: organisationId/groupCompanyId/companyId/locationId/hierarchyPath
// (tenant scoping), isActive/deletedAt (soft-delete), createdBy/updatedBy/createdAt/updatedAt
// (audit metadata) — these are backend-assigned, not user-entered form fields.

export interface ShipmentDetailsFields {
  poType: string;
  purchaseOrderId: string;
  vendorId: string;
  shipmentType: string;
  transportMode: string;
  trackingNumber: string;

  transporterName: string;
  transporterMobile: string;
  driverName: string;
  driverMobile: string;
  driverLicenseNo: string;
  assetType: string;
  assetNumber: string;

  originAddress: string;
  originCity: string;
  originState: string;
  originCountry: string;
  originPincode: string;
  originPort: string;

  destinationAddress: string;
  destinationCity: string;
  destinationState: string;
  destinationCountry: string;
  destinationPincode: string;
  destinationPort: string;
  destinationLocationId: string;

  estimatedDepartureDate: string;
  actualDepartureDate: string;
  estimatedArrivalDate: string;
  actualArrivalDate: string;

  billOfLadingNumber: string;
  airwayBillNumber: string;
  invoiceNumber: string;
  packingListNumber: string;
  countryOfOrigin: string;
  portOfLoading: string;
  portOfDischarge: string;
  incoterms: string;
  customsDuty: number;
  clearanceStatus: string;
  clearanceDate: string;

  internalNotes: string;
}

// Field-group key lists — used to derive per-section "complete" checks in the stepper,
// and to know which keys belong to a section that can be conditionally disabled (see
// SECTION_ENABLED below).
export const SHIPMENT_DETAIL_KEYS = ["poType", "purchaseOrderId", "vendorId", "shipmentType", "transportMode", "trackingNumber"] as const;
export const TRANSPORTER_VEHICLE_KEYS = [
  "transporterName", "transporterMobile", "driverName", "driverMobile", "driverLicenseNo", "assetType", "assetNumber",
] as const;
export const ORIGIN_DESTINATION_KEYS = [
  "originAddress", "originCity", "originState", "originCountry", "originPincode",
  "destinationAddress", "destinationCity", "destinationState", "destinationCountry", "destinationPincode",
] as const;
export const CUSTOMS_SCHEDULE_KEYS = [
  "estimatedDepartureDate", "estimatedArrivalDate",
  "billOfLadingNumber", "invoiceNumber", "incoterms", "clearanceStatus",
] as const;

// ── Section enablement ───────────────────────────────────────────────────────
// Single place to add "gray out section X when Y" rules. Each entry is a section id →
// predicate; a section's fields are editable when its predicate returns true, and
// grayed out (disabled, not hidden) when false. To disable another section under
// some condition, just add one entry here — nothing else to touch.
export const SECTION_ENABLED: Record<string, (details: ShipmentDetailsFields) => boolean> = {
  transporterVehicle: (details) => details.poType !== "PEDDLER",
};

export interface ShipmentLineItem {
  id: number;
  description: string;
  scheduledQuantity: number;
  unit: string;
  unitWeight: number;
  packageType: string;
  numberOfPackages: number;
  imageUrl?: string;
}

export interface ScheduleRow {
  id: number;
  scheduledDate: string;
  scheduledQuantity: number;
  status: string;
  actualDeliveryDate: string;
  remarks: string;
}

// ── Options ──────────────────────────────────────────────────────────────────

export const PO_TYPE_OPTIONS: ComboboxOption[] = [
  { label: "Peddler", value: "PEDDLER" },
  { label: "Industrial", value: "INDUSTRIAL" },
  { label: "Import", value: "IMPORT" },
];

export const PURCHASE_ORDER_OPTIONS: ComboboxOption[] = Object.entries(MOCK_PURCHASE_ORDERS).map(
  ([id, po]) => ({ label: po.poNumber, value: id })
);

export const VENDOR_OPTIONS: ComboboxOption[] = [
  { label: "Global Polymers Ltd", value: "VEN-001" },
  { label: "Apex Systems Pvt Ltd", value: "VEN-002" },
  { label: "BlueStar Logistics", value: "VEN-003" },
];

export const SHIPMENT_TYPE_OPTIONS: ComboboxOption[] = [
  { label: "Import", value: "IMPORT" },
  { label: "Export", value: "EXPORT" },
  { label: "Domestic", value: "DOMESTIC" },
];

export const TRANSPORT_MODE_OPTIONS: ComboboxOption[] = [
  { label: "Truck", value: "TRUCK" },
  { label: "Ship", value: "SHIP" },
  { label: "Container", value: "CONTAINER" },
  { label: "Airplane", value: "AIRPLANE" },
  { label: "Train", value: "TRAIN" },
  { label: "Multimodal", value: "MULTIMODAL" },
];

export const TRANSPORTER_OPTIONS: ComboboxOption[] = [
  { label: "SafeLogistics Pvt Ltd", value: "safelogistics" },
  { label: "Global Freight", value: "globalfreight" },
  { label: "Maersk Logistics India", value: "maersk" },
  { label: "BlueDart Express", value: "bluedart" },
  { label: "DTDC Courier", value: "dtdc" },
];

export const ASSET_TYPE_OPTIONS: ComboboxOption[] = [
  { label: "Truck", value: "TRUCK" },
  { label: "Container", value: "CONTAINER" },
  { label: "Vessel", value: "VESSEL" },
  { label: "Trailer", value: "TRAILER" },
  { label: "Wagon", value: "WAGON" },
];

// Label for the asset identifier field — depends on which asset type is selected above it.
export const ASSET_NUMBER_LABEL: Record<string, string> = {
  TRUCK: "Vehicle No.",
  TRAILER: "Vehicle No.",
  CONTAINER: "Container No.",
  VESSEL: "Vessel / IMO No.",
  WAGON: "Wagon No.",
};
export const DEFAULT_ASSET_NUMBER_LABEL = "Asset / Registration No.";

export const DESTINATION_LOCATION_OPTIONS: ComboboxOption[] = [
  { label: "Mumbai Port Terminal 2", value: "LOC-001" },
  { label: "Delhi Warehouse A", value: "LOC-002" },
  { label: "Pune Distribution Center", value: "LOC-003" },
];

export const INCOTERMS_OPTIONS: ComboboxOption[] = [
  { label: "EXW - Ex Works", value: "EXW" },
  { label: "FOB - Free on Board", value: "FOB" },
  { label: "CIF - Cost Insurance Freight", value: "CIF" },
  { label: "DDP - Delivered Duty Paid", value: "DDP" },
];

export const CLEARANCE_STATUS_OPTIONS: ComboboxOption[] = [
  { label: "Pending", value: "PENDING" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Cleared", value: "CLEARED" },
  { label: "Held", value: "HELD" },
];

// ── Status ───────────────────────────────────────────────────────────────────

export type ShipmentStatus =
  | "DRAFT" | "SCHEDULED" | "IN_TRANSIT" | "AT_PORT" | "CUSTOMS_CLEARANCE"
  | "OUT_FOR_DELIVERY" | "DELIVERED" | "PARTIALLY_DELIVERED" | "CANCELLED";

export const STATUS_STYLE: Record<ShipmentStatus, { label: string; color: "success" | "warning" | "info" | "error" }> = {
  DRAFT: { label: "Draft", color: "info" },
  SCHEDULED: { label: "Scheduled", color: "info" },
  IN_TRANSIT: { label: "In Transit", color: "warning" },
  AT_PORT: { label: "At Port", color: "info" },
  CUSTOMS_CLEARANCE: { label: "Customs Clearance", color: "warning" },
  OUT_FOR_DELIVERY: { label: "Out for Delivery", color: "warning" },
  DELIVERED: { label: "Delivered", color: "success" },
  PARTIALLY_DELIVERED: { label: "Partially Delivered", color: "warning" },
  CANCELLED: { label: "Cancelled", color: "error" },
};

// ── Mock data ────────────────────────────────────────────────────────────────

export interface ShipmentRecord {
  shipmentNumber: string;
  status: ShipmentStatus;
  details: ShipmentDetailsFields;
  lineItems: ShipmentLineItem[];
  scheduleRows: ScheduleRow[];
}

export const MOCK_SHIPMENTS: Record<string, ShipmentRecord> = {
  "SHP-001": {
    shipmentNumber: "SHP-2024-0001",
    status: "IN_TRANSIT",
    details: {
      poType: "IMPORT", purchaseOrderId: "PO-001", vendorId: "VEN-001", shipmentType: "IMPORT", transportMode: "SHIP",
      trackingNumber: "MAEU771822",
      transporterName: "maersk", transporterMobile: "+91 98765 00011", driverName: "—", driverMobile: "—", driverLicenseNo: "—",
      assetType: "VESSEL", assetNumber: "MEDU8822910",
      originAddress: "Yangshan Deep Water Port", originCity: "Shanghai", originState: "Shanghai",
      originCountry: "China", originPincode: "200000", originPort: "Port of Shanghai",
      destinationAddress: "Nhava Sheva Port Rd", destinationCity: "Mumbai", destinationState: "Maharashtra",
      destinationCountry: "India", destinationPincode: "400707", destinationPort: "Mumbai Port Terminal 2",
      destinationLocationId: "LOC-001",
      estimatedDepartureDate: "05-Jul-2026", actualDepartureDate: "05-Jul-2026",
      estimatedArrivalDate: "20-Jul-2026", actualArrivalDate: "",
      billOfLadingNumber: "BL-2024-88291", airwayBillNumber: "", invoiceNumber: "INV-2024-4471",
      packingListNumber: "PKL-2024-4471", countryOfOrigin: "China", portOfLoading: "Shanghai",
      portOfDischarge: "Mumbai (Nhava Sheva)", incoterms: "CIF", customsDuty: 27000,
      clearanceStatus: "IN_PROGRESS", clearanceDate: "",
      internalNotes: "Handle with care. Ensure packaging is sealed before dispatch.",
    },
    lineItems: [
      { id: 1, description: "Steel Wire Mesh G12", scheduledQuantity: 150, unit: "Roll", unitWeight: 12, packageType: "PALLET", numberOfPackages: 6 },
      { id: 2, description: "Hydraulic Seal Kit", scheduledQuantity: 45, unit: "Sets", unitWeight: 2, packageType: "CARTON", numberOfPackages: 3 },
    ],
    scheduleRows: [
      { id: 1, scheduledDate: "05-Jul-2026", scheduledQuantity: 150, status: "IN_TRANSIT", actualDeliveryDate: "", remarks: "Departed Shanghai on schedule" },
      { id: 2, scheduledDate: "20-Jul-2026", scheduledQuantity: 45, status: "PENDING", actualDeliveryDate: "", remarks: "Awaiting berth allocation at Nhava Sheva" },
    ],
  },
  "SHP-002": {
    shipmentNumber: "SHP-2024-0002",
    status: "SCHEDULED",
    details: {
      poType: "PEDDLER", purchaseOrderId: "PO-002", vendorId: "VEN-002", shipmentType: "DOMESTIC", transportMode: "TRUCK",
      trackingNumber: "SFLG-90231",
      transporterName: "safelogistics", transporterMobile: "+91 98001 22334", driverName: "Shivraj Patil",
      driverMobile: "+91 98765 43210", driverLicenseNo: "MH05 20230098171",
      assetType: "TRUCK", assetNumber: "MH-05-1234",
      originAddress: "Mumbai Port Terminal 2", originCity: "Mumbai", originState: "Maharashtra",
      originCountry: "India", originPincode: "400707", originPort: "",
      destinationAddress: "Warehouse A, Sector 18", destinationCity: "Delhi", destinationState: "Delhi",
      destinationCountry: "India", destinationPincode: "110018", destinationPort: "",
      destinationLocationId: "LOC-002",
      estimatedDepartureDate: "21-Jul-2026", actualDepartureDate: "",
      estimatedArrivalDate: "24-Jul-2026", actualArrivalDate: "",
      billOfLadingNumber: "", airwayBillNumber: "", invoiceNumber: "INV-2024-4488",
      packingListNumber: "PKL-2024-4488", countryOfOrigin: "India", portOfLoading: "",
      portOfDischarge: "", incoterms: "", customsDuty: 0,
      clearanceStatus: "", clearanceDate: "",
      internalNotes: "",
    },
    lineItems: [
      { id: 1, description: "Hydraulic Seal Kit", scheduledQuantity: 45, unit: "Sets", unitWeight: 2, packageType: "CARTON", numberOfPackages: 3 },
    ],
    scheduleRows: [
      { id: 1, scheduledDate: "21-Jul-2026", scheduledQuantity: 45, status: "PENDING", actualDeliveryDate: "", remarks: "Scheduled for dispatch" },
    ],
  },
};
