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
  { title: "Total Admins", value: "24", badge: "+8%",   badgeClassName: "text-emerald-600 bg-emerald-50", accentColor: "#8470ff", subtitle: "All time" },
  { title: "Active",       value: "18", badge: "75%",   badgeClassName: "text-emerald-600 bg-emerald-50", accentColor: "#34d399", subtitle: "Currently active" },
  { title: "Pending",      value: "4",  badge: "17%",   badgeClassName: "text-amber-600 bg-amber-50",     accentColor: "#fbbf24", subtitle: "Awaiting approval" },
  { title: "Inactive",     value: "2",  badge: "8%",    badgeClassName: "text-rose-600 bg-rose-50",       accentColor: "#f87171", subtitle: "Deactivated" },
];

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
  { id: "ADM-001", name: "Ramesh Kumar",   email: "ramesh.kumar@techiebears.com",  phone: "+91 98765 43210", role: "Super Admin",  city: "Mumbai",    state: "Maharashtra", status: "active"   },
  { id: "ADM-002", name: "Priya Sharma",   email: "priya.sharma@techiebears.com",  phone: "+91 91234 56789", role: "Admin",        city: "Pune",       state: "Maharashtra", status: "active"   },
  { id: "ADM-003", name: "Ankit Mehta",    email: "ankit.mehta@techiebears.com",   phone: "+91 87654 32109", role: "Manager",      city: "Ahmedabad",  state: "Gujarat",     status: "pending"  },
  { id: "ADM-004", name: "Sunita Patel",   email: "sunita.patel@techiebears.com",  phone: "+91 99887 76655", role: "Staff",        city: "Surat",      state: "Gujarat",     status: "inactive" },
  { id: "ADM-005", name: "Vikram Singh",   email: "vikram.singh@techiebears.com",  phone: "+91 77665 54433", role: "Admin",        city: "Delhi",      state: "Delhi",       status: "active"   },
  { id: "ADM-006", name: "Meena Iyer",     email: "meena.iyer@techiebears.com",    phone: "+91 88776 65544", role: "Manager",      city: "Bangalore",  state: "Karnataka",   status: "pending"  },
];

const TABS: { label: string; statuses: AdminStatus[] | null }[] = [
  { label: "All",      statuses: null },
  { label: "Active",   statuses: ["active"] },
  { label: "Pending",  statuses: ["pending"] },
  { label: "Inactive", statuses: ["inactive"] },
];

const ALL_COLS: Column[] = [
  { key: "name",   header: "Name",   sortable: true,  align: "left" },
  { key: "email",  header: "Email",  sortable: true,  align: "left" },
  { key: "phone",  header: "Phone",  sortable: false, align: "left" },
  { key: "role",   header: "Role",   sortable: true,  align: "left" },
  { key: "city",   header: "City",   sortable: true,  align: "left" },
  { key: "state",  header: "State",  sortable: true,  align: "left" },
  { key: "status", header: "Status", sortable: true,  align: "center" },
  { key: "actions",header: "Actions",sortable: false, align: "right" },
];

const DEFAULT_VISIBLE = new Set(["name", "email", "phone", "role", "city", "status", "actions"]);

const PAGE_SIZE = 10;

// ── Page ───────────────────────────────────────────────────────────────────────

