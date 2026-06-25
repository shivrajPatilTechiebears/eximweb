"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { FloatingNavbar } from "@/components/layout/FloatingNavbar";
import { SecondaryNav } from "@/components/layout/SecondaryNav";
import { DashboardPageHeader } from "@/components/layout/PageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { ExcelTable, type Column } from "@/components/table/DataTable";
import { TableActions } from "@/components/table/TableActions";
import { ColumnSelector } from "@/components/ui/ColumnSelector";
import { Pagination } from "@/components/ui/Pagination";

// ── Data ───────────────────────────────────────────────────────────────────────

type CompanyStatus = "active" | "pending" | "inactive";

interface Company {
  id: string; name: string; domain: string; email: string;
  phone: string; country: string; status: CompanyStatus;
}

const STATUS_STYLE: Record<CompanyStatus, string> = {
  active:   "text-emerald-600 bg-emerald-50",
  pending:  "text-amber-600 bg-amber-50",
  inactive: "text-rose-600 bg-rose-50",
};

const COMPANIES: Company[] = [
  { id: "COMP-001", name: "TechCorp Solutions", domain: "techcorp.com",    email: "admin@techcorp.com",    phone: "+91 98765 43210", country: "India",         status: "active"   },
  { id: "COMP-002", name: "InnoSoft Pvt Ltd",   domain: "innosoft.in",     email: "contact@innosoft.in",   phone: "+91 91234 56789", country: "India",         status: "active"   },
  { id: "COMP-003", name: "GlobalEdge Inc",     domain: "globaledge.io",   email: "info@globaledge.io",    phone: "+1 555 234 5678", country: "United States", status: "pending"  },
  { id: "COMP-004", name: "Apex Systems",       domain: "apexsys.com",     email: "hello@apexsys.com",     phone: "+91 88776 65544", country: "India",         status: "inactive" },
  { id: "COMP-005", name: "BlueStar Logistics", domain: "bluestar.net",    email: "ops@bluestar.net",      phone: "+91 77665 54433", country: "India",         status: "active"   },
  { id: "COMP-006", name: "Nexus Digital",      domain: "nexusdigital.co", email: "nexus@nexusdigital.co", phone: "+91 99001 12233", country: "India",         status: "pending"  },
];

const ALL_COLS: Column<Company>[] = [
  { key: "name",    header: "Company Name", sortable: true,  align: "left"   },
  { key: "domain",  header: "Domain",       sortable: true,  align: "left"   },
  { key: "email",   header: "Email",        sortable: true,  align: "left"   },
  { key: "phone",   header: "Phone",        sortable: false, align: "left"   },
  { key: "country", header: "Country",      sortable: true,  align: "left"   },
  { key: "status",  header: "Status",       sortable: true,  align: "center" },
  { key: "actions", header: "Actions",      sortable: false, align: "right"  },
];

const DEFAULT_VISIBLE = new Set(["name", "domain", "email", "phone", "country", "status", "actions"]);
const PAGE_SIZE = 10;

// ── Page ───────────────────────────────────────────────────────────────────────

export default function CompanyManagementPage() {
  const [companies, setCompanies]     = useState([...COMPANIES]);
  const [deleteId, setDeleteId]       = useState<string | null>(null);
  const [search, setSearch]           = useState("");
  const [sortKey, setSortKey]         = useState<string | null>(null);
  const [sortDir, setSortDir]         = useState<"asc" | "desc">("asc");
  const [visibleCols, setVisibleCols] = useState<Set<string>>(DEFAULT_VISIBLE);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const handleSearchChange = (value: string) => { setSearch(value); setCurrentPage(1); };

  const toggleCol = (key: string) =>
    setVisibleCols((prev) => {
      const n = new Set(prev);
      n.has(key) ? n.delete(key) : n.add(key);
      n.add("actions");
      return n;
    });

  const filtered = companies.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.domain.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0;
    const av = String((a as unknown as Record<string, unknown>)[sortKey] ?? "");
    const bv = String((b as unknown as Record<string, unknown>)[sortKey] ?? "");
    return sortDir === "asc"
      ? av.localeCompare(bv, undefined, { numeric: true })
      : bv.localeCompare(av, undefined, { numeric: true });
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pagedCompanies = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const shownCols = ALL_COLS.filter((c) => visibleCols.has(c.key));

  // ── Cell renderer ─────────────────────────────────────────────────────────────

  const renderCell = (row: Company, col: Column<Company>): ReactNode => {
    switch (col.key) {
      case "name": return (
        <Link href={`/company-management/${row.id}`} className="text-[11px] font-semibold text-[#884D70] hover:underline underline-offset-2">
          {row.name}
        </Link>
      );
      case "domain":  return <span className="text-[11px] text-gray-700 font-mono">{row.domain}</span>;
      case "email":   return <span className="text-[11px] text-gray-700">{row.email}</span>;
      case "phone":   return <span className="text-[11px] text-gray-700 tabular-nums font-mono">{row.phone}</span>;
      case "country": return <span className="text-[11px] text-slate-800 font-medium">{row.country}</span>;
      case "status":  return (
        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLE[row.status]}`}>
          {row.status}
        </span>
      );
      case "actions": return (
        <TableActions
          viewHref={`/company-management/${row.id}`}
          editHref={`/company-management/${row.id}/edit`}
          onDelete={() => setDeleteId(deleteId === row.id ? null : row.id)}
        />
      );
      default: return null;
    }
  };

  // ── Delete confirmation row ───────────────────────────────────────────────────

  const expandedRow = (row: Company, colSpan: number): ReactNode =>
    deleteId !== row.id ? null : (
      <tr className="bg-red-100/50 backdrop-blur-sm">
        <td colSpan={colSpan} className="px-4 py-2.5 border-b border-red-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-red-700 font-medium">
              Delete <strong>{row.name}</strong>? This cannot be undone.
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => { setCompanies((p) => p.filter((c) => c.id !== row.id)); setDeleteId(null); }}
                className="btn-danger"
              >
                Confirm
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="btn-ghost-glass"
              >
                Cancel
              </button>
            </div>
          </div>
        </td>
      </tr>
    );

  // ── Status bar ────────────────────────────────────────────────────────────────

  const statusBar = (
    <>
      <div className="flex items-center gap-4 text-[10px] text-gray-500">
        <span>Count: <strong className="text-gray-700 font-semibold">{filtered.length}</strong></span>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </>
  );

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col antialiased text-slate-800">

      <FloatingNavbar />
      <SecondaryNav />

      <DashboardPageHeader
        title="Company Management"
        breadcrumbs={[
          { label: "Dashboard",          href: "/" },
          { label: "Company Management" },
        ]}
      />

      <main className="flex-1 px-6 pt-4 pb-4">

        {/* ── Controls ── */}
        <div className="flex items-center px-1 pb-2 gap-2">
          <div className="flex-1" />
          <SearchInput value={search} onChange={handleSearchChange} placeholder="Search companies…" />
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

        <ExcelTable
          columns={shownCols}
          data={pagedCompanies}
          rowKey={(row) => row.id}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          renderCell={renderCell}
          rowClassName={(row, i) =>
            deleteId === row.id
              ? "bg-red-100/60"
              : i % 2 === 0
              ? "bg-white/45 hover:bg-white/70"
              : "bg-white/20 hover:bg-white/50"
          }
          expandedRow={expandedRow}
          emptyMessage="No companies found."
          statusBar={statusBar}
          className="card-glass rounded-xl"
          statusBarClassName="table-status-bar-glass"
        />
      </main>

    </div>
  );
}
