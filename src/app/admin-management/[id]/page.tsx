"use client";

import { use } from "react";
import { AdminForm } from "@/components/form/AdminForm";

export default function ViewAdminPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <AdminForm mode="view" adminId={id} />;
}
