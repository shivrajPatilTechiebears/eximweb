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

type AdminStatus = "active" | "pending" | "inactive";

interface Admin {
  id: string; name: string; email: string; phone: string;
  role: string; city: string; state: string; status: AdminStatus;
}

const STATUS_STYLE: Record<AdminStatus, string> = {
  active:   "text-emerald-600 bg-emerald-50",
  pending:  "text-amber-600 bg-amber-50",
  inactive: "text-rose-600 bg-rose-50",
};

const ADMINS: Admin[] = [
  { id: "ADM-001", name: "Ramesh Kumar",  email: "ramesh.kumar@techiebears.com",  phone: "+91 98765 43210", role: "Super Admin", city: "Mumbai",    state: "Maharashtra", status: "active"   },
  { id: "ADM-002", name: "Priya Sharma",  email: "priya.sharma@techiebears.com",  phone: "+91 91234 56789", role: "Admin",       city: "Pune",       state: "Maharashtra", status: "active"   },
  { id: "ADM-003", name: "Ankit Mehta",   email: "ankit.mehta@techiebears.com",   phone: "+91 87654 32109", role: "Manager",     city: "Ahmedabad",  state: "Gujarat",     status: "pending"  },
  { id: "ADM-004", name: "Sunita Patel",  email: "sunita.patel@techiebears.com",  phone: "+91 99887 76655", role: "Staff",       city: "Surat",      state: "Gujarat",     status: "inactive" },
  { id: "ADM-005", name: "Vikram Singh",  email: "vikram.singh@techiebears.com",  phone: "+91 77665 54433", role: "Admin",       city: "Delhi",      state: "Delhi",       status: "active"   },
  { id: "ADM-006", name: "Meena Iyer",    email: "meena.iyer@techiebears.com",    phone: "+91 88776 65544", role: "Manager",     city: "Bangalore",  state: "Karnataka",   status: "pending"  },
];

const PAGE_SIZE = 10;

const ALL_COLS: Column<Admin>[] = [
  { key: "name",    header: "Name",   sortable: true,  align: "left"   },
  { key: "email",   header: "Email",  sortable: true,  align: "left"   },
  { key: "phone",   header: "Phone",  sortable: false, align: "left"   },
  { key: "role",    header: "Role",   sortable: true,  align: "left"   },
  { key: "city",    header: "City",   sortable: true,  align: "left"   },
  { key: "state",   header: "State",  sortable: true,  align: "left"   },
  { key: "status",  header: "Status", sortable: true,  align: "center" },
  { key: "actions", header: "Actions",sortable: false, align: "right"  },
];

const DEFAULT_VISIBLE = new Set(["name", "email", "phone", "role", "city", "status", "actions"]);

// ── Page ───────────────────────────────────────────────────────────────────────

