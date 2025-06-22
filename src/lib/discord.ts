interface DiscordWebhookPayload {
  content?: string;
  embeds?: Array<{
    title?: string;
    description?: string;
    color?: number;
    fields?: Array<{
      name: string;
      value: string;
      inline?: boolean;
    }>;
    timestamp?: string;
    footer?: {
      text: string;
    };
  }>;
}

export async function sendDiscordWebhook(
  webhookUrl: string,
  payload: DiscordWebhookPayload
): Promise<boolean> {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('Discord webhook failed:', response.status, response.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending Discord webhook:', error);
    return false;
  }
}

export function createTicketPurchaseEmbed(
  name: string,
  email: string,
  ticketType: string,
  price: number,
  paymentIntentId: string,
  timestamp: string = new Date().toISOString()
) {
  return {
    title: '🎫 New Ticket Purchase!',
    description: 'A new ticket has been purchased for MetaGame.',
    color: 0x00ff00, // Green color
    fields: [
      {
        name: '�� Customer',
        value: name,
        inline: true,
      },
      {
        name: '📧 Email',
        value: email,
        inline: true,
      },
      {
        name: '🎟️ Ticket Type',
        value: ticketType,
        inline: true,
      },
      {
        name: '💰 Price',
        value: `$${price.toFixed(2)}`,
        inline: true,
      },
      {
        name: '🆔 Payment ID',
        value: paymentIntentId,
        inline: true,
      },
      {
        name: '⏰ Purchase Time',
        value: new Date(timestamp).toLocaleString(),
        inline: true,
      },
    ],
    timestamp,
    footer: {
      text: 'MetaGame Ticket System',
    },
  };
} 