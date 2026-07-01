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

// ── Data ───────────────────────────────────────────────────────────────────────

type EmployeeStatus = "active" | "pending" | "inactive";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  city: string;
  status: EmployeeStatus;
}

const STATUS_STYLE: Record<EmployeeStatus, string> = {
  active:   "text-emerald-600 bg-emerald-50",
  pending:  "text-amber-600 bg-amber-50",
  inactive: "text-rose-600 bg-rose-50",
};

const EMPLOYEES: Employee[] = [
  { id: "EMP-001", name: "Arjun Nair",     email: "arjun.nair@techiebears.com",     phone: "+91 98101 11223", department: "Engineering", designation: "Software Engineer",  city: "Bangalore", status: "active"   },
  { id: "EMP-002", name: "Divya Menon",    email: "divya.menon@techiebears.com",     phone: "+91 91223 44556", department: "Design",      designation: "UI/UX Designer",     city: "Chennai",   status: "active"   },
  { id: "EMP-003", name: "Karan Shah",     email: "karan.shah@techiebears.com",      phone: "+91 87334 55667", department: "Finance",     designation: "Accounts Manager",   city: "Ahmedabad", status: "pending"  },
  { id: "EMP-004", name: "Sneha Reddy",    email: "sneha.reddy@techiebears.com",     phone: "+91 99445 66778", department: "HR",          designation: "HR Executive",       city: "Hyderabad", status: "active"   },
  { id: "EMP-005", name: "Rohit Verma",    email: "rohit.verma@techiebears.com",     phone: "+91 77556 77889", department: "Operations",  designation: "Operations Lead",    city: "Delhi",     status: "inactive" },
  { id: "EMP-006", name: "Pooja Desai",    email: "pooja.desai@techiebears.com",     phone: "+91 88667 88990", department: "Engineering", designation: "Backend Developer",  city: "Pune",      status: "active"   },
  { id: "EMP-007", name: "Amit Joshi",     email: "amit.joshi@techiebears.com",      phone: "+91 92778 99001", department: "Sales",       designation: "Sales Executive",    city: "Mumbai",    status: "pending"  },
  { id: "EMP-008", name: "Lakshmi Pillai", email: "lakshmi.pillai@techiebears.com",  phone: "+91 96889 00112", department: "Design",      designation: "Graphic Designer",   city: "Kochi",     status: "active"   },
  { id: "EMP-009", name: "Nikhil Gupta",   email: "nikhil.gupta@techiebears.com",    phone: "+91 94990 11223", department: "Finance",     designation: "Financial Analyst",  city: "Jaipur",    status: "inactive" },
  { id: "EMP-010", name: "Ritu Agarwal",   email: "ritu.agarwal@techiebears.com",    phone: "+91 93001 22334", department: "HR",          designation: "Talent Acquisition", city: "Lucknow",   status: "active"   },
];

const PAGE_SIZE = 5;

const ALL_COLS: Column<Employee>[] = [
  { key: "id",          header: "Employee ID",  sortable: true,  align: "left"   },
  { key: "name",        header: "Name",         sortable: true,  align: "left"   },
  { key: "email",       header: "Email",        sortable: true,  align: "left"   },
  { key: "phone",       header: "Phone",        sortable: false, align: "left"   },
  { key: "department",  header: "Department",   sortable: true,  align: "left"   },
  { key: "designation", header: "Designation",  sortable: true,  align: "left"   },
  { key: "city",        header: "City",         sortable: true,  align: "left"   },
  { key: "status",      header: "Status",       sortable: true,  align: "center" },
  { key: "actions",     header: "Actions",      sortable: false, align: "right"  },
];

const DEFAULT_VISIBLE = new Set(["id", "name", "email", "phone", "department", "designation", "city", "status", "actions"]);

// ── Page ───────────────────────────────────────────────────────────────────────

