import { createServiceClient } from "@/utils/supabase/service";
import { OpenNodeCharge } from "opennode/dist/types/v1";
import { OpennodeChargeInput } from "../schemas/opennode";
import { DbOpendnodeOrder } from "@/types/database/dbTypeAliases";

export const opennodeDbService = {
  createCharge: async ({charge, ticketDetails}: {charge: OpenNodeCharge, ticketDetails: OpennodeChargeInput['ticketDetails']}) => {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('opennode_orders')
      .insert({
        id: charge.order_id,
        opennode_charge_id: charge.id,
        satoshis: charge.amount,
        status: charge.status,
        purchaser_email: ticketDetails.purchaserEmail,
        ticket_type: ticketDetails.ticketType,
        is_test: ticketDetails.isTest,
      });
    if (error) {
      throw new Error(`Error inserting opennode order into db: ${error.message}`);
    }
    return data;
  },
  updateChargeStatus: async ({orderId, status}: {orderId: string, status: DbOpendnodeOrder['status']}) => {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('opennode_orders')
      .update({ status })
      .eq('id', orderId)
      .select('*')
      .single()
    if (error) {
      throw new Error(`Error updating opennode order status: ${error.message}`);
    }
    return data;
  },
  getChargeByOrderId: async ({orderId}: {orderId: string}) => {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('opennode_orders')
      .select('*')
      .eq('id', orderId)
      .single()
    if (error) {
      throw new Error(`Error getting opennode order by order id: ${error.message}`);
    }
    return data;
  },
  getChargeStatus: async ({orderId}: {orderId: string}) => {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('opennode_orders')
      .select('status')
      .eq('id', orderId)
      .single()
    if (error) {
      throw new Error(`Error getting opennode order status: ${error.message}`);
    }
    return data;
  }
}