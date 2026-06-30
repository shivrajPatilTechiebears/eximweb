"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { FloatingNavbar } from "@/components/layout/FloatingNavbar";
import { SecondaryNav } from "@/components/layout/SecondaryNav";
import { DashboardPageHeader } from "@/components/layout/PageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { TabbedTable, type TabbedTableTab } from "@/components/table/TabbedTable";
import { type Column } from "@/components/table/DataTable";
import { TableActions } from "@/components/table/TableActions";
import { ColumnSelector } from "@/components/ui/ColumnSelector";
import { Pagination } from "@/components/ui/Pagination";

// ── Data ───────────────────────────────────────────────────────────────────────

type GroupStatus = "active" | "inactive";

interface GroupCompany {
  id: string;
  name: string;
  code: string;
  organisation: string;
  email: string;
  contact: string;
  city: string;
  status: GroupStatus;
}

const STATUS_STYLE: Record<GroupStatus, string> = {
  active:   "text-emerald-600 bg-emerald-50",
  inactive: "text-rose-600 bg-rose-50",
};

const GROUP_COMPANIES: GroupCompany[] = [
  { id: "GRP-001", name: "Group Alpha",  code: "GRP-001", organisation: "Techiebears Pvt Ltd", email: "alpha@techiebears.com",  contact: "+91 98001 11001", city: "Mumbai",   status: "active"   },
  { id: "GRP-002", name: "Group Beta",   code: "GRP-002", organisation: "Techiebears Pvt Ltd", email: "beta@techiebears.com",   contact: "+91 98002 22002", city: "Pune",     status: "active"   },
  { id: "GRP-003", name: "Group Gamma",  code: "GRP-003", organisation: "GlobalEdge Inc",      email: "gamma@globaledge.io",    contact: "+1 555 300 3003", city: "New York", status: "inactive" },
  { id: "GRP-004", name: "Group Delta",  code: "GRP-004", organisation: "Nexus Digital",       email: "delta@nexusdigital.co",  contact: "+91 98004 44004", city: "Bangalore",status: "active"   },
  { id: "GRP-005", name: "Group Sigma",  code: "GRP-005", organisation: "Apex Systems",        email: "sigma@apexsys.com",      contact: "+91 98005 55005", city: "Surat",    status: "active"   },
];

const PAGE_SIZE = 10;

const ALL_COLS: Column<GroupCompany>[] = [
  { key: "name",         header: "Group Name",   sortable: true,  align: "left"   },
  { key: "code",         header: "Code",         sortable: true,  align: "left"   },
  { key: "organisation", header: "Organisation", sortable: true,  align: "left"   },
  { key: "email",        header: "Email",        sortable: true,  align: "left"   },
  { key: "contact",      header: "Contact",      sortable: false, align: "left"   },
  { key: "city",         header: "City",         sortable: true,  align: "left"   },
  { key: "status",       header: "Status",       sortable: true,  align: "center" },
  { key: "actions",      header: "Actions",      sortable: false, align: "right"  },
];

const DEFAULT_VISIBLE = new Set(["name", "code", "organisation", "email", "contact", "city", "status", "actions"]);

// ── Page ───────────────────────────────────────────────────────────────────────

