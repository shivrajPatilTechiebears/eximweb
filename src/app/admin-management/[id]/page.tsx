import { AdminForm } from "@/components/form/AdminForm";

export default async function ViewAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminForm mode="view" adminId={id} />;
}
