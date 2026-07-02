"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/layout/PageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { ExcelTable, type Column } from "@/components/table/DataTable";
import { TableActions } from "@/components/table/TableActions";
import { ColumnSelector } from "@/components/ui/ColumnSelector";
import { Pagination } from "@/components/ui/Pagination";

// ── Data ───────────────────────────────────────────────────────────────────────

type RoleStatus = "active" | "inactive";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  status: RoleStatus;
}

const STATUS_STYLE: Record<RoleStatus, string> = {
  active:   "text-emerald-600 bg-emerald-50",
  inactive: "text-rose-600 bg-rose-50",
};

const ROLES: Role[] = [
  { id: "ROLE-001", name: "Super Admin",    description: "Full system access with all permissions",        permissions: ["Partner Mgmt", "API Mgmt", "Employee Mgmt", "Reports"], status: "active"   },
  { id: "ROLE-002", name: "Admin",          description: "Manage admins, companies and employees",           permissions: ["Employee Mgmt", "Reports"],                               status: "active"   },
  { id: "ROLE-003", name: "Manager",        description: "Oversee operations and access reports",            permissions: ["Reports", "API Mgmt"],                                    status: "active"   },
  { id: "ROLE-004", name: "Staff",          description: "Basic access for day-to-day tasks",                permissions: ["Reports"],                                                status: "active"   },
  { id: "ROLE-005", name: "Read Only",      description: "View-only access across all modules",              permissions: ["Reports"],                                                status: "inactive" },
  { id: "ROLE-006", name: "Partner Access", description: "Limited access for partner integrations",          permissions: ["Partner Mgmt", "API Mgmt"],                               status: "inactive" },
];

const PAGE_SIZE = 10;

const ALL_COLS: Column<Role>[] = [
  { key: "name",           header: "Role Name",       sortable: true,  align: "left"   },
  { key: "description",    header: "Description",     sortable: false, align: "left"   },
  { key: "permissions",    header: "Permissions",     sortable: false, align: "left"   },
  { key: "status",         header: "Status",          sortable: true,  align: "center" },
  { key: "actions",        header: "Actions",         sortable: false, align: "right"  },
];

const DEFAULT_VISIBLE = new Set(["name", "description", "permissions", "status", "actions"]);

// ── Page ───────────────────────────────────────────────────────────────────────

export default function RolePermissionsPage() {
  const [roles, setRoles]             = useState([...ROLES]);
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

  const filtered = roles.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
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
  const pagedRoles = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const shownCols  = ALL_COLS.filter((c) => visibleCols.has(c.key));

  // ── Cell renderer ─────────────────────────────────────────────────────────────

  const renderCell = (row: Role, col: Column<Role>): ReactNode => {
    switch (col.key) {
      case "name": return (
        <Link href={`/role-permissions/${row.id}`} className="text-[11px] font-semibold text-[#884D70] hover:underline underline-offset-2">
          {row.name}
        </Link>
      );
      case "description": return (
        <span className="text-[11px] text-gray-500">{row.description}</span>
      );
      case "permissions": return (
        <div className="flex flex-wrap gap-1">
          {row.permissions.map((p) => (
            <span key={p} className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-[#884D70]/10 text-[#884D70]">
              {p}
            </span>
          ))}
        </div>
      );
      case "status": return (
        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLE[row.status]}`}>
          {row.status}
        </span>
      );
      case "actions": return (
        <TableActions
          viewHref={`/role-permissions/${row.id}`}
          editHref={`/role-permissions/${row.id}/edit`}
          onDelete={() => setDeleteId(deleteId === row.id ? null : row.id)}
        />
      );
      default: return null;
    }
  };

  // ── Delete confirmation row ───────────────────────────────────────────────────

  const expandedRow = (row: Role, colSpan: number): ReactNode =>
    deleteId !== row.id ? null : (
      <tr className="bg-red-100/50 backdrop-blur-sm">
        <td colSpan={colSpan} className="px-4 py-2.5 border-b border-red-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-red-700 font-medium">
              Delete <strong>{row.name}</strong>? This cannot be undone.
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => { setRoles((p) => p.filter((r) => r.id !== row.id)); setDeleteId(null); }}
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
        <span className="text-gray-300">|</span>
        <span>Active: <strong className="text-emerald-600 font-semibold">{roles.filter((r) => r.status === "active").length}</strong></span>
        <span className="text-gray-300">·</span>
        <span>Inactive: <strong className="text-rose-600 font-semibold">{roles.filter((r) => r.status === "inactive").length}</strong></span>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </>
  );

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="flex-1 flex flex-col antialiased text-slate-800">


      <main className="flex-1 px-6 pt-4 pb-4">

        {/* Controls row */}
        <div className="flex items-center px-1 pb-2 gap-2">
          <Breadcrumbs items={[{ label: "Dashboard", href: "/" }, { label: "Role & Permissions" }]} />
          <div className="flex-1" />
          <SearchInput value={search} onChange={handleSearchChange} placeholder="Search roles…" />
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
          <Link href="/role-permissions/create">
            <Button variant="cta-sunset" icon="add">Create Role</Button>
          </Link>
        </div>

        <ExcelTable
          columns={shownCols}
          data={pagedRoles}
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
          emptyMessage="No roles found."
          statusBar={statusBar}
          className="card-glass rounded-xl"
          statusBarClassName="table-status-bar-glass"
        />
      </main>

    </div>
  );
}
