import { AppShell } from "@/components/layout/AppShell";
import { SectionPanel } from "@/components/cards/SectionPanel";
import { KpiCard } from "@/components/cards/KpiCard";
import { CompactTable, type CompactTableColumn } from "@/components/table/CompactTable";
import { SearchBar } from "@/components/ui/SearchBar";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";

interface KpiMetric {
  title: string;
  value: string;
  helper: string;
  helperTone?: "primary" | "success" | "danger" | "muted";
  valueTone?: "primary" | "success" | "danger" | "muted";
}

interface StatusMonth {
  month: string;
  created: number;
  progress: number;
  pending: number;
}

interface SupplierRating {
  label: string;
  value: string;
  className: string;
}

interface InventoryCategory {
  label: string;
  value: number;
  barClassName: string;
}

interface TransitMetric {
  label: string;
  value: string;
}

interface PurchaseOrderRow {
  id: string;
  supplier: string;
  etd: string;
  value: string;
  status: string;
  statusVariant: BadgeVariant;
}

const LOGISTICS_MAP =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuADTSZpg7S-9jh8t45RKDClNwENcwatWTtJEo-W4WyCH1KjEhdVm6qemwFHDtoYOOcohyp9ah9nImtpKwrGsjhGCJnbCOmUQaX-NiyFHX0YP2ymK_GRMoLOinIS7sm178kp_d2H0o_rwlPbmvPa5NuQ1RnsOghzf_MiKR2npqu02tlw9KkLuB0PKJY9T9G-QiHZcpqam2Vb6sP48WR_mM55CdWXH2pDllA0gLI7oFuDqKDRH1dn2ZbwbhWN46CbHcPuNWKDiFGwOQAJ";

const KPI_METRICS: KpiMetric[] = [
  { title: "Total PRs", value: "1,482", helper: "+4.2%", helperTone: "success" },
  { title: "Open POs", value: "234", helper: "-12%", helperTone: "danger" },
  { title: "Overdue", value: "12", helper: "/ 8 Critical", valueTone: "danger" },
  { title: "Inv. Value", value: "$4.2M", helper: "+0.8%", helperTone: "success" },
];

const STATUS_MONTHS: StatusMonth[] = [
  { month: "Jan", created: 80, progress: 60, pending: 30 },
  { month: "Feb", created: 95, progress: 55, pending: 35 },
  { month: "Mar", created: 75, progress: 75, pending: 20 },
  { month: "Apr", created: 100, progress: 45, pending: 40 },
  { month: "May", created: 85, progress: 70, pending: 25 },
];

const STATUS_LEGEND = [
  { label: "Created", className: "bg-primary" },
  { label: "In Progress", className: "bg-secondary" },
  { label: "Pending", className: "bg-outline" },
];

const SUPPLIER_RATINGS: SupplierRating[] = [
  { label: "Excel", value: "65%", className: "text-secondary" },
  { label: "Good", value: "25%", className: "text-primary-fixed-dim" },
  { label: "Risk", value: "10%", className: "text-error" },
];

const INVENTORY_CATEGORIES: InventoryCategory[] = [
  { label: "Raw Materials", value: 78, barClassName: "bg-primary" },
  { label: "Packaging", value: 45, barClassName: "bg-secondary" },
  { label: "Semiconductors", value: 92, barClassName: "bg-error" },
  { label: "Finished Goods", value: 30, barClassName: "bg-outline" },
];

const TRANSIT_METRICS: TransitMetric[] = [
  { label: "Transit (Air)", value: "42 Units" },
  { label: "Transit (Sea)", value: "156 Units" },
];

const LIVE_UPDATES = [
  "PO-2024-001 status changed to SHIPPED",
  "Supplier 'Amex Tech' rating updated to 4.8/5.0",
  "Inventory alert: Semiconductor stock below threshold (12%)",
];

const PURCHASE_ORDERS: PurchaseOrderRow[] = [
  {
    id: "PO-2024-001",
    supplier: "Amex Tech Systems",
    etd: "2024-10-15",
    value: "$12,450.00",
    status: "Shipped",
    statusVariant: "success",
  },
  {
    id: "PO-2024-002",
    supplier: "Zenth Global Logistics",
    etd: "2024-10-18",
    value: "$4,200.00",
    status: "Delayed",
    statusVariant: "danger",
  },
  {
    id: "PO-2024-003",
    supplier: "Prime Materials Co.",
    etd: "2024-10-22",
    value: "$8,900.00",
    status: "Pending",
    statusVariant: "pending",
  },
];

const PO_COLUMNS: CompactTableColumn<PurchaseOrderRow>[] = [
  { field: "id", header: "PO ID", body: (row) => <span className="font-bold">{row.id}</span> },
  { field: "supplier", header: "Supplier", headerClass: "text-left" },
  { field: "etd", header: "ETD", headerClass: "text-center", cellClass: "text-center" },
  {
    field: "value",
    header: "Value",
    headerClass: "text-right",
    cellClass: "text-right",
    body: (row) => <span className="font-bold">{row.value}</span>,
  },
  {
    field: "status",
    header: "Status",
    headerClass: "text-center",
    cellClass: "text-center",
    body: (row) => <Badge variant={row.statusVariant} label={row.status} shape="pill" />,
  },
  {
    field: "action",
    header: "Action",
    headerClass: "text-center",
    cellClass: "text-center",
    body: () => <IconButton icon="visibility" label="View purchase order" />,
  },
];

