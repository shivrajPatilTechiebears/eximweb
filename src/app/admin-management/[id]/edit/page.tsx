"use client";

import { use } from "react";
import { AdminForm } from "@/components/form/AdminForm";

export default function EditAdminPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <AdminForm mode="edit" adminId={id} />;
}
