interface OrderNotificationData {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  description: string;
  locale: string;
}

export async function sendOrderNotification(order: OrderNotificationData): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('Telegram credentials not configured, skipping notification.');
    return;
  }

  const phone = order.phone ? `\n📞 Phone: ${order.phone}` : '';
  const description =
    order.description.length > 500
      ? order.description.substring(0, 497) + '...'
      : order.description;

  const message = `🆕 *New Order Received!*

🔑 ID: \`${order.id}\`
👤 Name: ${escapeMarkdown(order.name)}
📧 Email: ${escapeMarkdown(order.email)}${phone}
🌐 Locale: ${order.locale.toUpperCase()}

📝 *Description:*
${escapeMarkdown(description)}

🔗 [View in Admin](${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL}/admin/orders)`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Telegram API error:', error);
    }
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
  }
}

function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&');
}