function DashboardCommandBar() {
  return (
    <div className="bg-surface-container-highest border border-outline-variant/70 rounded-lg px-3 py-2 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-headline-md text-sm font-extrabold text-primary">
          Search
        </span>
        <SearchBar
          placeholder="Quick Search (e.g., PO-9902)..."
          className="w-full sm:w-64"
          inputClassName="h-7 text-[11px] rounded"
        />
      </div>
      <div className="flex items-center gap-2">
        <Badge
          variant="success"
          label="System Active"
          size="sm"
          className="bg-secondary-container/30 border-secondary/20"
        />
        <IconButton icon="notifications" label="Notifications" tone="muted" />
        <IconButton icon="apps" label="Apps" tone="muted" />
      </div>
    </div>
  );
}

function EfficiencyGauge() {
  return (
    <div className="bg-primary text-on-primary rounded-lg p-2 flex flex-col items-center justify-center relative overflow-hidden shadow-sm min-h-[68px]">
      <span className="text-[10px] text-on-primary/60 font-semibold uppercase tracking-wider absolute top-2 left-2">
        Efficiency
      </span>
      <div className="relative w-12 h-12 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" aria-hidden="true">
          <circle
            className="text-on-primary/10"
            cx="24"
            cy="24"
            fill="transparent"
            r="20"
            stroke="currentColor"
            strokeWidth="4"
          />
          <circle
            className="text-secondary-fixed"
            cx="24"
            cy="24"
            fill="transparent"
            r="20"
            stroke="currentColor"
            strokeDasharray="125"
            strokeDashoffset="30"
            strokeWidth="4"
          />
        </svg>
        <span className="absolute text-[12px] font-bold">94%</span>
      </div>
    </div>
  );
}

function KpiStrip() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-2">
      {KPI_METRICS.map((metric) => (
        <KpiCard key={metric.title} {...metric} />
      ))}
      <EfficiencyGauge />
    </div>
  );
}

function MoreIcon() {
  return <Icon name="more_horiz" className="text-[14px] text-on-primary/60" />;
}

function PoStatusChart() {
  return (
    <SectionPanel
      title="Purchase Order Status Summary"
      tone="primary"
      action={<MoreIcon />}
      className="xl:col-span-8"
      bodyClassName="p-4 min-h-48 flex items-end bg-surface-container-lowest"
    >
      <div className="flex-1 flex items-end justify-between gap-4 h-full min-h-40">
        <div className="flex-1 flex items-end justify-around gap-2">
          {STATUS_MONTHS.map((month) => (
            <div key={month.month} className="flex flex-col items-center gap-2 flex-1">
              <div className="flex items-end gap-1 h-32 w-full justify-center">
                <div 
                  className="w-3 bg-primary rounded-t transition-all" 
                  style={{ height: `${month.created}%` }} 
                />
                <div 
                  className="w-3 bg-secondary rounded-t transition-all" 
                  style={{ height: `${month.progress}%` }} 
                />
                <div 
                  className="w-3 bg-outline rounded-t transition-all" 
                  style={{ height: `${month.pending}%` }} 
                />
              </div>
              <span className="text-[10px] font-semibold text-on-surface uppercase tracking-wide">
                {month.month}
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 pl-6 pb-4 shrink-0 border-l border-outline-variant/30">
          {STATUS_LEGEND.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded ${item.className}`} />
              <span className="text-[9px] uppercase font-semibold text-on-surface-variant leading-none">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </SectionPanel>
  );
}

function SupplierRatingChart() {
  return (
    <SectionPanel
      title="Supplier Rating"
      tone="primary"
      icon="pie_chart"
      className="xl:col-span-4"
      bodyClassName="p-4 min-h-48 flex flex-col items-center justify-center gap-6 bg-surface-container-lowest"
    >
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
          {/* Background circle */}
          <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#e5eeff" strokeWidth="3" />
          {/* Excel - 65% */}
          <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#006c49" strokeDasharray="65 100" strokeWidth="3" strokeLinecap="round" />
          {/* Good - 25% */}
          <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#eeb8c9" strokeDasharray="25 100" strokeDashoffset="-65" strokeWidth="3" strokeLinecap="round" />
          {/* Risk - 10% */}
          <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#ba1a1a" strokeDasharray="10 100" strokeDashoffset="-90" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-primary">100</span>
          <span className="text-[8px] text-on-surface-variant uppercase font-semibold">Suppliers</span>
        </div>
      </div>
      <div className="w-full flex flex-col gap-2 px-2">
        {SUPPLIER_RATINGS.map((rating) => (
          <div key={rating.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${rating.className.replace('text-', 'bg-')}`} />
              <span className="text-[10px] text-on-surface uppercase font-semibold">{rating.label}</span>
            </div>
            <span className={`text-[11px] font-bold ${rating.className}`}>{rating.value}</span>
          </div>
        ))}
      </div>
    </SectionPanel>
  );
}

