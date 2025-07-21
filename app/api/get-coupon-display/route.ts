import { NextRequest, NextResponse } from 'next/server';
import { getCouponByName } from '../../../lib/coupons';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { puzzleSolved, couponName } = body;

    if (!puzzleSolved || !couponName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Only return coupon info if puzzle is solved
    if (!puzzleSolved) {
      return NextResponse.json(
        { error: 'Puzzle not solved' },
        { status: 403 }
      );
    }

    // Get coupon info by name
    const coupon = getCouponByName(couponName);
    
    if (!coupon) {
      return NextResponse.json(
        { error: 'Coupon not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      name: couponName.toUpperCase(),
      code: coupon.code,
      discount: `$${(coupon.discountAmount / 100).toFixed(0)}`,
      description: coupon.description
    });
  } catch (error) {
    console.error('Error in get-coupon-display:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 