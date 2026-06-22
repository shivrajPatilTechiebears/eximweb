"use client";

import { use } from "react";
import { CompanyForm } from "@/components/form/CompanyForm";

export default function EditCompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <CompanyForm mode="edit" companyId={id} />;
}
