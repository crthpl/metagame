import { TICKET_TYPES_ENUM } from '@/utils/dbUtils';
import { z } from 'zod';

export const opennodeChargeSchema = z.object({
  amountBtc: z.number().int().positive(),
  ticketDetails: z.object({
    ticketType: z.enum(TICKET_TYPES_ENUM),
    isTest: z.boolean(),
    purchaserEmail: z.email(),
  }),
});

export type OpennodeChargeInput = z.infer<typeof opennodeChargeSchema>;

export const opennodeWebhookSchema = z.object({
  id: z.string(), //charge uuid
  callback_url: z.string(),
  success_url: z.string(),
  status: z.string(),
  order_id: z.string(),
  description: z.string(),
  price: z.number(),
  fee: z.number(),
  auto_settle: z.boolean(),
  hashed_order: z.string(),
});

export type OpennodeWebhookInput = z.infer<typeof opennodeWebhookSchema>;