import {generateKeyPairSync, randomBytes} from 'crypto';
import {GeneratedKeyPair} from './generateKeyPair.types';

/**
 * Generate a RSA key pair
 * @param pass - passphrase used to encrypt the private key (default: generates a random passphrase)
 */
export function generateKeyPair(pass: string): GeneratedKeyPair {
  const passphrase = pass ?? process.env.ID_TOKEN_PASSPHRASE ?? randomBytes(32).toString('base64');
  const {publicKey, privateKey} = generateKeyPairSync('rsa', {
    modulusLength: 1024,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase,
    },
  });
  return {passphrase, publicKey, privateKey};
}
