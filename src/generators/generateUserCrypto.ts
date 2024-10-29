import crypto from 'crypto';

/**
 * Generates a fake base64 string that looks like a user public key
 * /!\ This is not a valid crypto key
 */
export function generateSignKeyPub(): string {
  return crypto.randomBytes(162).toString('base64');
}
/**
 * Generates a fake base64 string that looks like a user encrypted private key
 * /!\ This is not a valid crypto key
 */
export function generateSignKeyEncrypted(): string {
  return crypto.randomBytes(640).toString('base64');
}

/**
 * Generates a fake base64 string that looks like a user encrypted Blackberry Passcode
 * /!\ This is not a valid crypto key
 */
export function generateBbEncrypted(): string {
  return crypto.randomBytes(80).toString('base64');
}
