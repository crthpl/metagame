import { opennodeDbService } from '@/lib/db/opennode'
import { ticketsService } from '@/lib/db/tickets'
import { opennode } from '@/lib/opennode'
import { NextRequest, NextResponse } from 'next/server'
import { OpenNodeChargeWebhook } from 'opennode/dist/types/v1'

export async function POST(req: NextRequest) {
  const body: OpenNodeChargeWebhook = await req.json()
  console.log('opennode webhook', body)
  //Skip the hash check when testing webhooks locally
  const ok =
    process.env.OPENNODE_ENV === 'dev' ? true : opennode.signatureIsValid(body) // HMAC check
  if (!ok) {
    console.error('invalid sig on opennode webhook', body)
    return new NextResponse('invalid sig', { status: 400 })
  }

  const dbCharge = await opennodeDbService.updateChargeStatus({
    metagameOrderId: body.order_id,
    status: body.status,
    charge: body,
  })

  if (body.status === 'paid') {
    const newTicket = {
      opennode_order: dbCharge.id,
      ticket_type: dbCharge.ticket_type!,
      purchaser_email: dbCharge.purchaser_email,
      is_test: dbCharge.is_test,
      satoshis_paid: body.amount,
    }
    await ticketsService.createTicket({ ticket: newTicket })
  }

  return NextResponse.json({ received: true })
}
