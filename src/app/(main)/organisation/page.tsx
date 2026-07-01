"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { DashboardPageHeader } from "@/components/layout/PageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { TabbedTable, type TabbedTableTab } from "@/components/table/TabbedTable";
import { type Column } from "@/components/table/DataTable";
import { TableActions } from "@/components/table/TableActions";
import { ColumnSelector } from "@/components/ui/ColumnSelector";
import { Pagination } from "@/components/ui/Pagination";

// ── Data ───────────────────────────────────────────────────────────────────────

type OrgStatus = "active" | "inactive";

interface Organisation {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  status: OrgStatus;
}

const STATUS_STYLE: Record<OrgStatus, string> = {
  active:   "text-emerald-600 bg-emerald-50",
  inactive: "text-rose-600 bg-rose-50",
};

const ORGANISATIONS: Organisation[] = [
  { id: "ORG-001", name: "Techiebears Pvt Ltd",   email: "admin@techiebears.com",   phone: "+91 98765 43210", country: "India",         city: "Mumbai",    status: "active"   },
  { id: "ORG-002", name: "GlobalEdge Inc",         email: "info@globaledge.io",      phone: "+1 555 234 5678", country: "United States", city: "New York",  status: "active"   },
  { id: "ORG-003", name: "Nexus Digital",          email: "nexus@nexusdigital.co",   phone: "+91 99001 12233", country: "India",         city: "Bangalore", status: "active"   },
  { id: "ORG-004", name: "BlueStar Logistics",     email: "ops@bluestar.net",        phone: "+91 77665 54433", country: "India",         city: "Delhi",     status: "inactive" },
  { id: "ORG-005", name: "Apex Systems",           email: "hello@apexsys.com",       phone: "+91 88776 65544", country: "India",         city: "Surat",     status: "active"   },
];

const PAGE_SIZE = 10;

const ALL_COLS: Column<Organisation>[] = [
  { key: "name",    header: "Organisation Name", sortable: true,  align: "left"   },
  { key: "email",   header: "Email",             sortable: true,  align: "left"   },
  { key: "phone",   header: "Phone",             sortable: false, align: "left"   },
  { key: "country", header: "Country",           sortable: true,  align: "left"   },
  { key: "city",    header: "City",              sortable: true,  align: "left"   },
  { key: "status",  header: "Status",            sortable: true,  align: "center" },
  { key: "actions", header: "Actions",           sortable: false, align: "right"  },
];

const DEFAULT_VISIBLE = new Set(["name", "email", "phone", "country", "city", "status", "actions"]);

// ── Page ───────────────────────────────────────────────────────────────────────

