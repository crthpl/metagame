import { notFound } from 'next/navigation';
import { opennodeDbService } from '@/lib/db/opennode';
import { opennode } from '@/lib/opennode';
import { getHostedCheckoutUrl } from '@/utils/opennode';
import Image from 'next/image';

type PageProps = {
  params: Promise<{ orderId: string }>;
};

export default async function CheckoutStatusPage({ params }: PageProps) {

  const { orderId } = await params;
  if (!orderId) {
    notFound();
  }

  // Get our internal DB record for this order
  const dbCharge = await opennodeDbService.getChargeByOrderId({ orderId }).catch(() => null);
  if (!dbCharge) {
    console.error('No dbCharge found for orderId', orderId);
    notFound();
  }

  // Fetch current status from OpenNode
  const openNodeId = dbCharge.opennode_order_id;
  const remote = await opennode.chargeInfo(openNodeId);

  const hostedUrl = getHostedCheckoutUrl(openNodeId);

  const status = remote.status || dbCharge.status;

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="rounded-xl border border-base-300 bg-base-200 p-6">
        <h1 className="mb-2 text-2xl font-bold">Bitcoin Checkout Status</h1>
        <p className="mb-4 text-sm opacity-80">
          Order: <span className="font-mono">{orderId}</span>
        </p>

        <div className="mb-4">
          <div className="text-lg">
            Status: <span className="badge badge-lg">{status}</span>
          </div>
          <div className="mt-2 opacity-80">
            Amount: ₿ <span className="font-mono">{remote.amount / 100000000}</span>
          </div>
        </div>

        {status !== 'paid' && hostedUrl && (
          <a className="btn btn-primary" href={hostedUrl}>
            Complete payment
          </a>
        )}

        {status === 'paid' && (
          <div className="alert alert-success mt-4">
            <span>Payment received! Your ticket is being issued.</span>
          </div>
        )}

        <div className="divider" />
        <div className="text-sm opacity-70">
          <div className="flex items-center gap-1 mb-1"><Image src="/logos/opennode.png" alt="OpenNode" width={12} height={12} /> OpenNode Charge ID: {remote.id}</div>
          <div>Purchaser Email: {dbCharge.purchaser_email}</div>
          <div>Ticket Type: {dbCharge.ticket_type}</div>
        </div>
      </div>
    </div>
  );
}
