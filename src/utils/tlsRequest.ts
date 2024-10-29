import fs from 'fs';
import {agent, Request} from 'supertest';
import {tlsRequestOptions} from './tlsRequest.types';

const customAgent = agent(`https://localhost:${process.env.PORT as string}`);

let settings: tlsRequestOptions;

/**
 * Wrapper for supertest that adds TLS encryption
 */
export async function tlsRequest(options: tlsRequestOptions = {}): Promise<Request> {
  if (!settings) loadDefaultSettings();
  const ca = options.ca ? fs.readFileSync(options.ca, 'utf-8') : settings.ca;
  const key = options.key ? fs.readFileSync(options.key, 'utf-8') : settings.key;
  const cert = options.cert ? fs.readFileSync(options.cert, 'utf-8') : settings.cert;
  if (!ca || !key || !cert) throw new Error('Missing some TLS configuration');
  return customAgent.ca(ca).key(key).cert(cert);
}

/** Load TLS settings from env variables */
function loadDefaultSettings(): void {
  const {
    TLS_REQUEST_KEY,
    TLS_REQUEST_CERT,
    TLS_REQUEST_CA,
    TLS_SERVER_KEY,
    TLS_SERVER_CERT,
    TLS_CA,
  } = process.env;

  if (!(TLS_REQUEST_KEY || TLS_SERVER_KEY)) {
    throw new Error('TLS Request: no TLS setting specified');
  }

  settings = {
    key: fs.readFileSync((TLS_REQUEST_KEY ?? TLS_SERVER_KEY) as string, 'utf-8'),
    cert: fs.readFileSync((TLS_REQUEST_CERT ?? TLS_SERVER_CERT) as string, 'utf-8'),
    ca: fs.readFileSync((TLS_REQUEST_CA ?? TLS_CA) as string, 'utf-8'),
  };
}
