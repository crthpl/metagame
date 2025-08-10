import { NextRequest, NextResponse } from 'next/server';
import { createChargeRaw } from '@/lib/opennode';
import { opennodeChargeSchema } from '@/lib/schemas/opennode';
import { v4 as uuidv4 } from 'uuid';
import { opennodeDbService } from '@/lib/db/opennode';

export async function POST(req: NextRequest) {
  const { amountBtc, ticketDetails } = opennodeChargeSchema.parse(await req.json());
  const callback = `${process.env.NEXT_PUBLIC_BASE_URL}/api/checkout/opennode/webhook`;
  const metagameOrderId = uuidv4();

  const amountSatoshis = Math.round(amountBtc * 100000000);

  const charge = await createChargeRaw({
    amount: amountSatoshis,
    description: `Metagame ${ticketDetails.ticketType} Ticket for ${ticketDetails.purchaserEmail}`,
    customer_email: ticketDetails.purchaserEmail,
    auto_settle: true,
    order_id: metagameOrderId,
    callback_url: callback,
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/status/${metagameOrderId}`,
  });


  await opennodeDbService.createCharge({charge, ticketDetails});

  //TODO: RESEND email to purchaser linking to the status page in case they lose the link

  return NextResponse.json({ charge });
}



