"use client";

import { useState } from "react";
import { FloatingNavbar } from "@/components/layout/FloatingNavbar";
import { SecondaryNav } from "@/components/layout/SecondaryNav";
import { DashboardPageHeader } from "@/components/layout/PageHeader";
import { StickyFooter } from "@/components/layout/StickyFooter";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ProgressPill } from "@/components/ui/ProgressPill";
import { GroupCompanyDetails } from "@/components/group-company/GroupCompanyDetails";
import { MOCK_GROUP_COMPANIES } from "@/components/group-company/types";
import type { GroupCompanyFormData } from "@/components/group-company/types";

export type GroupCompanyFormProps = {
  mode: "create" | "view" | "edit";
  groupCompanyId?: string;
};

const DEFAULT_FORM: GroupCompanyFormData = {
  groupCompanyName: "",
  organisation: "",
  email: "",
  contact: "",
  city: "",
  description: "",
  status: "",
};

export function GroupCompanyForm({ mode, groupCompanyId }: GroupCompanyFormProps) {
  const isView   = mode === "view";
  const isEdit   = mode === "edit";
  const isCreate = mode === "create";
  const disabled = isView;

  const initial = groupCompanyId ? (MOCK_GROUP_COMPANIES[groupCompanyId] ?? null) : null;
  const [form, setForm] = useState<GroupCompanyFormData>({ ...DEFAULT_FORM, ...initial?.form });

  const handleChange = (key: keyof GroupCompanyFormData, value: string) =>
    setForm((p) => ({ ...p, [key]: value }));

  const totalFields = Object.keys(form).length;
  const filledCount = Object.values(form).filter(Boolean).length;

  const steps = [
    {
      label: "Group Details",
      complete: [
        form.groupCompanyName,
        form.organisation,
        form.status,
      ].every(Boolean),
    },
  ];

  const title     = isCreate ? "Create Group Company" : isView ? "View Group Company" : "Edit Group Company";
  const lastCrumb = isCreate ? "Create" : isView ? "View" : "Edit";

  return (
    <div className="min-h-screen flex flex-col antialiased text-slate-800 bg-transparent">
      <FloatingNavbar />
      <SecondaryNav />

      <DashboardPageHeader
        title={title}
        breadcrumbs={[
          { label: "Dashboard",       href: "/" },
          { label: "Group of Company", href: "/group-company" },
          { label: lastCrumb },
        ]}
        rightContent={
          isView ? (
            <StatusBadge label="Read Only" color="warning" />
          ) : (
            <div className="flex items-center gap-3">
              <StatusBadge label={isCreate ? "New Group Company" : "Editing"} color="info" pulse />
              <ProgressPill steps={steps} />
            </div>
          )
        }
      />

      <main className="flex-1 px-6 py-4 pb-20 space-y-3">
        <GroupCompanyDetails
          formData={form}
          onChange={handleChange}
          disabled={disabled}
          isView={isView}
        />
      </main>

      {isView && (
        <StickyFooter
          actions={
            <>
              <ButtonLink href="/group-company" variant="pill-ghost">Back</ButtonLink>
              <ButtonLink href={`/group-company/${groupCompanyId}/edit`} variant="pill-primary">
                Edit Group Company
              </ButtonLink>
            </>
          }
        />
      )}

      {(isCreate || isEdit) && (
        <StickyFooter
          stats={[{ label: "Fields filled", value: `${filledCount} / ${totalFields}` }]}
          actions={
            <>
              <ButtonLink href="/group-company" variant="pill-ghost">Cancel</ButtonLink>
              <Button variant="pill-primary" icon="check">
                {isCreate ? "Create Group Company" : "Update Group Company"}
              </Button>
            </>
          }
        />
      )}
    </div>
  );
}
