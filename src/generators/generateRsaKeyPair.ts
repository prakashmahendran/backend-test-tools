import {writeFileSync, mkdirSync, existsSync} from 'fs';
import path from 'path';
import {generateKeyPair} from './generateKeyPair';

/** Generate a RSA key pair and store it under "{cwd}/certs/rsa.*" */
export function generateRsaKeyPair(passphrase: string): void {
  const DIR = path.resolve('certs');
  if (!existsSync(DIR)) mkdirSync(DIR);
  const {publicKey, privateKey} = generateKeyPair(passphrase);
  writeFileSync(`${DIR}/rsa.key`, privateKey);
  writeFileSync(`${DIR}/rsa.pub.key`, publicKey);
}
