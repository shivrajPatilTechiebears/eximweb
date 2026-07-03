import { PurchaseRequestForm } from "@/components/purchase-request/PurchaseRequestForm";

export default async function EditPurchaseRequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PurchaseRequestForm mode="edit" requestId={id} />;
}
