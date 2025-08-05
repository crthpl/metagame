export interface TicketType {
  id: string;
  title: string;
  price: number;
  applicationBased: boolean;
  live: boolean; //whether the apply/purchase button for this ticket should be disabled
  ticketUrl?: string;
  regularPrice?: number;
  description: string;
  finePrint?: string;
  features?: string[];
}

export interface TicketPurchaseData {
  name: string;
  email: string;
  discordHandle?: string;
  ticketType: string;
  price: number;
  volunteerRoles?: string[];
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export interface PaymentConfirmationData {
  paymentIntentId: string;
  name: string;
  email: string;
  discordHandle?: string;
  ticketType: string;
  price: number;
  stripePaymentId: string;
  success: boolean;
  volunteerRoles?: string[];
}

export interface AirtableRecord {
  Name: string;
  Email: string;
  'Discord Handle'?: string;
  'Ticket Type': string;
  Price: number;
  'Stripe Payment ID': string;
  'Purchase Date': string;
  Status: 'Success' | 'Failed';
  'Stripe Fee'?: number;
  'Volunteer Roles'?: string[];
} 