"use client";

import { useState } from "react";
import { DashboardPageHeader } from "@/components/layout/PageHeader";
import { StickyFooter } from "@/components/layout/StickyFooter";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ProgressPill } from "@/components/ui/ProgressPill";
import { BranchDetails } from "@/components/branch/BranchDetails";
import { MOCK_BRANCHES } from "@/components/branch/types";
import type { BranchFormData } from "@/components/branch/types";

export type BranchFormProps = {
  mode: "create" | "view" | "edit";
  branchId?: string;
};

const DEFAULT_FORM: BranchFormData = {
  branchName: "",
  organisation: "",
  groupCompany: "",
  email: "",
  contact: "",
  city: "",
  status: "",
};

export function BranchForm({ mode, branchId }: BranchFormProps) {
  const isView   = mode === "view";
  const isEdit   = mode === "edit";
  const isCreate = mode === "create";
  const disabled = isView;

  const initial = branchId ? (MOCK_BRANCHES[branchId] ?? null) : null;
  const [form, setForm] = useState<BranchFormData>({ ...DEFAULT_FORM, ...initial?.form });

  const handleChange = (key: keyof BranchFormData, value: string) =>
    setForm((p) => ({ ...p, [key]: value }));

  const totalFields = Object.keys(form).length;
  const filledCount = Object.values(form).filter(Boolean).length;

  const steps = [
    {
      label: "Branch Details",
      complete: [
        form.branchName,
        form.organisation,
        form.status,
      ].every(Boolean),
    },
  ];

  const title     = isCreate ? "Create Branch" : isView ? "View Branch" : "Edit Branch";
  const lastCrumb = isCreate ? "Create" : isView ? "View" : "Edit";

  return (
    <div className="min-h-screen flex flex-col antialiased text-slate-800 bg-transparent">

      <DashboardPageHeader
        title={title}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Branch",    href: "/branch" },
          { label: lastCrumb },
        ]}
        rightContent={
          isView ? (
            <StatusBadge label="Read Only" color="warning" />
          ) : (
            <div className="flex items-center gap-3">
              <StatusBadge label={isCreate ? "New Branch" : "Editing"} color="info" pulse />
              <ProgressPill steps={steps} />
            </div>
          )
        }
      />

      <main className="flex-1 px-6 py-4 pb-20 space-y-3">
        <BranchDetails
          formData={form}
          onChange={handleChange}
          disabled={disabled}
        />
      </main>

      {isView && (
        <StickyFooter
          actions={
            <>
              <ButtonLink href="/branch" variant="pill-ghost">Back</ButtonLink>
              <ButtonLink href={`/branch/${branchId}/edit`} variant="pill-primary">
                Edit Branch
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
              <ButtonLink href="/branch" variant="pill-ghost">Cancel</ButtonLink>
              <Button variant="pill-primary" icon="check">
                {isCreate ? "Create Branch" : "Update Branch"}
              </Button>
            </>
          }
        />
      )}
    </div>
  );
}
