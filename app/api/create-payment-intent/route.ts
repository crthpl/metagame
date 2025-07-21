import { NextRequest, NextResponse } from 'next/server';
import { createPaymentIntent } from '../../../lib/stripe';
import { getTicketType } from '../../../config/tickets';
import { validateCoupon, applyCouponDiscount } from '../../../lib/coupons';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticketTypeId, name, email, discordHandle, volunteerRoles, couponCode } = body;

    // Validate required fields
    if (!ticketTypeId || !name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate Discord Handle format if provided
    if (discordHandle && !/^[a-zA-Z0-9_#]+$/.test(discordHandle.trim())) {
      return NextResponse.json(
        { error: 'Invalid Discord handle format' },
        { status: 400 }
      );
    }

    // Get ticket type and validate
    const ticketType = getTicketType(ticketTypeId);
    if (!ticketType) {
      return NextResponse.json(
        { error: 'Invalid ticket type' },
        { status: 400 }
      );
    }

    // Convert ticket price from dollars to cents for Stripe
    const originalPriceInCents = ticketType.price * 100;

    // Validate coupon if provided
    let coupon = null;
    let finalPriceInCents = originalPriceInCents;
    if (couponCode && couponCode.trim()) {
      coupon = validateCoupon(couponCode.trim());
      if (!coupon) {
        return NextResponse.json(
          { error: 'Invalid coupon code' },
          { status: 400 }
        );
      }
      finalPriceInCents = applyCouponDiscount(originalPriceInCents, coupon);
    }

    // Create payment intent
    const metadata = {
      ticketType: ticketType.title,
      customerName: name,
      customerEmail: email,
      customerDiscordHandle: discordHandle,
      volunteerRoles: volunteerRoles ? JSON.stringify(volunteerRoles) : '',
      originalPrice: originalPriceInCents.toString(),
      couponCode: coupon?.code || '',
      discountAmount: coupon ? coupon.discountAmount.toString() : '0',
    };

    const { clientSecret, paymentIntentId } = await createPaymentIntent(
      finalPriceInCents,
      metadata
    );

    return NextResponse.json({
      clientSecret,
      paymentIntentId,
      amount: finalPriceInCents,
      originalAmount: originalPriceInCents,
      coupon: coupon ? {
        code: coupon.code,
        discountAmount: coupon.discountAmount,
        description: coupon.description,
      } : null,
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 