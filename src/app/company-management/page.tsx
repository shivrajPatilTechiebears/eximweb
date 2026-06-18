"use client";

import { useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { FloatingNavbar } from "@/components/layout/FloatingNavbar";
import { DashboardPageHeader } from "@/components/layout/PageHeader";
import StatCard from "@/components/cards/StatCard";
import { TabBar } from "@/components/ui/Tabs";
import { SearchInput } from "@/components/ui/SearchInput";
import { ExcelTable, type Column } from "@/components/table/DataTable";
import { TableActions } from "@/components/table/TableActions";
import { ColumnSelector } from "@/components/ui/ColumnSelector";
import { Pagination } from "@/components/ui/Pagination";

// ── Data ───────────────────────────────────────────────────────────────────────

const STAT_CARDS = [
  { title: "Total Companies", value: "12", badge: "+15%", badgeClassName: "text-emerald-600 bg-emerald-50", accentColor: "#884D70", subtitle: "All time" },
  { title: "Active",          value: "8",  badge: "67%",  badgeClassName: "text-emerald-600 bg-emerald-50", accentColor: "#34d399", subtitle: "Currently active" },
  { title: "Pending",         value: "3",  badge: "25%",  badgeClassName: "text-amber-600 bg-amber-50",     accentColor: "#fbbf24", subtitle: "Awaiting approval" },
  { title: "Inactive",        value: "1",  badge: "8%",   badgeClassName: "text-rose-600 bg-rose-50",       accentColor: "#f87171", subtitle: "Deactivated" },
];

type CompanyStatus = "active" | "pending" | "inactive";

interface Company {
  id: string; name: string; domain: string; email: string;
  phone: string; state: string; country: string; status: CompanyStatus;
}

const STATUS_STYLE: Record<CompanyStatus, string> = {
  active:   "text-emerald-600 bg-emerald-50",
  pending:  "text-amber-600 bg-amber-50",
  inactive: "text-rose-600 bg-rose-50",
};

const COMPANIES: Company[] = [
  { id: "COMP-001", name: "TechCorp Solutions",  domain: "techcorp.com",    email: "admin@techcorp.com",    phone: "+91 98765 43210", state: "Maharashtra", country: "India",         status: "active"   },
  { id: "COMP-002", name: "InnoSoft Pvt Ltd",    domain: "innosoft.in",     email: "contact@innosoft.in",   phone: "+91 91234 56789", state: "Gujarat",     country: "India",         status: "active"   },
  { id: "COMP-003", name: "GlobalEdge Inc",      domain: "globaledge.io",   email: "info@globaledge.io",    phone: "+1 555 234 5678", state: "Karnataka",   country: "United States", status: "pending"  },
  { id: "COMP-004", name: "Apex Systems",        domain: "apexsys.com",     email: "hello@apexsys.com",     phone: "+91 88776 65544", state: "Delhi",       country: "India",         status: "inactive" },
  { id: "COMP-005", name: "BlueStar Logistics",  domain: "bluestar.net",    email: "ops@bluestar.net",      phone: "+91 77665 54433", state: "Tamil Nadu",  country: "India",         status: "active"   },
  { id: "COMP-006", name: "Nexus Digital",       domain: "nexusdigital.co", email: "nexus@nexusdigital.co", phone: "+91 99001 12233", state: "Maharashtra", country: "India",         status: "pending"  },
];

const TABS: { label: string; statuses: CompanyStatus[] | null }[] = [
  { label: "All",      statuses: null },
  { label: "Active",   statuses: ["active"] },
  { label: "Pending",  statuses: ["pending"] },
  { label: "Inactive", statuses: ["inactive"] },
];

const ALL_COLS: Column[] = [
  { key: "name",    header: "Company Name", sortable: true,  align: "left" },
  { key: "domain",  header: "Domain",       sortable: true,  align: "left" },
  { key: "email",   header: "Email",        sortable: true,  align: "left" },
  { key: "phone",   header: "Phone",        sortable: false, align: "left" },
  { key: "state",   header: "State",        sortable: true,  align: "left" },
  { key: "country", header: "Country",      sortable: true,  align: "left" },
  { key: "status",  header: "Status",       sortable: true,  align: "center" },
  { key: "actions", header: "Actions",      sortable: false, align: "right" },
];

const DEFAULT_VISIBLE = new Set(["name", "domain", "email", "phone", "country", "status", "actions"]);

const PAGE_SIZE = 10;

// ── Page ───────────────────────────────────────────────────────────────────────

export default function CompanyManagementPage() {
  const [companies, setCompanies]     = useState([...COMPANIES]);
  const [deleteId, setDeleteId]       = useState<string | null>(null);
  const [moreMenuId, setMoreMenuId]   = useState<string | null>(null);
  const [moreMenuPos, setMoreMenuPos] = useState<{ top: number; left: number } | null>(null);
  const [search, setSearch]           = useState("");
  const [activeTab, setActiveTab]     = useState(0);
  const [sortKey, setSortKey]         = useState<string | null>(null);
  const [sortDir, setSortDir]         = useState<"asc" | "desc">("asc");
  const [visibleCols, setVisibleCols] = useState<Set<string>>(DEFAULT_VISIBLE);
  const [currentPage, setCurrentPage] = useState(1);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setMoreMenuId(null);
        setMoreMenuPos(null);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const handleTabChange = (tab: number) => { setActiveTab(tab); setCurrentPage(1); };
  const handleSearchChange = (value: string) => { setSearch(value); setCurrentPage(1); };

  const tabStatuses = TABS[activeTab].statuses;

  const filtered = [...companies]
    .filter((c) => {
      if (tabStatuses && !tabStatuses.includes(c.status)) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.domain.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (!sortKey) return 0;
      const av = String((a as unknown as Record<string, unknown>)[sortKey] ?? "");
      const bv = String((b as unknown as Record<string, unknown>)[sortKey] ?? "");
      return sortDir === "asc"
        ? av.localeCompare(bv, undefined, { numeric: true })
        : bv.localeCompare(av, undefined, { numeric: true });
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pagedCompanies = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const shownCols = ALL_COLS.filter((c) => visibleCols.has(c.key));

  const toggleCol = (key: string) =>
    setVisibleCols((prev) => {
      const n = new Set(prev);
      n.has(key) ? n.delete(key) : n.add(key);
      n.add("actions");
      return n;
    });

  // ── Cell renderer ─────────────────────────────────────────────────────────────

  const renderCell = (row: Company, col: Column): ReactNode => {
    switch (col.key) {
      case "name": return (
        <Link
          href={`/company-management/${row.id}`}
          className="text-[11px] font-semibold text-[#884D70] hover:underline underline-offset-2"
        >
          {row.name}
        </Link>
      );
      case "domain":  return <span className="text-[11px] text-gray-700 font-mono">{row.domain}</span>;
      case "email":   return <span className="text-[11px] text-gray-700">{row.email}</span>;
      case "phone":   return <span className="text-[11px] text-gray-700 tabular-nums font-mono">{row.phone}</span>;
      case "state":   return <span className="text-[11px] text-gray-700">{row.state}</span>;
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
          onMore={(e) => {
            e.stopPropagation();
            if (moreMenuId === row.id) { setMoreMenuId(null); setMoreMenuPos(null); }
            else {
              const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
              setMoreMenuPos({ top: rect.bottom + 4, left: rect.right - 160 });
              setMoreMenuId(row.id);
            }
          }}
        />
      );
      default: return null;
    }
  };

  // ── Delete confirmation row ───────────────────────────────────────────────────

  const expandedRow = (row: Company, colSpan: number): ReactNode =>
    deleteId !== row.id ? null : (
      <tr className="bg-red-50">
        <td colSpan={colSpan} className="px-4 py-2.5 border-b border-red-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-red-700 font-medium">
              Delete <strong>{row.name}</strong>? This cannot be undone.
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => { setCompanies((p) => p.filter((c) => c.id !== row.id)); setDeleteId(null); }}
                className="px-3 py-1 bg-red-500 text-white text-[10px] font-semibold rounded-lg hover:bg-red-600 transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="px-3 py-1 bg-white text-gray-700 text-[10px] font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
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
        <span className="text-gray-300">|</span>
        <span>Active: <strong className="text-emerald-600 font-semibold">{companies.filter((c) => c.status === "active").length}</strong></span>
        <span className="text-gray-300">·</span>
        <span>Pending: <strong className="text-amber-600 font-semibold">{companies.filter((c) => c.status === "pending").length}</strong></span>
        <span className="text-gray-300">·</span>
        <span>Inactive: <strong className="text-rose-600 font-semibold">{companies.filter((c) => c.status === "inactive").length}</strong></span>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </>
  );

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col antialiased text-slate-800">

      <FloatingNavbar />

      <DashboardPageHeader
        title="Company Management"
        breadcrumbs={[
          { label: "Dashboard",              href: "/" },
          { label: "White Label Management" },
          { label: "Company Management" },
        ]}
        summary={`${companies.length} total · ${companies.filter((c) => c.status === "pending").length} pending`}
        buttonText="Add Company"
        buttonHref="/company-management/create"
      />

      {/* ═══ STAT TILES ═══ */}
      <div className="px-6 pt-4 pb-0 grid grid-cols-4 gap-3">
        {STAT_CARDS.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {/* ═══ TABLE SECTION ═══ */}
      <main className="flex-1 px-6 pt-3 pb-4">

        <div className="flex items-center px-1 pb-2 gap-2">
          <TabBar
            tabs={TABS.map((tab) => ({
              label: tab.label,
              count: tab.statuses
                ? companies.filter((c) => tab.statuses!.includes(c.status)).length
                : companies.length,
            }))}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />

          <div className="flex-1" />

          <SearchInput
            value={search}
            onChange={handleSearchChange}
            placeholder="Search companies…"
          />

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
              ? "bg-red-50"
              : i % 2 === 0
              ? "bg-white hover:bg-[#eef3fe]"
              : "bg-[#f2f4f8] hover:bg-[#eef3fe]"
          }
          expandedRow={expandedRow}
          emptyMessage="No companies found."
          statusBar={statusBar}
        />

      </main>

      {/* ═══ MORE MENU ═══ */}
      {moreMenuId && moreMenuPos && (
        <div
          ref={moreMenuRef}
          style={{ position: "fixed", top: moreMenuPos.top, left: moreMenuPos.left, zIndex: 9999 }}
          className="bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 py-1 w-40"
        >
          {[
            { label: "View Details", href: `/company-management/${moreMenuId}` },
            { label: "Edit Company", href: `/company-management/${moreMenuId}/edit` },
            { label: "Export PDF",   href: "#" },
          ].map((item) => (
            <Link key={item.label} href={item.href}>
              <button
                onClick={() => { setMoreMenuId(null); setMoreMenuPos(null); }}
                className="w-full text-left px-4 py-2 text-[11px] text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {item.label}
              </button>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
}