export default function OrganisationPage() {
  const [orgs, setOrgs]               = useState([...ORGANISATIONS]);
  const [deleteId, setDeleteId]       = useState<string | null>(null);
  const [search, setSearch]           = useState("");
  const [activeTab, setActiveTab]     = useState(0);
  const [sortKey, setSortKey]         = useState<string | null>(null);
  const [sortDir, setSortDir]         = useState<"asc" | "desc">("asc");
  const [visibleCols, setVisibleCols] = useState<Set<string>>(DEFAULT_VISIBLE);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const handleSearchChange = (v: string) => { setSearch(v); setCurrentPage(1); };

  const toggleCol = (key: string) =>
    setVisibleCols((prev) => {
      const n = new Set(prev);
      n.has(key) ? n.delete(key) : n.add(key);
      n.add("actions");
      return n;
    });

  // ── Filtered + sorted ─────────────────────────────────────────────────────────

  const bySearch = orgs.filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      o.name.toLowerCase().includes(q) ||
      o.email.toLowerCase().includes(q) ||
      o.country.toLowerCase().includes(q) ||
      o.city.toLowerCase().includes(q)
    );
  });

  const sorted = [...bySearch].sort((a, b) => {
    if (!sortKey) return 0;
    const av = String((a as unknown as Record<string, unknown>)[sortKey] ?? "");
    const bv = String((b as unknown as Record<string, unknown>)[sortKey] ?? "");
    return sortDir === "asc"
      ? av.localeCompare(bv, undefined, { numeric: true })
      : bv.localeCompare(av, undefined, { numeric: true });
  });

  const TAB_FILTERS: (OrgStatus[] | null)[] = [null, ["active"], ["inactive"]];
  const tabData = TAB_FILTERS.map((f) =>
    f ? sorted.filter((o) => f.includes(o.status)) : sorted
  );

  // ── Column renderers ──────────────────────────────────────────────────────────

  const cols: Column<Organisation>[] = ALL_COLS
    .filter((c) => visibleCols.has(c.key))
    .map((col) => {
      switch (col.key) {
        case "name": return {
          ...col,
          cell: (row: Organisation): ReactNode => (
            <Link href={`/organisation/${row.id}`} className="text-[11px] font-semibold text-[#884D70] hover:underline underline-offset-2">
              {row.name}
            </Link>
          ),
        };
        case "email":   return { ...col, cell: (row: Organisation): ReactNode => <span className="text-[11px] text-gray-700">{row.email}</span> };
        case "phone":   return { ...col, cell: (row: Organisation): ReactNode => <span className="text-[11px] text-gray-700 tabular-nums font-mono">{row.phone}</span> };
        case "country": return { ...col, cell: (row: Organisation): ReactNode => <span className="text-[11px] text-slate-800 font-medium">{row.country}</span> };
        case "city":    return { ...col, cell: (row: Organisation): ReactNode => <span className="text-[11px] text-gray-700">{row.city}</span> };
        case "status": return {
          ...col,
          cell: (row: Organisation): ReactNode => (
            <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLE[row.status]}`}>
              {row.status}
            </span>
          ),
        };
        case "actions": return {
          ...col,
          cell: (row: Organisation): ReactNode => (
            <TableActions
              viewHref={`/organisation/${row.id}`}
              editHref={`/organisation/${row.id}/edit`}
              onDelete={() => setDeleteId(deleteId === row.id ? null : row.id)}
            />
          ),
        };
        default: return col;
      }
    });

  // ── Delete confirmation row ───────────────────────────────────────────────────

  const expandedRow = (row: Organisation, colSpan: number): ReactNode =>
    deleteId !== row.id ? null : (
      <tr className="bg-red-100/50 backdrop-blur-sm">
        <td colSpan={colSpan} className="px-4 py-2.5 border-b border-red-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-red-700 font-medium">
              Delete <strong>{row.name}</strong>? This cannot be undone.
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => { setOrgs((p) => p.filter((o) => o.id !== row.id)); setDeleteId(null); }}
                className="btn-danger"
              >
                Confirm
              </button>
              <button onClick={() => setDeleteId(null)} className="btn-ghost-glass">
                Cancel
              </button>
            </div>
          </div>
        </td>
      </tr>
    );

  // ── Tabs ──────────────────────────────────────────────────────────────────────

  const TAB_LABELS = ["All", "Active", "Inactive"];

  const tabs: TabbedTableTab[] = TAB_LABELS.map((label, i) => {
    const data       = tabData[i];
    const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
    const pagedData  = data.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    return {
      label: `${label} (${data.length})`,
      table: {
        columns:   cols as Column<unknown>[],
        data:      pagedData as unknown[],
        rowKey:    (row) => (row as Organisation).id,
        sortKey,
        sortDir,
        onSort:    handleSort,
        rowClassName: (row, idx) => {
          const o = row as Organisation;
          return deleteId === o.id
            ? "bg-red-100/60"
            : idx % 2 === 0
            ? "bg-white/45 hover:bg-white/70"
            : "bg-white/20 hover:bg-white/50";
        },
        expandedRow: (row, colSpan) => expandedRow(row as Organisation, colSpan),
        emptyMessage: `No ${label.toLowerCase()} organisations found.`,
        statusBar: (
          <>
            <div className="flex items-center gap-4 text-[10px] text-gray-500">
              <span>Count: <strong className="text-gray-700 font-semibold">{data.length}</strong></span>
              {i === 0 && (
                <>
                  <span className="text-gray-300">|</span>
                  <span>Active: <strong className="text-emerald-600 font-semibold">{orgs.filter((o) => o.status === "active").length}</strong></span>
                  <span className="text-gray-300">·</span>
                  <span>Inactive: <strong className="text-rose-600 font-semibold">{orgs.filter((o) => o.status === "inactive").length}</strong></span>
                </>
              )}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        ),
      },
    };
  });

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col antialiased text-slate-800">

      <DashboardPageHeader
        title="Organisation"
        breadcrumbs={[
          { label: "Dashboard",    href: "/" },
          { label: "Organisation" },
        ]}
        summary={`${orgs.length} total`}
        buttonText="Create Organisation"
        buttonHref="/organisation/create"
      />

      <main className="flex-1 px-6 pt-4 pb-4">
        <div className="flex items-center px-1 pb-2 gap-2">
          <div className="flex-1" />
          <SearchInput value={search} onChange={handleSearchChange} placeholder="Search organisations…" />
          <div className="w-px h-4 bg-gray-300/60 shrink-0" />
          <ColumnSelector
            columns={ALL_COLS.filter((c) => c.key !== "actions")}
            visibleColumns={visibleCols}
            onToggle={toggleCol}
          />
          <button className="btn-brand">
            <Icon name="download" size={13} />
            Export
          </button>
        </div>

        <TabbedTable
          tabs={tabs}
          onChange={(i) => { setActiveTab(i); setCurrentPage(1); }}
        />
      </main>
    </div>
  );
}
