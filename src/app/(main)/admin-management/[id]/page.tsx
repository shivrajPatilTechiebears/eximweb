import { AdminManagementForm } from "@/components/admin-management/AdminManagementForm";

export default async function ViewAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminManagementForm mode="view" adminId={id} />;
}
