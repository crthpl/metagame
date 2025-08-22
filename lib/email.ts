import { Resend } from 'resend'

import { SOCIAL_LINKS } from '@/utils/urls'

import { getTicketType } from '@/config/tickets'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface TicketConfirmationEmailData {
  to: string
  purchaserName: string
  ticketType: string
  ticketCode: string
  price: number
  paymentIntentId?: string
  opennodeChargeId?: string
}

export async function sendTicketConfirmationEmail({
  to,
  purchaserName,
  ticketType,
  ticketCode,
  price,
  paymentIntentId,
  opennodeChargeId,
}: TicketConfirmationEmailData) {
  try {
    const discordUrl = SOCIAL_LINKS.DISCORD
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://metagame.games'
    const isBtc = opennodeChargeId !== undefined
    const { data, error } = await resend.emails.send({
      from: 'Metagame 2025 <tickets@mail.metagame.games>',
      to,
      bcc: [
        'ricki.heicklen+metagame@gmail.com',
        'briantsmiley42+metagame@gmail.com',
      ],
      replyTo: [
        'ricki.heicklen+metagame@gmail.com',
        'briantsmiley42+metagame@gmail.com',
      ],
      subject:
        'Action required: Claim your Metagame 2025 ticket and register your profile',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Claim your ticket and complete registration</h1>
          
          <p>Hi ${purchaserName},</p>
          
          <p>Your Metagame 2025 ticket is confirmed. <strong>Next, claim your ticket and create your account</strong> so we can associate the ticket with your profile and keep you in the loop.</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0;">Ticket Details</h2>
            <p><strong>Ticket Type:</strong> ${getTicketType(ticketType)?.title}</p>
            <p><strong>Price Paid:</strong> ${isBtc ? `₿${price.toFixed(6)}` : `$${price.toFixed(2)}`}</p>
            <p><strong>Your Ticket Code:</strong> <span style="font-size: 20px; font-weight: bold; color: #007bff;">${ticketCode}</span></p>
            ${isBtc ? `<p><strong>OpenNode Charge ID:</strong> ${opennodeChargeId}</p>` : `<p><strong>Stripe Payment ID:</strong> ${paymentIntentId}</p>`}
          </div>
          
          <div style="background-color: #e8f4f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">🎮 Next Steps</h3>
            <p>To claim your ticket and complete registration:</p>
            <ol>
              <li>Go to the <a href="${siteUrl}/signup?email=${encodeURIComponent(to)}&ticketCode=${ticketCode}">signup page</a></li>
              <li>Your email and ticket code will be pre-filled</li>
              <li>Create your account and set up your profile (badge name, Discord, etc.)</li>
              <li>Confirm your account by clicking the verification link sent to your email</li>
            </ol>
            <p> Note: The Ticket Code above allows you to create an account/register for the event. It can be used with <b>any</b> email address and name. To sign up with a different email address than this one, go to the <a href="${siteUrl}/signup?ticketCode=${ticketCode}">signup page</a> and enter the appropriate details with your ticket code. You can also effectively transfer this ticket to someone else by giving them the ticket code to sign up with.</p> 
          </div>

          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Event Information</h3>
            <p><strong>Dates:</strong> Friday, September 12 – Sunday, September 14, 2025</p>
            <p><strong>Location:</strong> Lighthaven Campus, 2740 Telegraph Avenue, Berkeley, CA</p>
            <p><strong>Lodging:</strong> Rooms at and near the venue can be booked via <a href="https://www.havenbookings.space/events/metagame">Haven Bookings</a>. You can also coordinate with others in the <a href="https://discord.gg/GsT3yRrxR9">#housing</a> Discord channel.</p>
            <p><strong>Food:</strong> Snacks are available and included with your ticket, but meals are not. There will be food trucks on site with meals available for purchase.</p>
            <p><strong>Schedule:</strong> A preliminary schedule is available <a href="https://metagame.games/schedule">here</a> but highly subject to chage.</p>
            <p><strong>Speaking of which:</strong> If you want to speak or run something, submit a proposal <a href="https://airtable.com/appTvPARUssZp4qiB/pagVuzTEXODlUwoi0/form">here</a> by August 25th.</p>
            <p><strong>Children:</strong> Metagame is free for children under 13, and free childcare for kids ages 5-12 is available for much of the weekend! If you are planning to bring children of any age or are a child yourself, please fill out <a href="https://airtable.com/appTvPARUssZp4qiB/pagZ9WbXLji0eBqDU/form">this form</a> as soon as possible, and no later than Monday, September 1st to help us plan accordingly.</p>
            <p><strong>Contact:</strong> <a href="${discordUrl}">Join our Discord!</a></p>
          </div>
          
          ${isBtc ? `<p>If you believe there has been a mistake, want a 94% refund on your ticket (available until September 1), reply to this email.</p>` : ''}
          
          <p>See you at Metagame 2025!</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ccc;">
          
          <p style="font-size: 12px; color: #666;">This is not a puzzle.</p>
        </div>
      `,
      text: `
Claim your ticket and complete registration

Hi ${purchaserName},

Your Metagame 2025 ticket is confirmed. NEXT: claim your ticket and create your account so we can associate the ticket with your profile and keep you in the loop.

Ticket Details:
- Ticket Type: ${ticketType}
- Price Paid: $${price.toFixed(2)}
- Your Ticket Code: ${ticketCode} (you will need this to create your account and associate the ticket)
- Stripe Payment ID: ${paymentIntentId}

Next Steps:
1. Go to ${siteUrl}/signup?email=${encodeURIComponent(to)}&ticketCode=${ticketCode}
2. Your email and ticket code will be pre-filled
3. Create your account and set up your profile (badge name, Discord, etc.)
4. Confirm your account by clicking the verification link sent to your email (required so ticket codes can be used with a different email if needed)

Note: The Ticket Code above allows you to create an account/register for the event. It can be used with any email address and name. To sign up with a different email address than this one, or to transfer this ticket to someone else, go to ${siteUrl}/signup?ticketCode=${ticketCode} and enter the appropriate details with your ticket code.

Please join the Discord, where all future communication will take place: ${discordUrl}
Housing at and near the venue can be booked via: https://www.havenbookings.space/events/metagame. Coordinate with others in the #housing Discord channel.

Event Information
- Name: Metagame 2025
- Dates: Friday, September 12 – Sunday, September 14, 2025
- Location: Lighthaven Campus, 2740 Telegraph Avenue, Berkeley, CA
- Contact: reply to this email

If you believe there has been a mistake, want a 94% refund on your ticket (available until September 1), or have any other questions, just reply to this email.

See you at Metagame 2025!

This is not a puzzle.
      `.trim(),
    })

    if (error) {
      console.error('Failed to send email:', error)
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending ticket confirmation email:', error)
    throw error
  }
}
