import { randomUUID } from 'crypto';
import { sign, SignOptions } from 'jsonwebtoken';

/** Returns an API access token valid in test environment */
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
