import crypto from 'crypto';

/** Generate a BlackBerry Spark chatId */
export function generateChatId(): string {
  return `${crypto.randomBytes(20).toString('hex')}.1`;
}
