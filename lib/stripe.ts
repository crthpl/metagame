import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from './env';

// Initialize Stripe with secret key
export const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2025-06-30.basil',
});

export const createPaymentIntent = async (
  finalPriceInCents: number,
  metadata: Record<string, string>
) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalPriceInCents, // Convert to cents
      currency: 'usd',
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret!,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw new Error(`Failed to create payment intent: ${error}`);
  }
};

export const confirmPayment = async (paymentIntentId: string) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return {
      success: paymentIntent.status === 'succeeded',
      paymentIntent,
    };
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw new Error('Failed to confirm payment');
  }
}; 