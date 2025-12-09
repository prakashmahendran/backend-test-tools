import { randomUUID } from 'crypto';
import { sign, SignOptions } from 'jsonwebtoken';

/**
 * Generates a mock JWT access token for testing purposes.
 * 
 * This token is self-signed and only valid in test environments. It simulates
 * tokens that would typically be issued by an authentication service like Auth0.
 * 
 * @param userId - The user ID to include in the token subject. If not provided, a random UUID will be generated.
 * @param options - Additional JWT signing options (expiresIn, audience, issuer, etc.)
 * @param payload - Additional payload data to include in the token
 * 
 * @returns A signed JWT token string
 * 
 * @throws {Error} If JWT_SECRET environment variable is not set
 * 
 * @example
 * ```typescript
 * const token = generateAccessToken('user-123');
 * const tokenWithCustomPayload = generateAccessToken('user-456', {}, { role: 'admin' });
 * const shortLivedToken = generateAccessToken('user-789', { expiresIn: '1h' });
 * ```
 * 
 * @see {@link https://github.com/auth0/node-jsonwebtoken jsonwebtoken package} for available options
 */
export function generateAccessToken(
  userId: string,
  options: SignOptions = {},
  payload: string | Buffer | object = {}
): string {
  const id = userId ?? randomUUID();
  if (!process.env.JWT_SECRET) throw new Error('Missing JWT signing secret');
  return sign(
    typeof payload === 'object' ? { ...payload, user: { id } } : payload,
    process.env.JWT_SECRET,
    {
      expiresIn: '1d',
      audience: process.env.ACCESS_TOKEN_AUDIENCE,
      issuer: process.env.ACCESS_TOKEN_ISSUER,
      subject: id,
      jwtid: randomUUID(),
      ...options
    }
  );
}
