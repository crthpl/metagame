// Force ROLLUP_SKIP_NATIVE to prevent native module errors
if (!process.env.ROLLUP_SKIP_NATIVE) {
  process.env.ROLLUP_SKIP_NATIVE = 'true';
}

import type { APIRoute } from 'astro';
import { getCouponByName } from '../../lib/coupons';

export const POST: APIRoute = async ({ request }) => {
  console.log('=== GET COUPON DISPLAY API CALLED ===');
  
  try {
    const body = await request.json();
    console.log('Request body:', body);
    
    const { puzzleSolved, couponName } = body;

    if (!puzzleSolved || !couponName) {
      console.log('Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Only return coupon info if puzzle is solved
    if (!puzzleSolved) {
      console.log('Puzzle not solved - returning error');
      return new Response(
        JSON.stringify({ error: 'Puzzle not solved' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('Puzzle solved, getting coupon:', couponName);

    // Get coupon info by name
    const coupon = getCouponByName(couponName);
    console.log('Coupon lookup result:', coupon);
    
    if (!coupon) {
      console.log('Coupon not found');
      return new Response(
        JSON.stringify({ error: 'Coupon not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('Coupon found, returning display info');
    return new Response(
      JSON.stringify({
        name: couponName.toUpperCase(),
        code: coupon.code,
        discount: `$${(coupon.discountAmount / 100).toFixed(0)}`,
        description: coupon.description
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in get-coupon-display:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Always return a proper JSON response, even on error
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        debug: {
          nodeEnv: process.env.NODE_ENV,
          errorType: error instanceof Error ? error.constructor.name : 'Unknown'
        }
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 