"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { SummaryFooter, type SummaryFooterItem } from "@/components/layout/SummaryFooter";
import { DetailGridCard, type DetailGridItem } from "@/components/cards/DetailGridCard";
import { SectionPanel } from "@/components/cards/SectionPanel";
import { DataTable } from "@/components/table/DataTable";
import { type TableColumn } from "@/components/ui/Table";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";

type StatusTone = Extract<BadgeVariant, "success" | "planned" | "muted" | "danger">;

interface LineItem {
  materialCode: string;
  materialName: string;
  totalQty: string;
  delivered: string;
  pending: string;
  packageType: string;
  uom: string;
  taxPercent: string;
  taxValue: string;
  dispatchDate: string;
  deliveryDate: string;
  unitPrice: string;
  active?: boolean;
  complete?: boolean;
}

interface ScheduleRow {
  scheduleNo: string;
  code: string;
  name: string;
  qty: string;
  dispatchDate: string;
  deliveryDate: string;
  containers: string;
}

interface ShipmentRow {
  blNumber: string;
  vesselName: string;
  etd: string;
  eta: string;
  status: string;
  statusTone: StatusTone;
  containerInfo: string;
}

interface TestSampleRow {
  sampleNo: string;
  itemNo: string;
  materialCode: string;
  materialName: string;
  sampleQty: string;
  result: string;
  statusTone: StatusTone;
  sampleDate: string;
}

interface GoodsReceiptRow {
  transactionNo: string;
  poNo: string;
  lineItem: string;
  materialCode: string;
  qty: string;
  price: string;
  currency: string;
  uom: string;
  packageType: string;
  sampleRefNo: string;
}

interface BookingRow {
  bookingId: string;
  vesselName: string;
  voyageNo: string;
  departurePort: string;
  arrivalPort: string;
  etd: string;
  eta: string;
  status: string;
  statusTone: StatusTone;
}

const PO_NUMBER = "PO-2023-8841";

const PO_DETAILS: DetailGridItem[] = [
  { label: "Payment Terms", value: "Net 30 - Bank Transfer" },
  { label: "Mode of Dispatch", value: "Ocean Freight (FCL)" },
  { label: "Transporter", value: "Maersk Logistics India Pvt Ltd" },
  { label: "Currency", value: "USD ($)" },
  { label: "Created By", value: "Admin User (A. Mehta)" },
  { label: "Created On", value: "Oct 24, 2023 | 14:32" },
  { label: "Purchase Type", value: "Local Purchase", badgeVariant: "success" },
  { label: "Supplier Code", value: "SUP-IND-9022" },
  {
    label: "Supplier Name & Address",
    value: "Global Polymers Ltd, Plot 44, Industrial Estate, Mundra, Gujarat, 370421",
    wide: true,
  },
];

const LINE_ITEMS: LineItem[] = [
  {
    materialCode: "POLY-HG-01",
    materialName: "Polypropylene High Gloss Pellets",
    totalQty: "5,000.00",
    delivered: "1,200.00",
    pending: "3,800.00",
    packageType: "Jumbo Bag",
    uom: "KG",
    taxPercent: "18%",
    taxValue: "27,000.00",
    dispatchDate: "2023-11-05",
    deliveryDate: "2023-11-12",
    unitPrice: "$3.00",
    active: true,
  },
  {
    materialCode: "CHEM-AD-04",
    materialName: "UV Resistance Additive",
    totalQty: "200.00",
    delivered: "200.00",
    pending: "0.00",
    packageType: "Canister",
    uom: "Litre",
    taxPercent: "12%",
    taxValue: "1,440.00",
    dispatchDate: "2023-10-20",
    deliveryDate: "2023-10-25",
    unitPrice: "$6.00",
    complete: true,
  },
  {
    materialCode: "PACK-FL-99",
    materialName: "BOPP Packaging Film 30mic",
    totalQty: "1,500.00",
    delivered: "0.00",
    pending: "1,500.00",
    packageType: "Roll",
    uom: "Sqm",
    taxPercent: "18%",
    taxValue: "4,050.00",
    dispatchDate: "2023-12-01",
    deliveryDate: "2023-12-10",
    unitPrice: "$1.50",
  },
];

