import crypto from 'crypto';

/**
 * Generates a fake base64 string that resembles a user public key.
 * 
 * ⚠️ **WARNING**: This is NOT a valid cryptographic key. 
 * This function is only for testing purposes to generate mock data.
 * 
 * @returns A base64-encoded random string (162 bytes)
 * 
 * @example
 * ```typescript
 * const mockPublicKey = generateSignKeyPub();
 * // Use in tests where you need a public key format
 * ```
 */
export function generateSignKeyPub(): string {
  return crypto.randomBytes(162).toString('base64');
}

/**
 * Generates a fake base64 string that resembles a user encrypted private key.
 * 
 * ⚠️ **WARNING**: This is NOT a valid cryptographic key.
 * This function is only for testing purposes to generate mock data.
 * 
 * @returns A base64-encoded random string (640 bytes)
 * 
 * @example
 * ```typescript
 * const mockPrivateKey = generateSignKeyEncrypted();
 * // Use in tests where you need an encrypted private key format
 * ```
 */
export function generateSignKeyEncrypted(): string {
  return crypto.randomBytes(640).toString('base64');
}

/**
 * Generates a fake base64 string that resembles an encrypted BlackBerry passcode.
 * 
 * ⚠️ **WARNING**: This is NOT a valid cryptographic key.
 * This function is only for testing purposes to generate mock data.
 * 
 * @returns A base64-encoded random string (80 bytes)
 * 
 * @example
 * ```typescript
 * const mockPasscode = generateBbEncrypted();
 * // Use in tests where you need a BlackBerry passcode format
 * ```
 */
export function generateBbEncrypted(): string {
  return crypto.randomBytes(80).toString('base64');
}
