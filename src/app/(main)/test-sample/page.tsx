"use client";
import { useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { MetricCard } from "@/components/cards/MetricCard";
import { DataTable, type TableColumn } from "@/components/table/DataTable";
import { Pagination } from "@/components/table/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ViewTestSampleModal } from "@/components/ui/ViewTestSampleModal";
import { ColumnVisibilitySelector } from "@/components/ui/ColumnVisibilitySelector";
import { Icon } from "@/components/ui/Icon";

// ─── Types ────────────────────────────────────────────────────────────────────

type StatusVariant = "muted";

interface MetricItem {
  title: string;
  value: number;
  subtitle: string;
}

interface TestSample {
  id: number;
  sampleNo: string;
  itemName: string;
  sampleQty: number;
  uom: string;
  sampleBatchNo: string;
  status: StatusVariant;
}

interface TableFilter {
  icon: string;
  label: string;
}

// ─── Page data ────────────────────────────────────────────────────────────────

const METRICS: MetricItem[] = [
  { title: "Total no of test sample", value: 6, subtitle: "All Time" },
  { title: "Total no of pending", value: 5, subtitle: "Waiting" },
  { title: "Total no of Open", value: 5, subtitle: "Active" },
  { title: "Total no of Failed", value: 5, subtitle: "Rejected" },
];

const TABLE_CONFIG = {
  title: "Dashboard",
  description: "List Of Purchase order",
};

const TABLE_FILTERS: TableFilter[] = [
  { icon: "filter_list", label: "All Statuses" },
  { icon: "calendar_today", label: "Last 30 Days" },
];

const PAGINATION = { current: 1, total: 10, totalPages: 3 };

const TEST_SAMPLES: TestSample[] = [
  {
    id: 1,
    sampleNo: "SM-00012",
    itemName: "Steel-01",
    sampleQty: 5,
    uom: "Kg",
    sampleBatchNo: "Batch-1",
    status: "muted",
  },
  {
    id: 2,
    sampleNo: "SM-00012",
    itemName: "Iron-01",
    sampleQty: 5,
    uom: "Kg",
    sampleBatchNo: "Batch-2",
    status: "muted",
  },
  {
    id: 3,
    sampleNo: "SM-00012",
    itemName: "Iron-01",
    sampleQty: 5,
    uom: "Kg",
    sampleBatchNo: "Batch-2",
    status: "muted",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TestSamplePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    id: true,
    sampleNo: true,
    itemName: true,
    sampleQty: true,
    uom: true,
    sampleBatchNo: true,
    status: true,
    actions: true,
  });

  const COLUMNS: TableColumn<TestSample>[] = [
    {
      field: "id",
      header: "Sr/N",
      body: (row) => <span className="text-on-surface font-medium">{row.id}</span>,
    },
    {
      field: "sampleNo",
      header: "Sample No",
      body: (row) => <span className="text-primary font-bold">{row.sampleNo}</span>,
    },
    {
      field: "itemName",
      header: "Item name",
      body: (row) => <span className="text-on-surface">{row.itemName}</span>,
    },
    {
      field: "sampleQty",
      header: "SampleQty",
      center: true,
      body: (row) => <span className="text-on-surface">{row.sampleQty}</span>,
    },
    {
      field: "uom",
      header: "UOM",
      body: (row) => <span className="text-on-surface">{row.uom}</span>,
    },
    {
      field: "sampleBatchNo",
      header: "Sample batch No",
      body: (row) => <span className="text-on-surface font-semibold">{row.sampleBatchNo}</span>,
    },
    {
      field: "status",
      header: "Status",
      center: true,
      body: (row) => <Badge variant={row.status} label="NA" />,
    },
    {
      field: "actions",
      header: "Actions",
      center: true,
      body: () => (
        <div className="flex items-center justify-center gap-1.5">
          <Button variant="icon" title="View" onClick={() => setIsModalOpen(true)}>
            <Icon name="visibility" size={18} />
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div className="min-h-screen flex flex-col antialiased text-slate-800">
      <main className="pt-16 p-6 space-y-5 flex-1 overflow-x-hidden">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {METRICS.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </div>

        {/* Test Sample Table */}
        <DataTable
          title={TABLE_CONFIG.title}
          description={TABLE_CONFIG.description}
          toolbarActions={
            <>
              <SearchBar />
              {TABLE_FILTERS.map((f) => (
                <FilterDropdown
                  key={f.label}
                  label={f.label}
                  options={[]}
                  active={new Set()}
                  onChange={() => {}}
                />
              ))}
              <ColumnVisibilitySelector
                columns={COLUMNS}
                visibleColumns={visibleColumns}
                onVisibilityChange={setVisibleColumns}
              />
              <Button variant="outlined" icon="download">
                Export CSV
              </Button>
            </>
          }
          columns={COLUMNS.filter((col) => visibleColumns[col.field])}
          data={TEST_SAMPLES}
          rowKey={(row) => row.id.toString()}
          showingCurrent={PAGINATION.current}
          showingTotal={PAGINATION.total}
          pagination={<Pagination {...PAGINATION} />}
        />
      </main>

      <Footer />

      <ViewTestSampleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