function PaymentTrendChart() {
  return (
    <SectionPanel
      title="On-Time Payment Trend"
      tone="primary"
      className="xl:col-span-6"
      bodyClassName="p-2 relative h-40"
    >
      <div className="absolute inset-x-2 inset-y-4 border-l border-b border-outline-variant flex items-end">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden="true">
          <path d="M0 80 L20 70 L40 75 L60 60 L80 65 L100 50" fill="none" stroke="#240713" strokeWidth="2" />
          {[0, 20, 40, 60, 80, 100].map((x, index) => (
            <circle
              key={x}
              cx={x}
              cy={[80, 70, 75, 60, 65, 50][index]}
              fill="#240713"
              r="2"
            />
          ))}
        </svg>
      </div>
      <div className="absolute bottom-0 inset-x-2 flex justify-between text-[8px] text-on-surface-variant font-bold">
        {["W1", "W2", "W3", "W4", "W5", "W6"].map((week) => (
          <span key={week}>{week}</span>
        ))}
      </div>
      <div className="absolute right-4 top-4 text-[14px] font-bold text-primary">Avg. 88%</div>
    </SectionPanel>
  );
}

function InventoryLevelsChart() {
  return (
    <SectionPanel
      title="Inventory by Category"
      tone="primary"
      className="xl:col-span-6"
      bodyClassName="p-3 min-h-40 flex flex-col gap-2"
    >
      {INVENTORY_CATEGORIES.map((category) => (
        <div key={category.label} className="space-y-1">
          <div className="flex justify-between text-[9px] font-bold uppercase">
            <span>{category.label}</span>
            <span>{category.value}%</span>
          </div>
          <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
            <div className={`h-full ${category.barClassName}`} style={{ width: `${category.value}%` }} />
          </div>
        </div>
      ))}
    </SectionPanel>
  );
}

function LogisticsHubPanel() {
  return (
    <section className="xl:col-span-12 bg-surface-container-lowest border border-outline-variant/70 rounded-lg shadow-sm h-64 relative overflow-hidden">
      <div className="absolute top-2 left-2 z-10 bg-primary/90 text-on-primary px-2 py-1 rounded flex items-center gap-2">
        <Icon name="public" className="text-[14px]" />
        <span className="text-[10px] font-bold uppercase tracking-widest">Global Logistics Hub</span>
      </div>
      <div
        className="w-full h-full bg-cover bg-center grayscale opacity-80"
        style={{ backgroundImage: `url("${LOGISTICS_MAP}")` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest to-transparent pointer-events-none" />
      <div className="absolute bottom-4 right-4 flex gap-2">
        {TRANSIT_METRICS.map((metric) => (
          <div
            key={metric.label}
            className="bg-white/90 backdrop-blur-sm border border-outline-variant p-2 shadow-sm rounded"
          >
            <div className="text-[8px] text-on-surface-variant font-bold uppercase">{metric.label}</div>
            <div className="text-md font-bold text-primary">{metric.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PurchaseOrdersTable() {
  return (
    <SectionPanel className="xl:col-span-12">
      <CompactTable
        columns={PO_COLUMNS}
        data={PURCHASE_ORDERS}
        rowKey={(row) => row.id}
        rowClassName={() => "cursor-pointer"}
      />
    </SectionPanel>
  );
}

function LiveUpdatesFooter() {
  return (
    <footer className="bg-primary text-on-primary text-[9px] flex flex-wrap items-center px-4 py-1.5 justify-between gap-2 rounded-lg">
      <div className="flex items-center gap-4 overflow-hidden">
        <span className="font-bold flex items-center gap-1 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse opacity-50" />
          LIVE UPDATES:
        </span>
        <div className="flex gap-4 opacity-80 whitespace-nowrap overflow-hidden">
          {LIVE_UPDATES.map((update, index) => (
            <span
              key={update}
              className={index > 0 ? "border-l border-white/20 pl-4" : ""}
            >
              {update}
            </span>
          ))}
        </div>
      </div>
      <div className="font-bold whitespace-nowrap">LAST REFRESH: 14:22:10</div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <AppShell
      title="Dashboard"
      userName="Shivam Chaudhari"
      userRole="Analytics Lead"
      activeNavLabel="Dashboard"
    >
      <main className="p-3 flex-1 bg-background space-y-2 overflow-x-hidden">
        <DashboardCommandBar />
        <KpiStrip />
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-2">
          <PoStatusChart />
          <SupplierRatingChart />
          <PaymentTrendChart />
          <InventoryLevelsChart />
          <LogisticsHubPanel />
          <PurchaseOrdersTable />
        </div>
        <LiveUpdatesFooter />
      </main>
    </AppShell>
  );
}
