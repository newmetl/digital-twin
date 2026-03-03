const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const MAX_MESSAGE_LENGTH = 500;

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.substring(0, max) + '…';
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export async function sendTelegramNotification(
  userMessage: string,
  assistantMessage: string
): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('Telegram: TELEGRAM_BOT_TOKEN oder TELEGRAM_CHAT_ID fehlt.');
    return;
  }

  const now = new Date().toLocaleString('de-DE', {
    timeZone: 'Europe/Berlin',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const text = [
    `🤖 <b>Digitaler Zwilling – Neue Konversation</b>`,
    ``,
    `👤 <b>Besucher:</b>`,
    escapeHtml(truncate(userMessage, MAX_MESSAGE_LENGTH)),
    ``,
    `🪞 <b>Wojtek (KI):</b>`,
    escapeHtml(truncate(assistantMessage, MAX_MESSAGE_LENGTH)),
    ``,
    `⏰ ${now} · <a href="https://ai.wojtek-gorecki.de">ai.wojtek-gorecki.de</a>`,
  ].join('\n');

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Telegram API Fehler:', error);
    }
  } catch (error) {
    // Telegram-Fehler sollen den Chat nicht blockieren
    console.error('Telegram: Nachricht konnte nicht gesendet werden:', error);
  }
}
