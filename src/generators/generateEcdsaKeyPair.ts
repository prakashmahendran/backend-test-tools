import {generateKeyPairSync} from 'crypto';
import {writeFileSync, existsSync, mkdirSync} from 'fs';
import {resolve} from 'path';

/** Generate a signature key pair for ECDSA */
export function generateEcdsaKeyPair(): void {
  const DIR = resolve('certs');
  if (!existsSync(DIR)) mkdirSync(DIR);
  const {privateKey, publicKey} = generateKeyPairSync('ec', {
    namedCurve: 'prime256v1',
    privateKeyEncoding: {type: 'pkcs8', format: 'pem'},
    publicKeyEncoding: {type: 'spki', format: 'pem'},
  });
  writeFileSync(`${DIR}/ecdsa.key`, privateKey);
  writeFileSync(`${DIR}/ecdsa.key.pub`, publicKey);
}
