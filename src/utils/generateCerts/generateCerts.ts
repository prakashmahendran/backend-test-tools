import fs from 'fs';
import path from 'path';
import {pki, md} from 'node-forge';
import {caAttributes, clientAttributes, serverAttributes} from './generateCerts.const';
import {generateCertsOptions, GeneratedCertificate} from './generateCerts.types';

let serialNumber = 1;

const dir = path.resolve('certs');

/** Generate a certificate and a private key */
export function generateCerts(
  attributes: Array<pki.CertificateField>,
  options: generateCertsOptions = {},
): GeneratedCertificate {
  const keys = pki.rsa.generateKeyPair(2048);
  const cert = pki.createCertificate();
  cert.publicKey = keys.publicKey;
  const serial = `00${serialNumber.toString()}`;
  cert.serialNumber = serial.substr(serial.length - 2);
  serialNumber++;
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
  cert.setSubject(attributes);
  cert.setIssuer(options.issuer ?? attributes);
  cert.setExtensions(getExtensions(options));
  cert.sign(options.key ?? keys.privateKey, md.sha256.create());
  return {
    cert: pki.certificateToPem(cert),
    privateKey: keys.privateKey,
    privateKeyPem: pki.privateKeyToPem(keys.privateKey),
  };
}

/**
 * Generate a CA certificate as well as a client and a server private key and certificate
 * These will be stored in the $ROOT/certs directoryA
 */
export function generatePkiEnvironment(): void {
  const ca = generateCerts(caAttributes, {ca: true});
  const client = generateCerts(clientAttributes, {key: ca.privateKey, issuer: caAttributes});
  const server = generateCerts(serverAttributes, {key: ca.privateKey, issuer: caAttributes});

  // Create directory if it does not exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.writeFileSync(path.resolve(dir, 'ca.crt'), ca.cert);
  fs.writeFileSync(path.resolve(dir, 'ca.key'), ca.privateKeyPem);
  fs.writeFileSync(path.resolve(dir, 'client.crt'), client.cert);
  fs.writeFileSync(path.resolve(dir, 'client.key'), client.privateKeyPem);
  fs.writeFileSync(path.resolve(dir, 'server.crt'), server.cert);
  fs.writeFileSync(path.resolve(dir, 'server.key'), server.privateKeyPem);
}

/** Get the best fitting extensions for the certificate to generate */
function getExtensions(options: generateCertsOptions = {}): Array<unknown> {
  return [
    {
      name: 'basicConstraints',
      cA: options.ca === true,
    },
    {
      name: 'keyUsage',
      keyCertSign: true,
      digitalSignature: true,
      nonRepudiation: true,
      keyEncipherment: true,
      dataEncipherment: true,
    },
    {
      name: 'extKeyUsage',
      serverAuth: true,
      clientAuth: true,
      codeSigning: true,
      emailProtection: true,
      timeStamping: true,
    },
    {
      name: 'nsCertType',
      client: true,
      server: true,
      email: true,
      objsign: true,
      sslCA: true,
      emailCA: true,
      objCA: true,
    },
    {
      name: 'subjectAltName',
      altNames: [
        {
          type: 2,
          value: 'localhost',
        },
        {
          type: 7,
          ip: '127.0.0.1',
        },
      ],
    },
    {
      name: 'subjectKeyIdentifier',
    },
  ];
}
