import { RoleForm } from "@/components/role-permissions/RoleForm";

export default async function EditRolePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RoleForm mode="edit" roleId={id} />;
}
