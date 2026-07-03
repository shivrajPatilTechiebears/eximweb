import { PurchaseOrderForm } from "@/components/purchase-order/PurchaseOrderForm";

export default async function ViewPurchaseOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PurchaseOrderForm mode="view" orderId={id} />;
}
