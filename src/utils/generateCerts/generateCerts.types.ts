import {pki} from 'node-forge';

/** Options ot generate fake certificates */
export interface generateCertsOptions {
  /** Indicates that we should generate a CA certificate */
  ca?: boolean;
  /** Certificate issue information */
  issuer?: Array<pki.CertificateField>;
  /** Private key to use to sign the certificate */
  key?: pki.rsa.PrivateKey;
}

/** Fake certificate generated */
export interface GeneratedCertificate {
  /** PEM certificate */
  cert: string;
  /** Private key to use with the certificate */
  privateKey: pki.rsa.PrivateKey;
  /** PEM encoding of the private key */
  privateKeyPem: string;
}
