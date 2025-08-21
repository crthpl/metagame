"use server";
import { opennodeDbService } from "@/lib/db/opennode";
import { opennode } from "@/lib/opennode";

export async function getOrderStatus({ orderId }: { orderId: string }) {
  // Get our internal DB record for this order
  const dbCharge = await opennodeDbService.getChargeByOrderId({ orderId });
  if (!dbCharge) {
    throw new Error("Order not found");
  }

  // Fetch current status from OpenNode
  const openNodeId = dbCharge.opennode_order_id;
  const remote = await opennode.chargeInfo(openNodeId);

  return {
    orderId,
    status: remote.status || dbCharge.status,
    amount: remote.amount,
    opennodeId: remote.id,
    purchaserEmail: dbCharge.purchaser_email,
    ticketType: dbCharge.ticket_type,
    hostedUrl: `https://checkout.opennode.com/${remote.id}`,
  };
}
