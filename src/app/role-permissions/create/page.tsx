"use client";

import { useState } from "react";
import { FloatingNavbar } from "@/components/layout/FloatingNavbar";
import { SecondaryNav } from "@/components/layout/SecondaryNav";
import { DashboardPageHeader } from "@/components/layout/PageHeader";
import { StickyFooter } from "@/components/layout/StickyFooter";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/ui/Icon";
import { PermissionMatrix } from "@/components/ui/PermissionMatrix";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { FormInput } from "@/components/ui/FormInput";

export default function CreateRolePage() {
  const [totalActive, setTotalActive]   = useState(0);
  const [roleName, setRoleName]         = useState("");
  const [description, setDescription]  = useState("");

  return (
    <div className="min-h-screen flex flex-col antialiased text-slate-800 bg-transparent">
      <FloatingNavbar />
      <SecondaryNav />

      <DashboardPageHeader
        title="Create Role"
        breadcrumbs={[
          { label: "Dashboard",          href: "/"                 },
          { label: "Role & Permissions", href: "/role-permissions" },
          { label: "Create"                                        },
        ]}
      />

      <main className="flex-1 px-6 py-4 pb-24 space-y-3">

        {/* Role details */}
        <Card className="bg-white/50 backdrop-blur-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.06)] rounded-xl">
          <CardHeader title="Role Details" hint="Tab · Enter to move between fields" />
          <div className="px-5 py-4 grid grid-cols-2 gap-4 max-w-2xl">
            <FormInput
              label="Role Name"
              placeholder="e.g. Super Admin"
              value={roleName}
              onChange={setRoleName}
            />
            <FormInput
              label="Description"
              placeholder="Brief description of this role"
              value={description}
              onChange={setDescription}
            />
          </div>
        </Card>

        <PermissionMatrix onChange={(count) => setTotalActive(count)} />
      </main>

      <StickyFooter
        stats={[{ label: "Permissions selected", value: String(totalActive) }]}
        actions={
          <>
            <ButtonLink href="/role-permissions" variant="pill-ghost">Cancel</ButtonLink>
            <button className="flex items-center gap-1.5 text-[12px] font-semibold text-white px-5 py-2 rounded-full bg-gradient-to-r from-[#884D70] to-[#6B3A5A] hover:from-[#9E6080] hover:to-[#9E6080] shadow-[0_2px_10px_rgba(136,77,112,0.35)] hover:shadow-[0_4px_16px_rgba(136,77,112,0.5)] transition-all">
              <Icon name="check" size={14} />
              Create Role
            </button>
          </>
        }
      />
    </div>
  );
}
