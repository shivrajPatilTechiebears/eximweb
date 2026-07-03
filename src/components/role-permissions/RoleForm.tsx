"use client";

import { useState } from "react";
import { Breadcrumbs } from "@/components/layout/PageHeader";
import { StickyFooter } from "@/components/layout/StickyFooter";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { FormInput } from "@/components/ui/FormInput";
import { PermissionMatrix } from "@/components/ui/PermissionMatrix";
import { MOCK_ROLES, STATUS_STYLE } from "./types";
import type { RoleFormData } from "./types";

export type RoleFormProps = {
  mode: "create" | "view" | "edit";
  roleId?: string;
};

const DEFAULT_FORM: RoleFormData = { roleName: "", description: "" };

export function RoleForm({ mode, roleId }: RoleFormProps) {
  const isCreate = mode === "create";
  const isView   = mode === "view";
  const disabled = isView;

  const record = roleId ? MOCK_ROLES[roleId] : undefined;

  const [form, setForm] = useState<RoleFormData>({
    ...DEFAULT_FORM,
    roleName: record?.roleName ?? "",
    description: record?.description ?? "",
  });
  const [totalActive, setTotalActive] = useState(0);

  const handleChange = (key: keyof RoleFormData, value: string) =>
    setForm((p) => ({ ...p, [key]: value }));

  const lastCrumb = isCreate ? "Create" : isView ? "View" : "Edit";
  const statusInfo = record ? STATUS_STYLE[record.status] : undefined;

  return (
    <div className="flex-1 flex flex-col antialiased text-slate-800 bg-transparent">

      <main className="flex-1 px-6 py-4 pb-24 space-y-3">

        <div className="flex items-center px-1 pb-2 gap-2">
          <Breadcrumbs items={[
            { label: "Dashboard",          href: "/" },
            { label: "Role & Permissions", href: "/role-permissions" },
            { label: lastCrumb },
          ]} />
          <div className="flex-1" />
          {isView && statusInfo && (
            <>
              <StatusBadge label={statusInfo.label} color={statusInfo.color} />
              <div className="w-px h-4 bg-gray-200" />
              <ButtonLink href={`/role-permissions/${roleId}/edit`} variant="pill-primary">Edit Role</ButtonLink>
            </>
          )}
        </div>

        {/* ── Role Details ── */}
        <Card className="card-glass rounded-xl">
          <CardHeader title="Role Details" hint={disabled ? undefined : "Tab · Enter to move between fields"} />
          <div className="px-5 py-4 grid grid-cols-2 gap-4 max-w-2xl">
            <FormInput
              disabled={disabled}
              label="Role Name"
              placeholder="e.g. Super Admin"
              value={form.roleName}
              onChange={(v) => handleChange("roleName", v)}
            />
            <FormInput
              disabled={disabled}
              label="Description"
              placeholder="Brief description of this role"
              value={form.description}
              onChange={(v) => handleChange("description", v)}
            />
          </div>
        </Card>

        {/* ── Permission Matrix ── */}
        <PermissionMatrix
          disabled={disabled}
          initialState={record?.permissions}
          onChange={(count) => setTotalActive(count)}
        />
      </main>

      {isView ? (
        <StickyFooter
          stats={[{ label: "Permissions selected", value: String(totalActive) }]}
          actions={
            <>
              <ButtonLink href="/role-permissions" variant="pill-ghost">Back</ButtonLink>
              <ButtonLink href={`/role-permissions/${roleId}/edit`} variant="cta-sunset">Edit Role</ButtonLink>
            </>
          }
        />
      ) : (
        <StickyFooter
          stats={[{ label: "Permissions selected", value: String(totalActive) }]}
          actions={
            <>
              <ButtonLink href="/role-permissions" variant="cta-ghost">Cancel</ButtonLink>
              <Button variant="cta-sunset" icon="check">
                {isCreate ? "Create Role" : "Update Role"}
              </Button>
            </>
          }
        />
      )}
    </div>
  );
}
