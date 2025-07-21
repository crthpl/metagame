import { NextRequest, NextResponse } from 'next/server';
import { validateCoupon, applyCouponDiscount } from '../../../lib/coupons';
import { getTicketType } from '../../../config/tickets';

// Simple in-memory rate limiting (for production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_ATTEMPTS = 5; // 5 attempts per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT_MAX_ATTEMPTS) {
    return false;
  }
  
  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Basic rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { couponCode, ticketTypeId } = body;

    if (!couponCode || !ticketTypeId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get ticket type
    const ticketType = getTicketType(ticketTypeId);
    if (!ticketType) {
      return NextResponse.json(
        { error: 'Invalid ticket type' },
        { status: 400 }
      );
    }

    // Convert ticket price from dollars to cents for Stripe
    const originalPriceInCents = ticketType.price * 100;

    // Validate coupon
    const coupon = validateCoupon(couponCode.trim());
    
    if (!coupon) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid coupon code'
      });
    }

    // Calculate discounted price (in cents)
    const discountedPriceInCents = applyCouponDiscount(originalPriceInCents, coupon);

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        discountAmount: coupon.discountAmount,
        description: coupon.description,
      },
      originalPrice: originalPriceInCents,
      discountedPrice: discountedPriceInCents,
      savings: originalPriceInCents - discountedPriceInCents,
    });
  } catch (error) {
    console.error('Error in validate-coupon:', error);
    
    return NextResponse.json(
      { 
        valid: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
} 