import { AdminManagementForm } from "@/components/admin-management/AdminManagementForm";

export default async function EditAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminManagementForm mode="edit" adminId={id} />;
}
