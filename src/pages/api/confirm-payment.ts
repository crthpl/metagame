// Force ROLLUP_SKIP_NATIVE to prevent native module errors
if (!process.env.ROLLUP_SKIP_NATIVE) {
  process.env.ROLLUP_SKIP_NATIVE = 'true';
}

import type { APIRoute } from 'astro';
import { stripe } from '../../lib/stripe';
import { createTicketRecord, formatAirtableRecord } from '../../lib/airtable';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { paymentIntentId, name, email, discordHandle, ticketType, price, volunteerRoles } = body;

      // console.log('confirm-payment received body:', body);
      // console.log('volunteerRoles from request:', volunteerRoles);

    // Validate required fields
    if (!paymentIntentId || !name || !email || !ticketType || !price) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Retrieve payment intent from Stripe to check its status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ['charges']
    });
    const success = paymentIntent.status === 'succeeded';

    if (!success) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: `Payment not succeeded. Status: ${paymentIntent.status}`,
          paymentIntentId 
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // // Debug logging to see what Stripe returns
    // console.log('Payment Intent retrieved:', {
    //   id: paymentIntent.id,
    //   amount: paymentIntent.amount,
    //   status: paymentIntent.status,
    //   charges: (paymentIntent as any).charges
    // });

    // Get the Stripe processing fee from the payment intent
    // The fee is available in the 'charges' array, specifically the 'fee' field
    let stripeFee: number | undefined;
    const expandedPaymentIntent = paymentIntent as any; // Type assertion to access expanded data
    if (expandedPaymentIntent.charges && expandedPaymentIntent.charges.data.length > 0) {
      const charge = expandedPaymentIntent.charges.data[0];
      // console.log('First charge data:', {
      //   id: charge.id,
      //   fee: charge.fee,
      //   fee_details: charge.fee_details,
      //   amount: charge.amount,
      //   currency: charge.currency
      // });
      if (charge.fee) {
        // Convert from cents to dollars
        stripeFee = charge.fee / 100;
        // console.log('Stripe fee calculated:', stripeFee);
      } else {
        // console.log('No fee found in charge');
      }
    } else {
      // console.log('No charges found in payment intent');
    }

    // Alternative approach: Try to get the charge directly if not found in payment intent
    if (stripeFee === undefined) {
      try {
        // Get the latest charge for this payment intent
        const charges = await stripe.charges.list({
          payment_intent: paymentIntentId,
          limit: 1
        });
        
        if (charges.data.length > 0) {
          const charge = charges.data[0] as any; // Type assertion to access fee properties
          // console.log('Retrieved charge directly:', {
          //   id: charge.id,
          //   fee: charge.fee,
          //   fee_details: charge.fee_details
          // });
          if (charge.fee) {
            stripeFee = charge.fee / 100;
            // console.log('Stripe fee from direct charge retrieval:', stripeFee);
          }
        }
      } catch (error) {
        // console.log('Error retrieving charge directly:', error);
      }
    }

    // Fallback: Calculate fee if not provided by Stripe
    // Stripe's standard fee is 2.9% + $0.30 for US cards
    if (stripeFee === undefined) {
      const amountInDollars = paymentIntent.amount / 100;
      // Calculate 2.9% + $0.30
      stripeFee = (amountInDollars * 0.029) + 0.30;
      // console.log('Fallback fee calculated:', stripeFee);
    }

    // Create Airtable record
    const airtableRecord = formatAirtableRecord(
      name,
      email,
      ticketType,
      price,
      paymentIntentId,
      success,
      discordHandle,
      stripeFee,
      volunteerRoles
    );

    // console.log('Airtable record being created:', airtableRecord);

    const airtableResult = await createTicketRecord(airtableRecord);

    return new Response(
      JSON.stringify({
        success: true,
        paymentIntentId,
        airtableRecordId: airtableResult.recordId,
        message: 'Payment successful! Your ticket has been purchased.',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 