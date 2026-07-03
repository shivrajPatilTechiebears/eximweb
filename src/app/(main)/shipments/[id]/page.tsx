import { ShipmentForm } from "@/components/shipments/ShipmentForm";

export default async function ViewShipmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ShipmentForm mode="view" shipmentId={id} />;
}