export default function AdminManagementPage() {
  const [admins, setAdmins]           = useState([...ADMINS]);
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

  // ── Filtered + sorted data ────────────────────────────────────────────────────

  const bySearch = admins.filter((a) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || a.role.toLowerCase().includes(q) || a.city.toLowerCase().includes(q);
  });

  const sorted = [...bySearch].sort((a, b) => {
    if (!sortKey) return 0;
    const av = String((a as unknown as Record<string, unknown>)[sortKey] ?? "");
    const bv = String((b as unknown as Record<string, unknown>)[sortKey] ?? "");
    return sortDir === "asc"
      ? av.localeCompare(bv, undefined, { numeric: true })
      : bv.localeCompare(av, undefined, { numeric: true });
  });

  const TAB_FILTERS: (AdminStatus[] | null)[] = [null, ["active"], ["inactive"]];

  const tabData = TAB_FILTERS.map((f) =>
    f ? sorted.filter((a) => f.includes(a.status)) : sorted
  );

  // ── Column definitions with inline cell renderers ─────────────────────────────

  const cols: Column<Admin>[] = ALL_COLS
    .filter((c) => visibleCols.has(c.key))
    .map((col) => {
      switch (col.key) {
        case "name": return {
          ...col,
          cell: (row: Admin): ReactNode => (
            <Link href={`/admin-management/${row.id}`} className="text-[11px] font-semibold text-[#884D70] hover:underline underline-offset-2">
              {row.name}
            </Link>
          ),
        };
        case "email":  return { ...col, cell: (row: Admin): ReactNode => <span className="text-[11px] text-gray-700">{row.email}</span> };
        case "phone":  return { ...col, cell: (row: Admin): ReactNode => <span className="text-[11px] text-gray-700 tabular-nums font-mono">{row.phone}</span> };
        case "role":   return { ...col, cell: (row: Admin): ReactNode => <span className="text-[11px] text-slate-800 font-medium">{row.role}</span> };
        case "city":   return { ...col, cell: (row: Admin): ReactNode => <span className="text-[11px] text-gray-700">{row.city}</span> };
        case "state":  return { ...col, cell: (row: Admin): ReactNode => <span className="text-[11px] text-gray-700">{row.state}</span> };
        case "status": return {
          ...col,
          cell: (row: Admin): ReactNode => (
            <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLE[row.status]}`}>
              {row.status}
            </span>
          ),
        };
        case "actions": return {
          ...col,
          cell: (row: Admin): ReactNode => (
            <TableActions
              viewHref={`/admin-management/${row.id}`}
              editHref={`/admin-management/${row.id}/edit`}
              onDelete={() => setDeleteId(deleteId === row.id ? null : row.id)}
            />
          ),
        };
        default: return col;
      }
    });

  // ── Delete confirmation row ───────────────────────────────────────────────────

  const expandedRow = (row: Admin, colSpan: number): ReactNode =>
    deleteId !== row.id ? null : (
      <tr className="bg-red-100/50 backdrop-blur-sm">
        <td colSpan={colSpan} className="px-4 py-2.5 border-b border-red-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-red-700 font-medium">
              Delete <strong>{row.name}</strong>? This cannot be undone.
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => { setAdmins((p) => p.filter((a) => a.id !== row.id)); setDeleteId(null); }}
                className="px-3 py-1 bg-red-500 text-white text-[10px] font-semibold rounded-lg hover:bg-red-600 transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="px-3 py-1 bg-white/60 backdrop-blur-sm text-gray-700 text-[10px] font-semibold rounded-lg border border-white/60 hover:bg-white/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </td>
      </tr>
    );

  // ── Build tabs ────────────────────────────────────────────────────────────────

  const TAB_LABELS = ["All", "Active", "Inactive"];

  const tabs: TabbedTableTab[] = TAB_LABELS.map((label, i) => {
    const data = tabData[i];
    const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
    const pagedData  = data.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    return {
      label: `${label} (${data.length})`,
      table: {
        columns:   cols as Column<unknown>[],
        data:      pagedData as unknown[],
        rowKey:    (row) => (row as Admin).id,
        sortKey,
        sortDir,
        onSort:    handleSort,
        rowClassName: (row, idx) => {
          const a = row as Admin;
          return deleteId === a.id ? "bg-red-100/60" : idx % 2 === 0 ? "bg-white/45 hover:bg-white/70" : "bg-white/20 hover:bg-white/50";
        },
        expandedRow: (row, colSpan) => expandedRow(row as Admin, colSpan),
        emptyMessage: `No ${label.toLowerCase()} admins found.`,
        statusBar: (
          <>
            <div className="flex items-center gap-4 text-[10px] text-gray-500">
              <span>Count: <strong className="text-gray-700 font-semibold">{data.length}</strong></span>
              {i === 0 && (
                <>
                  <span className="text-gray-300">|</span>
                  <span>Active: <strong className="text-emerald-600 font-semibold">{admins.filter((a) => a.status === "active").length}</strong></span>
                  <span className="text-gray-300">·</span>
                  <span>Inactive: <strong className="text-rose-600 font-semibold">{admins.filter((a) => a.status === "inactive").length}</strong></span>
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

      <FloatingNavbar />
      <SecondaryNav />

      <DashboardPageHeader
        title="Admin Management"
        breadcrumbs={[
          { label: "Dashboard",        href: "/" },
          { label: "Admin Management" },
        ]}
        summary={`${admins.length} total`}
        buttonText="Create Admin"
        buttonHref="/admin-management/create"
      />

      <main className="flex-1 px-6 pt-4 pb-4">

        {/* Controls row */}
        <div className="flex items-center px-1 pb-2 gap-2">
          <div className="flex-1" />
          <SearchInput value={search} onChange={handleSearchChange} placeholder="Search admins…" />
          <div className="w-px h-4 bg-gray-300/60 shrink-0" />
          <ColumnSelector
            columns={ALL_COLS.filter((c) => c.key !== "actions")}
            visibleColumns={visibleCols}
            onToggle={toggleCol}
          />
          <button className="flex items-center gap-1.5 text-[11px] font-semibold text-white px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#884D70] to-[#6B3A5A] hover:from-[#9E6080] hover:to-[#9E6080] shadow-[0_2px_10px_rgba(136,77,112,0.35)] hover:shadow-[0_4px_16px_rgba(136,77,112,0.5)] transition-all">
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
