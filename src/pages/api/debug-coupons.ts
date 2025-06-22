// Force ROLLUP_SKIP_NATIVE to prevent native module errors
if (!process.env.ROLLUP_SKIP_NATIVE) {
  process.env.ROLLUP_SKIP_NATIVE = 'true';
}

import type { APIRoute } from 'astro';
import { validateCoupon, getCouponByName } from '../../lib/coupons';

export const GET: APIRoute = async () => {
  console.log('=== COUPON DEBUG ENDPOINT ===');
  
  try {
    // Test environment variables
    const envDebug = {
      nodeEnv: process.env.NODE_ENV,
      hasCouponsEnvVar: !!process.env.COUPONS,
      couponsEnvVarLength: process.env.COUPONS?.length || 0,
      couponsEnvVarPreview: process.env.COUPONS?.substring(0, 500) || 'N/A',
      rollupSkipNative: process.env.ROLLUP_SKIP_NATIVE,
      individualCouponVars: Object.keys(process.env).filter(k => k.startsWith('COUPON_')),
    };

    // Test coupon functions
    let couponTest = null;
    let couponByNameTest = null;
    
    try {
      couponTest = validateCoupon('TEST');
      couponByNameTest = getCouponByName('CROSSWORD');
    } catch (error) {
      console.error('Error testing coupon functions:', error);
    }

    const debug = {
      environment: envDebug,
      couponTest,
      couponByNameTest,
      timestamp: new Date().toISOString(),
    };

    console.log('Debug info:', debug);

    return new Response(
      JSON.stringify(debug, null, 2),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Debug endpoint error',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 