const DELIVERY_SCHEDULES: ScheduleRow[] = [
  {
    scheduleNo: "01",
    code: "POLY-HG-01",
    name: "Polypropylene High Gloss Pellets",
    qty: "1,200.00",
    dispatchDate: "2023-10-15",
    deliveryDate: "2023-10-22",
    containers: "1 x 20ft",
  },
  {
    scheduleNo: "02",
    code: "POLY-HG-01",
    name: "Polypropylene High Gloss Pellets",
    qty: "1,800.00",
    dispatchDate: "2023-11-05",
    deliveryDate: "2023-11-12",
    containers: "1 x 40ft",
  },
  {
    scheduleNo: "03",
    code: "POLY-HG-01",
    name: "Polypropylene High Gloss Pellets",
    qty: "2,000.00",
    dispatchDate: "2023-11-25",
    deliveryDate: "2023-12-05",
    containers: "2 x 20ft",
  },
];

const SHIPMENTS: ShipmentRow[] = [
  {
    blNumber: "MAEU771822",
    vesselName: "MAERSK HANOI",
    etd: "2023-10-18",
    eta: "2023-11-20",
    status: "IN TRANSIT",
    statusTone: "success",
    containerInfo: "MEDU8822910",
  },
  {
    blNumber: "MSCU441209",
    vesselName: "MSC ROSARIA",
    etd: "2023-11-02",
    eta: "2023-12-05",
    status: "PLANNED",
    statusTone: "planned",
    containerInfo: "MSCU9901221",
  },
];

const TEST_SAMPLES: TestSampleRow[] = [
  {
    sampleNo: "SMP-8821",
    itemNo: "01",
    materialCode: "POLY-HG-01",
    materialName: "Polypropylene Pellets",
    sampleQty: "2.50 KG",
    result: "PASS",
    statusTone: "success",
    sampleDate: "2023-10-25",
  },
  {
    sampleNo: "SMP-8822",
    itemNo: "02",
    materialCode: "CHEM-AD-04",
    materialName: "UV Additive",
    sampleQty: "1.00 Ltr",
    result: "PASS",
    statusTone: "success",
    sampleDate: "2023-10-26",
  },
  {
    sampleNo: "SMP-8825",
    itemNo: "01",
    materialCode: "POLY-HG-01",
    materialName: "Polypropylene Pellets",
    sampleQty: "5.00 KG",
    result: "FAIL",
    statusTone: "danger",
    sampleDate: "2023-11-02",
  },
];

const GOODS_RECEIPTS: GoodsReceiptRow[] = [
  {
    transactionNo: "GRN-2023-001",
    poNo: PO_NUMBER,
    lineItem: "01",
    materialCode: "POLY-HG-01",
    qty: "1,200.00",
    price: "3.00",
    currency: "USD",
    uom: "KG",
    packageType: "Jumbo Bag",
    sampleRefNo: "SMP-8821",
  },
  {
    transactionNo: "GRN-2023-002",
    poNo: PO_NUMBER,
    lineItem: "02",
    materialCode: "CHEM-AD-04",
    qty: "200.00",
    price: "6.00",
    currency: "USD",
    uom: "Litre",
    packageType: "Canister",
    sampleRefNo: "SMP-8822",
  },
];

const BOOKINGS: BookingRow[] = [
  {
    bookingId: "BKG-992831",
    vesselName: "MAERSK HANOI",
    voyageNo: "234W",
    departurePort: "Shanghai",
    arrivalPort: "Mundra",
    etd: "2023-11-05",
    eta: "2023-11-20",
    status: "CONFIRMED",
    statusTone: "success",
  },
  {
    bookingId: "BKG-883742",
    vesselName: "MSC ROSARIA",
    voyageNo: "112E",
    departurePort: "Singapore",
    arrivalPort: "Mundra",
    etd: "2023-11-10",
    eta: "2023-11-25",
    status: "PENDING",
    statusTone: "muted",
  },
];

const SUMMARY_LEFT: SummaryFooterItem[] = [
  { label: "Total Items", value: "04" },
  { label: "Total Net Weight", value: "6,700 KG" },
];

const SUMMARY_RIGHT: SummaryFooterItem[] = [
  { label: "Sub-Total", value: "$18,150.00" },
  { label: "Tax Total", value: "$3,267.00" },
];

