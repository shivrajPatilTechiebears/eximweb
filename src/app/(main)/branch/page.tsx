"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { DashboardPageHeader } from "@/components/layout/PageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { TabbedTable, type TabbedTableTab } from "@/components/table/TabbedTable";
import { type Column } from "@/components/table/DataTable";
import { TableActions } from "@/components/table/TableActions";
import { ColumnSelector } from "@/components/ui/ColumnSelector";
import { Pagination } from "@/components/ui/Pagination";

type BranchStatus = "active" | "inactive";

interface Branch {
  id: string;
  name: string;
  code: string;
  organisation: string;
  groupCompany: string;
  email: string;
  contact: string;
  city: string;
  status: BranchStatus;
}

const STATUS_STYLE: Record<BranchStatus, string> = {
  active:   "text-emerald-600 bg-emerald-50",
  inactive: "text-rose-600 bg-rose-50",
};

const BRANCHES: Branch[] = [
  { id: "BRN-001", name: "Mumbai HQ",       code: "BRN-001", organisation: "Techiebears Pvt Ltd", groupCompany: "Group Alpha", email: "mumbai@techiebears.com",  contact: "+91 98001 11001", city: "Mumbai",    status: "active"   },
  { id: "BRN-002", name: "Pune Office",     code: "BRN-002", organisation: "Techiebears Pvt Ltd", groupCompany: "Group Alpha", email: "pune@techiebears.com",    contact: "+91 98002 22002", city: "Pune",      status: "active"   },
  { id: "BRN-003", name: "New York Office", code: "BRN-003", organisation: "GlobalEdge Inc",      groupCompany: "Group Gamma", email: "newyork@globaledge.io",   contact: "+1 555 300 3003", city: "New York",  status: "inactive" },
  { id: "BRN-004", name: "Bangalore Hub",   code: "BRN-004", organisation: "Nexus Digital",       groupCompany: "Group Delta", email: "blr@nexusdigital.co",     contact: "+91 98004 44004", city: "Bangalore", status: "active"   },
  { id: "BRN-005", name: "Surat Branch",    code: "BRN-005", organisation: "Apex Systems",        groupCompany: "Group Sigma", email: "surat@apexsys.com",       contact: "+91 98005 55005", city: "Surat",     status: "active"   },
];

const PAGE_SIZE = 10;

const ALL_COLS: Column<Branch>[] = [
  { key: "name",         header: "Branch Name",  sortable: true,  align: "left"   },
  { key: "code",         header: "Code",         sortable: true,  align: "left"   },
  { key: "organisation", header: "Organisation", sortable: true,  align: "left"   },
  { key: "groupCompany", header: "Group Company",sortable: true,  align: "left"   },
  { key: "email",        header: "Email",        sortable: true,  align: "left"   },
  { key: "contact",      header: "Contact",      sortable: false, align: "left"   },
  { key: "city",         header: "City",         sortable: true,  align: "left"   },
  { key: "status",       header: "Status",       sortable: true,  align: "center" },
  { key: "actions",      header: "Actions",      sortable: false, align: "right"  },
];

const DEFAULT_VISIBLE = new Set(["name", "code", "organisation", "groupCompany", "email", "contact", "city", "status", "actions"]);

