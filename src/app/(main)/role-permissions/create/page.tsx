"use client";

import { useState } from "react";
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
        <Card className="card-glass rounded-xl">
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
            <ButtonLink href="/role-permissions" variant="cta-ghost">Cancel</ButtonLink>
            <button className="btn-brand-pill">
              <Icon name="check" size={14} />
              Create Role
            </button>
          </>
        }
      />
    </div>
  );
}