export default function AdminManagementPage() {
  const [admins, setAdmins]           = useState([...ADMINS]);
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

  const filteredAdmins = [...admins]
    .filter((a) => {
      if (tabStatuses && !tabStatuses.includes(a.status)) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q)
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

  const totalPages = Math.max(1, Math.ceil(filteredAdmins.length / PAGE_SIZE));
  const pagedAdmins = filteredAdmins.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const shownCols = ALL_COLS.filter((c) => visibleCols.has(c.key));

  const toggleCol = (key: string) =>
    setVisibleCols((prev) => {
      const n = new Set(prev);
      n.has(key) ? n.delete(key) : n.add(key);
      n.add("actions");
      return n;
    });

  // ── Cell renderer ─────────────────────────────────────────────────────────────

  const renderCell = (row: Admin, col: Column): ReactNode => {
    switch (col.key) {
      case "name": return (
        <Link
          href={`/admin-management/${row.id}`}
          className="text-[11px] font-semibold text-[#8470ff] hover:underline underline-offset-2"
        >
          {row.name}
        </Link>
      );
      case "email":  return <span className="text-[11px] text-gray-700">{row.email}</span>;
      case "phone":  return <span className="text-[11px] text-gray-700 tabular-nums font-mono">{row.phone}</span>;
      case "role":   return <span className="text-[11px] text-slate-800 font-medium">{row.role}</span>;
      case "city":   return <span className="text-[11px] text-gray-700">{row.city}</span>;
      case "state":  return <span className="text-[11px] text-gray-700">{row.state}</span>;
      case "status": return (
        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLE[row.status]}`}>
          {row.status}
        </span>
      );
      case "actions": return (
        <TableActions
          viewHref={`/admin-management/${row.id}`}
          editHref={`/admin-management/${row.id}/edit`}
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

  const expandedRow = (row: Admin, colSpan: number): ReactNode =>
    deleteId !== row.id ? null : (
      <tr className="bg-red-50">
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
        <span>Count: <strong className="text-gray-700 font-semibold">{filteredAdmins.length}</strong></span>
        <span className="text-gray-300">|</span>
        <span>Active: <strong className="text-emerald-600 font-semibold">{admins.filter((a) => a.status === "active").length}</strong></span>
        <span className="text-gray-300">·</span>
        <span>Pending: <strong className="text-amber-600 font-semibold">{admins.filter((a) => a.status === "pending").length}</strong></span>
        <span className="text-gray-300">·</span>
        <span>Inactive: <strong className="text-rose-600 font-semibold">{admins.filter((a) => a.status === "inactive").length}</strong></span>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </>
  );

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col antialiased text-slate-800 bg-[#eaecf1]">

      <FloatingNavbar />

      <DashboardPageHeader
        title="Admin Management"
        breadcrumbs={[
          { label: "Dashboard",              href: "/" },
          { label: "White Label Management" },
          { label: "Admin Management" },
        ]}
        summary={`${admins.length} total · ${admins.filter((a) => a.status === "pending").length} pending`}
        buttonText="Add Admin"
        buttonHref="/admin-management/create"
      />

      {/* ═══ STAT TILES ═══ */}
      <div className="px-6 pt-4 pb-0 bg-[#eaecf1] grid grid-cols-4 gap-3">
        {STAT_CARDS.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {/* ═══ TABLE SECTION ═══ */}
      <main className="flex-1 px-6 pt-3 pb-4 bg-[#eaecf1]">

        {/* ── Tabs + Controls ── */}
        <div className="flex items-center px-1 pb-2 gap-2">
          <TabBar
            tabs={TABS.map((tab) => ({
              label: tab.label,
              count: tab.statuses
                ? admins.filter((a) => tab.statuses!.includes(a.status)).length
                : admins.length,
            }))}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />

          <div className="flex-1" />

          <SearchInput
            value={search}
            onChange={handleSearchChange}
            placeholder="Search admins…"
          />

          <div className="w-px h-4 bg-gray-300/60 shrink-0" />

          <ColumnSelector
            columns={ALL_COLS.filter((c) => c.key !== "actions")}
            visibleColumns={visibleCols}
            onToggle={toggleCol}
          />

          <button className="flex items-center gap-1.5 text-[11px] font-semibold text-white px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#8470ff] to-[#6366f1] hover:from-[#9480ff] hover:to-[#7375f5] shadow-[0_2px_10px_rgba(132,112,255,0.35)] hover:shadow-[0_4px_16px_rgba(132,112,255,0.5)] transition-all">
            <Icon name="download" size={13} />
            Export
          </button>
        </div>

        {/* ── Table ── */}
        <ExcelTable
          columns={shownCols}
          data={pagedAdmins}
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
          emptyMessage="No admins found."
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
            { label: "View Details", href: `/admin-management/${moreMenuId}` },
            { label: "Edit Admin",   href: `/admin-management/${moreMenuId}/edit` },
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
