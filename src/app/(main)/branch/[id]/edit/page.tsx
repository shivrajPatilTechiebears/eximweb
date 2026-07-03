import { BranchForm } from "@/components/branch/BranchForm";

export default async function EditBranchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BranchForm mode="edit" branchId={id} />;
}
