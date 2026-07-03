import { PurchaseRequestForm } from "@/components/purchase-request/PurchaseRequestForm";

export default async function ViewPurchaseRequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PurchaseRequestForm mode="view" requestId={id} />;
}
