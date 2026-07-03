import { RoleForm } from "@/components/role-permissions/RoleForm";

export default async function ViewRolePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RoleForm mode="view" roleId={id} />;
}
