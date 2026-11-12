import { generateKeyPairSync, randomUUID, KeyObject } from 'crypto';
import { sign } from 'jsonwebtoken';

/** A P-256 key pair for a client (device) and its public JWK */
export interface ClientKeyPair {
  privateKey: KeyObject;
  publicJwk: { kty: string; crv: string; x: string; y: string };
}

/** Generate the P-256 key pair a client registers with its public JWK (private_key_jwt) */
export function generateClientKeyPair(): ClientKeyPair {
  const { publicKey, privateKey } = generateKeyPairSync('ec', { namedCurve: 'P-256' });
  const jwk = publicKey.export({ format: 'jwk' }) as { kty: string; crv: string; x: string; y: string };
  return { privateKey, publicJwk: { kty: jwk.kty, crv: jwk.crv, x: jwk.x, y: jwk.y } };
}

/** Options of a client assertion */
export interface ClientAssertionOptions {
  /** Client id: used as issuer and subject */
  clientId: string;
  /** Expected audience */
  audience: string;
  privateKey: KeyObject;
  /** Shift the client's clock by this many seconds (test clock skew handling) */
  clockOffsetSec?: number;
  /** Lifetime in seconds (default 120) */
  expiresInSec?: number;
}

/** An ES256 private_key_jwt client assertion (RFC 7523) with a fresh jti */
export function generateClientAssertion(options: ClientAssertionOptions): string {
  const now = Math.floor(Date.now() / 1000) + (options.clockOffsetSec ?? 0);
  return sign({ iat: now, exp: now + (options.expiresInSec ?? 120) }, options.privateKey, {
    algorithm: 'ES256',
    issuer: options.clientId,
    subject: options.clientId,
    audience: options.audience,
    jwtid: randomUUID()
  });
}
