"use client";

import Link from "next/link";
import { FloatingNavbar } from "@/components/layout/FloatingNavbar";
import { DashboardPageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AdminForm } from "@/components/forms/AdminForm";

export default function CreateAdminPage() {
  return (
    <div className="min-h-screen flex flex-col antialiased text-slate-800 bg-[#eaecf1]">

      <FloatingNavbar />

      <DashboardPageHeader
        title="Add Admin"
        breadcrumbs={[
          { label: "Dashboard",              href: "/" },
          { label: "White Label Management" },
          { label: "Admin Management",       href: "/admin-management" },
          { label: "Add Admin" },
        ]}
        rightContent={<StatusBadge label="New Admin" color="info" />}
      />

      <main className="flex-1 px-6 py-4 pb-20 bg-[#eaecf1]">
        <AdminForm mode="create" />
      </main>

      {/* ═══ STICKY FOOTER ═══ */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-sm border-t border-gray-200 px-10 py-2.5 flex items-center justify-between">
        <span className="text-[11px] text-gray-400">Fill in all required fields before saving.</span>
        <div className="flex items-center gap-2">
          <Link href="/admin-management">
            <button className="text-[12px] font-medium text-gray-500 px-4 py-1.5 hover:bg-gray-100 rounded-full transition-colors">
              Cancel
            </button>
          </Link>
          <button className="text-[12px] font-medium text-gray-600 px-4 py-1.5 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
            Save as Draft
          </button>
          <button className="flex items-center gap-1.5 px-4 py-1.5 bg-[#8470ff] text-white text-[12px] font-semibold rounded-full hover:bg-[#7360ef] transition-colors shadow-md">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </svg>
            Save Admin
          </button>
        </div>
      </div>

    </div>
  );
}
