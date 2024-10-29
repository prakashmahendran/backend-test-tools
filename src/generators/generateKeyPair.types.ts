/** Key pair that was generated */
export interface GeneratedKeyPair {
  /** PAssphrase used to encrypt the private key */
  passphrase: string;
  /** Public key generated, PEM encoded */
  publicKey: string;
  /** Private key generated, PEM encoded */
  privateKey: string;
}