const LINE_ITEM_COLUMNS: TableColumn<LineItem>[] = [
  {
    field: "materialCode",
    header: "Mat Code",
    body: (row) => <span className="font-bold text-primary">{row.materialCode}</span>,
  },
  { field: "materialName", header: "Material Name" },
  { field: "totalQty", header: "Tot Qty" },
  { field: "delivered", header: "Delivered" },
  {
    field: "pending",
    header: "Pending",
    body: (row) => (
      <span className={row.complete ? "text-green-600" : "text-error font-bold"}>
        {row.pending}
      </span>
    ),
  },
  { field: "packageType", header: "Pkg Type" },
  { field: "uom", header: "UOM" },
  { field: "taxPercent", header: "Tax %" },
  { field: "taxValue", header: "Tax Val" },
  { field: "dispatchDate", header: "Dispatch" },
  { field: "deliveryDate", header: "Delivery" },
  {
    field: "unitPrice",
    header: "Unit Price",
    body: (row) => <span className="font-bold">{row.unitPrice}</span>,
  },
];

const SCHEDULE_COLUMNS: TableColumn<ScheduleRow>[] = [
  { field: "scheduleNo", header: "Sch #" },
  { field: "code", header: "Code" },
  { field: "name", header: "Name" },
  {
    field: "qty",
    header: "Sch Qty",
    body: (row) => <span className="font-bold text-primary">{row.qty}</span>,
  },
  { field: "dispatchDate", header: "Dispatch Dt" },
  { field: "deliveryDate", header: "Delivery Dt" },
  { field: "containers", header: "Containers" },
];

const SHIPMENT_COLUMNS: TableColumn<ShipmentRow>[] = [
  { field: "blNumber", header: "BL Number", body: (row) => <span className="font-bold">{row.blNumber}</span> },
  { field: "vesselName", header: "Vessel Name" },
  { field: "etd", header: "ETD" },
  { field: "eta", header: "ETA" },
  {
    field: "status",
    header: "Status",
    body: (row) => <Badge variant={row.statusTone} label={row.status} shape="pill" size="sm" />,
  },
  { field: "containerInfo", header: "Container Info" },
  {
    field: "actions",
    header: "Actions",
    body: () => (
      <div className="flex items-center gap-1">
        <IconButton icon="visibility" label="View shipment" />
        <IconButton icon="download" label="Download shipment" />
      </div>
    ),
  },
];

const TEST_SAMPLE_COLUMNS: TableColumn<TestSampleRow>[] = [
  { field: "sampleNo", header: "Sample No", body: (row) => <span className="font-bold">{row.sampleNo}</span> },
  { field: "itemNo", header: "Item No" },
  {
    field: "materialCode",
    header: "Material Code",
    body: (row) => <span className="font-bold text-primary">{row.materialCode}</span>,
  },
  { field: "materialName", header: "Material Name" },
  { field: "sampleQty", header: "Sample Qty" },
  {
    field: "result",
    header: "Pass/Fail",
    body: (row) => <Badge variant={row.statusTone} label={row.result} shape="pill" size="sm" />,
  },
  { field: "sampleDate", header: "Sample Date" },
  {
    field: "report",
    header: "Report",
    body: () => <IconButton icon="description" label="Open sample report" />,
  },
];

const GOODS_RECEIPT_COLUMNS: TableColumn<GoodsReceiptRow>[] = [
  {
    field: "transactionNo",
    header: "Transaction No",
    body: (row) => <span className="font-bold">{row.transactionNo}</span>,
  },
  { field: "poNo", header: "PO No" },
  { field: "lineItem", header: "Line Item" },
  {
    field: "materialCode",
    header: "Material Code",
    body: (row) => <span className="font-bold text-primary">{row.materialCode}</span>,
  },
  { field: "qty", header: "Qty" },
  { field: "price", header: "Price" },
  { field: "currency", header: "Currency" },
  { field: "uom", header: "UOM" },
  { field: "packageType", header: "Pkg Type" },
  { field: "sampleRefNo", header: "Sample Ref No" },
];

const BOOKING_COLUMNS: TableColumn<BookingRow>[] = [
  {
    field: "bookingId",
    header: "Booking ID",
    body: (row) => <span className="font-bold text-primary">{row.bookingId}</span>,
  },
  { field: "vesselName", header: "Vessel Name" },
  { field: "voyageNo", header: "Voyage No." },
  { field: "departurePort", header: "Departure Port" },
  { field: "arrivalPort", header: "Arrival Port" },
  { field: "etd", header: "ETD" },
  { field: "eta", header: "ETA" },
  {
    field: "status",
    header: "Status",
    body: (row) => <Badge variant={row.statusTone} label={row.status} shape="pill" size="sm" />,
  },
  { field: "action", header: "Action", body: () => <IconButton icon="more_vert" label="Booking actions" /> },
];