export default function GroupCompanyPage() {
  const [groups, setGroups]           = useState([...GROUP_COMPANIES]);
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

  const bySearch = groups.filter((g) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      g.name.toLowerCase().includes(q) ||
      g.code.toLowerCase().includes(q) ||
      g.organisation.toLowerCase().includes(q) ||
      g.city.toLowerCase().includes(q)
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

  const TAB_FILTERS: (GroupStatus[] | null)[] = [null, ["active"], ["inactive"]];
  const tabData = TAB_FILTERS.map((f) =>
    f ? sorted.filter((g) => f.includes(g.status)) : sorted
  );

  const cols: Column<GroupCompany>[] = ALL_COLS
    .filter((c) => visibleCols.has(c.key))
    .map((col) => {
      switch (col.key) {
        case "name": return {
          ...col,
          cell: (row: GroupCompany): ReactNode => (
            <Link href={`/group-company/${row.id}`} className="text-[11px] font-semibold text-[#884D70] hover:underline underline-offset-2">
              {row.name}
            </Link>
          ),
        };
        case "code":         return { ...col, cell: (row: GroupCompany): ReactNode => <span className="text-[11px] font-mono text-gray-500 tabular-nums">{row.code}</span> };
        case "organisation": return { ...col, cell: (row: GroupCompany): ReactNode => <span className="text-[11px] text-slate-800 font-medium">{row.organisation}</span> };
        case "email":        return { ...col, cell: (row: GroupCompany): ReactNode => <span className="text-[11px] text-gray-700">{row.email}</span> };
        case "contact":      return { ...col, cell: (row: GroupCompany): ReactNode => <span className="text-[11px] text-gray-700 tabular-nums font-mono">{row.contact}</span> };
        case "city":         return { ...col, cell: (row: GroupCompany): ReactNode => <span className="text-[11px] text-gray-700">{row.city}</span> };
        case "status": return {
          ...col,
          cell: (row: GroupCompany): ReactNode => (
            <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLE[row.status]}`}>
              {row.status}
            </span>
          ),
        };
        case "actions": return {
          ...col,
          cell: (row: GroupCompany): ReactNode => (
            <TableActions
              viewHref={`/group-company/${row.id}`}
              editHref={`/group-company/${row.id}/edit`}
              onDelete={() => setDeleteId(deleteId === row.id ? null : row.id)}
            />
          ),
        };
        default: return col;
      }
    });

  const expandedRow = (row: GroupCompany, colSpan: number): ReactNode =>
    deleteId !== row.id ? null : (
      <tr className="bg-red-100/50 backdrop-blur-sm">
        <td colSpan={colSpan} className="px-4 py-2.5 border-b border-red-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-red-700 font-medium">
              Delete <strong>{row.name}</strong>? This cannot be undone.
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => { setGroups((p) => p.filter((g) => g.id !== row.id)); setDeleteId(null); }}
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

  const TAB_LABELS = ["All", "Active", "Inactive"];

  const tabs: TabbedTableTab[] = TAB_LABELS.map((label, i) => {
    const data       = tabData[i];
    const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
    const pagedData  = data.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    return {
      label: `${label} (${data.length})`,
      table: {
        columns:      cols as Column<unknown>[],
        data:         pagedData as unknown[],
        rowKey:       (row) => (row as GroupCompany).id,
        sortKey,
        sortDir,
        onSort:       handleSort,
        rowClassName: (row, idx) => {
          const g = row as GroupCompany;
          return deleteId === g.id
            ? "bg-red-100/60"
            : idx % 2 === 0
            ? "bg-white/45 hover:bg-white/70"
            : "bg-white/20 hover:bg-white/50";
        },
        expandedRow:  (row, colSpan) => expandedRow(row as GroupCompany, colSpan),
        emptyMessage: `No ${label.toLowerCase()} group companies found.`,
        statusBar: (
          <>
            <div className="flex items-center gap-4 text-[10px] text-gray-500">
              <span>Count: <strong className="text-gray-700 font-semibold">{data.length}</strong></span>
              {i === 0 && (
                <>
                  <span className="text-gray-300">|</span>
                  <span>Active: <strong className="text-emerald-600 font-semibold">{groups.filter((g) => g.status === "active").length}</strong></span>
                  <span className="text-gray-300">·</span>
                  <span>Inactive: <strong className="text-rose-600 font-semibold">{groups.filter((g) => g.status === "inactive").length}</strong></span>
                </>
              )}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        ),
      },
    };
  });

  return (
    <div className="min-h-screen flex flex-col antialiased text-slate-800">
      <FloatingNavbar />
      <SecondaryNav />

      <DashboardPageHeader
        title="Group of Company"
        breadcrumbs={[
          { label: "Dashboard",       href: "/" },
          { label: "Group of Company" },
        ]}
        summary={`${groups.length} total`}
        buttonText="Create Group"
        buttonHref="/group-company/create"
      />

      <main className="flex-1 px-6 pt-4 pb-4">
        <div className="flex items-center px-1 pb-2 gap-2">
          <div className="flex-1" />
          <SearchInput value={search} onChange={handleSearchChange} placeholder="Search groups…" />
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
