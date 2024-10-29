/** Options for TLS requester */
export interface tlsRequestOptions {
  /** CA certificate used to validate the server */
  ca?: string;
  /** Key used to sign the requests */
  key?: string;
  /** Certificate to expose to the server */
  cert?: string;
}
