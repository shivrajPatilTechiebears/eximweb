import { AdminForm } from "@/components/form/AdminForm";

export default async function EditAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminForm mode="edit" adminId={id} />;
}