export default function BranchPage() {
  const [branches, setBranches]   = useState([...BRANCHES]);
  const [deleteId, setDeleteId]   = useState<string | null>(null);
  const [search, setSearch]       = useState("");
  const [sortKey, setSortKey]     = useState<string | null>(null);
  const [sortDir, setSortDir]     = useState<"asc" | "desc">("asc");
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

  const bySearch = branches.filter((b) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      b.name.toLowerCase().includes(q) ||
      b.code.toLowerCase().includes(q) ||
      b.organisation.toLowerCase().includes(q) ||
      b.city.toLowerCase().includes(q)
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

  const TAB_FILTERS: (BranchStatus[] | null)[] = [null, ["active"], ["inactive"]];
  const tabData = TAB_FILTERS.map((f) =>
    f ? sorted.filter((b) => f.includes(b.status)) : sorted
  );

  const cols: Column<Branch>[] = ALL_COLS
    .filter((c) => visibleCols.has(c.key))
    .map((col) => {
      switch (col.key) {
        case "name": return {
          ...col,
          cell: (row: Branch): ReactNode => (
            <Link href={`/branch/${row.id}`} className="text-[11px] font-semibold text-[#884D70] hover:underline underline-offset-2">
              {row.name}
            </Link>
          ),
        };
        case "code":         return { ...col, cell: (row: Branch): ReactNode => <span className="text-[11px] font-mono text-gray-500 tabular-nums">{row.code}</span> };
        case "organisation": return { ...col, cell: (row: Branch): ReactNode => <span className="text-[11px] text-slate-800 font-medium">{row.organisation}</span> };
        case "groupCompany": return { ...col, cell: (row: Branch): ReactNode => <span className="text-[11px] text-gray-700">{row.groupCompany}</span> };
        case "email":        return { ...col, cell: (row: Branch): ReactNode => <span className="text-[11px] text-gray-700">{row.email}</span> };
        case "contact":      return { ...col, cell: (row: Branch): ReactNode => <span className="text-[11px] text-gray-700 tabular-nums font-mono">{row.contact}</span> };
        case "city":         return { ...col, cell: (row: Branch): ReactNode => <span className="text-[11px] text-gray-700">{row.city}</span> };
        case "status": return {
          ...col,
          cell: (row: Branch): ReactNode => (
            <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLE[row.status]}`}>
              {row.status}
            </span>
          ),
        };
        case "actions": return {
          ...col,
          cell: (row: Branch): ReactNode => (
            <TableActions
              viewHref={`/branch/${row.id}`}
              editHref={`/branch/${row.id}/edit`}
              onDelete={() => setDeleteId(deleteId === row.id ? null : row.id)}
            />
          ),
        };
        default: return col;
      }
    });

  const expandedRow = (row: Branch, colSpan: number): ReactNode =>
    deleteId !== row.id ? null : (
      <tr className="bg-red-100/50 backdrop-blur-sm">
        <td colSpan={colSpan} className="px-4 py-2.5 border-b border-red-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-red-700 font-medium">
              Delete <strong>{row.name}</strong>? This cannot be undone.
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => { setBranches((p) => p.filter((b) => b.id !== row.id)); setDeleteId(null); }}
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
        rowKey:       (row) => (row as Branch).id,
        sortKey,
        sortDir,
        onSort:       handleSort,
        rowClassName: (row, idx) => {
          const b = row as Branch;
          return deleteId === b.id
            ? "bg-red-100/60"
            : idx % 2 === 0
            ? "bg-white/45 hover:bg-white/70"
            : "bg-white/20 hover:bg-white/50";
        },
        expandedRow:  (row, colSpan) => expandedRow(row as Branch, colSpan),
        emptyMessage: `No ${label.toLowerCase()} branches found.`,
        statusBar: (
          <>
            <div className="flex items-center gap-4 text-[10px] text-gray-500">
              <span>Count: <strong className="text-gray-700 font-semibold">{data.length}</strong></span>
              {i === 0 && (
                <>
                  <span className="text-gray-300">|</span>
                  <span>Active: <strong className="text-emerald-600 font-semibold">{branches.filter((b) => b.status === "active").length}</strong></span>
                  <span className="text-gray-300">·</span>
                  <span>Inactive: <strong className="text-rose-600 font-semibold">{branches.filter((b) => b.status === "inactive").length}</strong></span>
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

      <DashboardPageHeader
        title="Branch"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Branch" },
        ]}
        summary={`${branches.length} total`}
        buttonText="Create Branch"
        buttonHref="/branch/create"
      />

      <main className="flex-1 px-6 pt-4 pb-4">
        <div className="flex items-center px-1 pb-2 gap-2">
          <div className="flex-1" />
          <SearchInput value={search} onChange={handleSearchChange} placeholder="Search branches…" />
          <div className="w-px h-4 bg-gray-300/60 shrink-0" />
          <ColumnSelector
            columns={ALL_COLS.filter((c) => c.key !== "actions")}
            visibleColumns={visibleCols}
            onToggle={toggleCol}
          />
          <Button variant="cta-secondary">
            <Icon name="download" size={13} />
            Export
          </Button>
        </div>

        <TabbedTable
          tabs={tabs}
          onChange={() => { setCurrentPage(1); }}
        />
      </main>
    </div>
  );
}
