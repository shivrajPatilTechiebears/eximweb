import { BranchForm } from "@/components/branch/BranchForm";

export default async function ViewBranchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BranchForm mode="view" branchId={id} />;
}