function LineItemsSection() {
  return (
    <SectionPanel
      title="PO Line Items (4)"
      icon="list_alt"
      tone="primary"
      bodyClassName="max-h-64 overflow-y-auto p-0"
      action={<span className="text-label-caps font-label-caps text-white/70">Selected: 1 item</span>}
    >
      <div className="[&>section]:space-y-0 [&_.bg-white\/80]:bg-transparent [&_.border]:border-0 [&_.rounded-lg]:rounded-none">
        <DataTable
          title=""
          columns={LINE_ITEM_COLUMNS}
          data={LINE_ITEMS}
          rowStyle={(row, i) => ({
            backgroundColor: row.active ? "rgba(219, 234, 254, 0.4)" : i % 2 === 0 ? "#ffffff" : "#f9fafb",
            cursor: "pointer"
          })}
        />
      </div>
    </SectionPanel>
  );
}

function DeliverySchedulesSection() {
  return (
    <SectionPanel
      title="Delivery Schedules: POLY-HG-01"
      icon="event_note"
      action={<Button variant="text">+ New Schedule</Button>}
    >
      <div className="[&>section]:space-y-0 [&_.bg-white\/80]:bg-transparent [&_.border]:border-0 [&_.rounded-lg]:rounded-none">
        <DataTable
          title=""
          columns={SCHEDULE_COLUMNS}
          data={DELIVERY_SCHEDULES}
        />
      </div>
    </SectionPanel>
  );
}

function RelatedActivityTabs() {
  const tabs: TabItem[] = [
    {
      id: "shipment",
      label: "Shipment",
      content: (
        <div className="[&>section]:space-y-0 [&_.bg-white\/80]:bg-transparent [&_.border]:border-0 [&_.rounded-lg]:rounded-none">
          <DataTable title="" columns={SHIPMENT_COLUMNS} data={SHIPMENTS} />
        </div>
      ),
    },
    {
      id: "test-sample",
      label: "Test Sample",
      content: (
        <div className="[&>section]:space-y-0 [&_.bg-white\/80]:bg-transparent [&_.border]:border-0 [&_.rounded-lg]:rounded-none">
          <DataTable title="" columns={TEST_SAMPLE_COLUMNS} data={TEST_SAMPLES} />
        </div>
      ),
    },
    {
      id: "goods-receipts",
      label: "Goods Receipts",
      content: (
        <div className="[&>section]:space-y-0 [&_.bg-white\/80]:bg-transparent [&_.border]:border-0 [&_.rounded-lg]:rounded-none">
          <DataTable
            title=""
            columns={GOODS_RECEIPT_COLUMNS}
            data={GOODS_RECEIPTS}
          />
        </div>
      ),
    },
    {
      id: "bookings",
      label: "Bookings",
      content: (
        <div className="[&>section]:space-y-0 [&_.bg-white\/80]:bg-transparent [&_.border]:border-0 [&_.rounded-lg]:rounded-none">
          <DataTable title="" columns={BOOKING_COLUMNS} data={BOOKINGS} />
        </div>
      ),
    },
  ];

  return (
    <SectionPanel bodyClassName="px-4 pt-2 bg-gray-50/60">
      <Tabs items={tabs} defaultActiveId="goods-receipts" />
    </SectionPanel>
  );
}

export default function PurchaseOrderDetailsPage() {
  return (
    <div className="min-h-screen flex flex-col antialiased text-slate-800">
      <div className="pt-16 p-4 pb-20 flex-1 flex flex-col gap-3">
        <PageHeader
          title="Purchase Order Details"
          description="Status, line items, schedules, shipments, samples, receipts, and bookings."
          backHref="/purchase-order"
          meta={`PO #${PO_NUMBER}`}
          actions={
            <>
              <Button variant="outlined" icon="print" className="flex items-center gap-1.5">
                Print
              </Button>
              <ButtonLink
                href="/purchase-order/edit"
                variant="outlined"
                icon="edit"
                className="flex items-center gap-1.5"
              >
                Edit PO
              </ButtonLink>
              <Button variant="primary" icon="send">
                Submit
              </Button>
            </>
          }
        />

        <DetailGridCard items={PO_DETAILS} />
        <LineItemsSection />
        <DeliverySchedulesSection />
        <RelatedActivityTabs />
      </div>

      <div className="fixed bottom-0 inset-x-0 z-40">
        <SummaryFooter
          leftItems={SUMMARY_LEFT}
          rightItems={SUMMARY_RIGHT}
          total={{ label: "PO Grand Total", value: "$21,417.00 USD" }}
        />
      </div>
    </div>
  );
}