export default function EmployeeManagementPage() {
  const [employees, setEmployees] = useState([...EMPLOYEES]);
  const [deleteId, setDeleteId]   = useState<string | null>(null);
  const [search, setSearch]       = useState("");
  const [activeTab, setActiveTab] = useState(0);
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

  // ── Filtered + sorted ─────────────────────────────────────────────────────────

  const bySearch = employees.filter((e) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      e.name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q) ||
      e.designation.toLowerCase().includes(q) ||
      e.city.toLowerCase().includes(q)
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

  const TAB_FILTERS: (EmployeeStatus[] | null)[] = [null, ["active"], ["inactive"]];
  const tabData = TAB_FILTERS.map((f) =>
    f ? sorted.filter((e) => f.includes(e.status)) : sorted
  );

  // ── Column renderers ──────────────────────────────────────────────────────────

  const cols: Column<Employee>[] = ALL_COLS
    .filter((c) => visibleCols.has(c.key))
    .map((col) => {
      switch (col.key) {
        case "id": return {
          ...col,
          cell: (row: Employee): ReactNode => (
            <span className="text-[11px] font-mono text-gray-500 tabular-nums">{row.id}</span>
          ),
        };
        case "name": return {
          ...col,
          cell: (row: Employee): ReactNode => (
            <Link href={`/employee-management/${row.id}`} className="text-[11px] font-semibold text-[#884D70] hover:underline underline-offset-2">
              {row.name}
            </Link>
          ),
        };
        case "email":       return { ...col, cell: (row: Employee): ReactNode => <span className="text-[11px] text-gray-700">{row.email}</span> };
        case "phone":       return { ...col, cell: (row: Employee): ReactNode => <span className="text-[11px] text-gray-700 tabular-nums font-mono">{row.phone}</span> };
        case "department":  return { ...col, cell: (row: Employee): ReactNode => <span className="text-[11px] text-slate-800 font-medium">{row.department}</span> };
        case "designation": return { ...col, cell: (row: Employee): ReactNode => <span className="text-[11px] text-gray-700">{row.designation}</span> };
        case "city":        return { ...col, cell: (row: Employee): ReactNode => <span className="text-[11px] text-gray-700">{row.city}</span> };
        case "status": return {
          ...col,
          cell: (row: Employee): ReactNode => (
            <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLE[row.status]}`}>
              {row.status}
            </span>
          ),
        };
        case "actions": return {
          ...col,
          cell: (row: Employee): ReactNode => (
            <TableActions
              viewHref={`/employee-management/${row.id}`}
              editHref={`/employee-management/${row.id}/edit`}
              onDelete={() => setDeleteId(deleteId === row.id ? null : row.id)}
            />
          ),
        };
        default: return col;
      }
    });

  // ── Delete confirmation row ───────────────────────────────────────────────────

  const expandedRow = (row: Employee, colSpan: number): ReactNode =>
    deleteId !== row.id ? null : (
      <tr className="bg-red-100/50 backdrop-blur-sm">
        <td colSpan={colSpan} className="px-4 py-2.5 border-b border-red-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-red-700 font-medium">
              Delete <strong>{row.name}</strong>? This cannot be undone.
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => { setEmployees((p) => p.filter((e) => e.id !== row.id)); setDeleteId(null); }}
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
        rowKey:    (row) => (row as Employee).id,
        sortKey,
        sortDir,
        onSort:    handleSort,
        rowClassName: (row, idx) => {
          const e = row as Employee;
          return deleteId === e.id
            ? "bg-red-100/60"
            : idx % 2 === 0
            ? "bg-white/45 hover:bg-white/70"
            : "bg-white/20 hover:bg-white/50";
        },
        expandedRow: (row, colSpan) => expandedRow(row as Employee, colSpan),
        emptyMessage: `No ${label.toLowerCase()} employees found.`,
        statusBar: (
          <>
            <div className="flex items-center gap-4 text-[10px] text-gray-500">
              <span>Count: <strong className="text-gray-700 font-semibold">{data.length}</strong></span>
              {i === 0 && (
                <>
                  <span className="text-gray-300">|</span>
                  <span>Active: <strong className="text-emerald-600 font-semibold">{employees.filter((e) => e.status === "active").length}</strong></span>
                  <span className="text-gray-300">·</span>
                  <span>Inactive: <strong className="text-rose-600 font-semibold">{employees.filter((e) => e.status === "inactive").length}</strong></span>
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
        title="Employee Management"
        breadcrumbs={[
          { label: "Dashboard",           href: "/" },
          { label: "Employee Management" },
        ]}
        summary={`${employees.length} total`}
        buttonText="Create Employee"
        buttonHref="/employee-management/create"
      />

      <main className="flex-1 px-6 pt-4 pb-4">
        <div className="flex items-center px-1 pb-2 gap-2">
          <div className="flex-1" />
          <SearchInput value={search} onChange={handleSearchChange} placeholder="Search employees…" />
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
          onChange={(i) => { setActiveTab(i); setCurrentPage(1); }}
        />
      </main>
    </div>
  );
}
