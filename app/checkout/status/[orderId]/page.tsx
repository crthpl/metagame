'use client'

import { notFound } from 'next/navigation'
import { getOrderStatus } from '@/app/actions/db/opennode'
import Image from 'next/image'
import { ExternalLinkIcon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

export default function CheckoutStatusPage() {
  const params = useParams()
  const orderId = params.orderId as string

  // Use React Query with polling
  const {
    data: orderStatus,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['order-status', orderId],
    queryFn: () => getOrderStatus({ orderId }),
    enabled: !!orderId,
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
    retry: 3,
    retryDelay: 5000,
  })

  if (!orderId) {
    notFound()
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <div className="border-base-300 bg-base-200 rounded-xl border p-6">
          <div className="alert alert-error">
            <span>Failed to load order: {error.message}</span>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading || !orderStatus) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <div className="border-base-300 bg-base-200 rounded-xl border p-6">
          <div className="animate-pulse">
            <div className="bg-base-300 mb-4 h-8 rounded"></div>
            <div className="bg-base-300 mb-2 h-4 rounded"></div>
            <div className="bg-base-300 h-6 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  const messageButtonThing = () => {
    switch (orderStatus.status) {
      case 'unpaid':
        return (
          <a
            className="btn btn-primary flex w-fit items-center gap-2"
            href={orderStatus.hostedUrl}
          >
            Complete payment <ExternalLinkIcon className="h-4 w-4" />
          </a>
        )
      case 'expired':
        return (
          <div className="alert alert-error mt-4 w-fit">
            <span>
              Payment expired. Please start a new ticket purchase and try again.
            </span>
          </div>
        )
      case 'processing':
        return (
          <div className="alert alert-info mt-4 w-fit">
            <span>Payment sent and being processed!</span>
          </div>
        )
      case 'paid':
        return (
          <div className="alert alert-success mt-4 w-fit">
            <span>Payment received! Check your email for your ticket!</span>
          </div>
        )
      default:
        return null
    }
  }

  const badgeClass = () => {
    switch (orderStatus.status) {
      case 'unpaid':
        return 'badge-primary'
      case 'expired':
        return 'badge-error'
      case 'processing':
        return 'badge-info'
      case 'paid':
        return 'badge-success'
      default:
        return 'badge-neutral'
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="border-base-300 bg-base-200 rounded-xl border p-6">
        <div className="mb-2 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Bitcoin Checkout Status</h1>
          {orderStatus.status !== 'paid' &&
            orderStatus.status !== 'expired' && (
              <div className="flex items-center gap-2 text-sm opacity-70">
                <div className="loading loading-spinner loading-xs"></div>
                Auto-refreshing...
              </div>
            )}
        </div>

        <p className="mb-4 text-sm opacity-80">
          Order: <span className="font-mono">{orderId}</span>
        </p>

        <div className="mb-4">
          <div className="text-lg">
            Status:{' '}
            <span className={`badge badge-lg px-3 ${badgeClass()}`}>
              {orderStatus.status}
            </span>
          </div>
          <div className="mt-2 opacity-80">
            Amount: ₿{' '}
            <span className="font-mono">{orderStatus.amount / 100000000}</span>
          </div>
        </div>

        {messageButtonThing()}

        <div className="divider" />
        <div className="text-sm opacity-70">
          <div className="mb-1 flex items-center gap-1">
            <Image
              src="/logos/opennode.png"
              alt="OpenNode"
              width={12}
              height={12}
            />
            OpenNode Charge ID:{' '}
            <a
              href={orderStatus.hostedUrl}
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {orderStatus.opennodeId}
            </a>
          </div>
          <div>Purchaser Email: {orderStatus.purchaserEmail}</div>
          <div>Ticket Type: {orderStatus.ticketType}</div>
        </div>
      </div>
    </div>
  )
}
