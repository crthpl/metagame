import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '../../../lib/stripe';
import { createTicketRecord, formatAirtableRecord } from '../../../lib/airtable';
import { paymentConfirmationSchema } from '../../../lib/schemas/ticket';
import { ticketsService } from '@/lib/db/tickets';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input using Zod schema
    const validatedData = paymentConfirmationSchema.parse(body);
    console.log("VALIDATEDDATA", validatedData);
    const { paymentIntentId, name, email, discordHandle, ticketType } = validatedData;

    // Retrieve payment intent from Stripe to check its status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ['charges']
    });
    const price = paymentIntent.amount / 100;
    const success = paymentIntent.status === 'succeeded';

    if (!success) {
      return NextResponse.json({
        success: false,
        error: `Payment not succeeded. Status: ${paymentIntent.status}`,
        paymentIntentId 
      });
    }

    // Get the Stripe processing fee from the payment intent
    let stripeFee: number | undefined;
    const expandedPaymentIntent = paymentIntent as {
      charges?: {
        data: Array<{
          fee?: number;
          [key: string]: unknown;
        }>;
      };
    } & typeof paymentIntent;
    
    if (expandedPaymentIntent.charges && expandedPaymentIntent.charges.data.length > 0) {
      const charge = expandedPaymentIntent.charges.data[0];
      if (charge.fee) {
        // Convert from cents to dollars
        stripeFee = charge.fee / 100;
      }
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
          const charge = charges.data[0];
          // Access fee property using bracket notation to avoid type issues
          const fee = (charge as unknown as { fee?: number }).fee;
          if (fee) {
            stripeFee = fee / 100;
          }
        }
      } catch (error) {
        console.log('Error retrieving charge directly:', error);
      }
    }

    // Fallback: Calculate fee if not provided by Stripe
    // Stripe's standard fee is 2.9% + $0.30 for US cards
    if (stripeFee === undefined) {
      const amountInDollars = paymentIntent.amount / 100;
      // Calculate 2.9% + $0.30
      stripeFee = (amountInDollars * 0.029) + 0.30;
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
      stripeFee
    );

    const airtableResult = await createTicketRecord(airtableRecord);


    const supabaseTicketRecord = {
        stripe_payment_id: paymentIntentId,
        purchaser_email: email,
        ticket_type: ticketType,
        price_paid: price,
<<<<<<< HEAD
        coupons_used: [paymentIntent.metadata.couponCode],
        is_test: process.env.STRIPE_SECRET_KEY?.startsWith('sk_test') ?? false
=======
        coupons_used: [paymentIntent.metadata.couponCode]
>>>>>>> e198b67 (makes ticket form a modal and better schema checking on inputs and adds ticket to supabase on confirmation)
    }

    await ticketsService.createTicket({ticket: supabaseTicketRecord});

    return NextResponse.json({
      success: true,
      paymentIntentId,
      airtableRecordId: airtableResult.recordId,
      message: 'Payment successful! Your ticket has been purchased.',
    });
  } catch (error) {
    console.error('Error in confirm-payment:', error);
    
    // Handle Zod validation errors
<<<<<<< HEAD
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          success: false,
          error: error.issues?.[0]?.message || 'Invalid input data'
=======
    if (error instanceof Error && 'errors' in error) {
      const zodError = error as any;
      return NextResponse.json(
        { 
          success: false,
          error: zodError.errors?.[0]?.message || 'Invalid input data'
>>>>>>> e198b67 (makes ticket form a modal and better schema checking on inputs and adds ticket to supabase on confirmation)
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
} 