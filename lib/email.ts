import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface TicketConfirmationEmailData {
  to: string;
  purchaserName: string;
  ticketType: string;
  ticketCode: string;
  price: number;
}

export async function sendTicketConfirmationEmail({
  to,
  purchaserName,
  ticketType,
  ticketCode,
  price
}: TicketConfirmationEmailData) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Metagame 2025 <tickets@metagame2025.com>',
      to,
      subject: 'Your Metagame 2025 Ticket Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Thank you for your purchase!</h1>
          
          <p>Hi ${purchaserName},</p>
          
          <p>Your ticket purchase for Metagame 2025 has been confirmed!</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0;">Ticket Details</h2>
            <p><strong>Ticket Type:</strong> ${ticketType}</p>
            <p><strong>Price Paid:</strong> $${price.toFixed(2)}</p>
            <p><strong>Your Ticket Code:</strong> <span style="font-size: 24px; font-weight: bold; color: #007bff;">${ticketCode}</span></p>
          </div>
          
          <div style="background-color: #e8f4f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">🎮 Next Steps</h3>
            <p>To claim your Metagame account and complete your registration:</p>
            <ol>
              <li>Go to the <a href="${process.env.NEXT_PUBLIC_SITE_URL}/signup">signup page</a></li>
              <li>Enter your ticket code: <strong>${ticketCode}</strong></li>
              <li>Create your account and join the Metagame community!</li>
            </ol>
          </div>
          
          <p>If you have any questions, please don't hesitate to reach out to us.</p>
          
          <p>See you at Metagame 2025!</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ccc;">
          
          <p style="font-size: 12px; color: #666;">
            This is an automated email from Metagame 2025. Please do not reply to this email.
          </p>
        </div>
      `,
      text: `
Thank you for your purchase!

Hi ${purchaserName},

Your ticket purchase for Metagame 2025 has been confirmed!

Ticket Details:
- Ticket Type: ${ticketType}
- Price Paid: $${price.toFixed(2)}
- Your Ticket Code: ${ticketCode}

Next Steps:
1. Go to ${process.env.NEXT_PUBLIC_SITE_URL}/signup
2. Enter your ticket code: ${ticketCode}
3. Create your account and join the Metagame community!

If you have any questions, please don't hesitate to reach out to us.

See you at Metagame 2025!
      `.trim()
    });

    if (error) {
      console.error('Failed to send email:', error);
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending ticket confirmation email:', error);
    throw error;
  }
}