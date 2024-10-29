import {pki} from 'node-forge';

export const baseAttributes: Array<pki.CertificateField> = [
  {
    name: 'countryName',
    value: 'TW',
  },
  {
    shortName: 'ST',
    value: 'Taipei',
  },
  {
    name: 'localityName',
    value: 'Taipei',
  },
  {
    name: 'organizationName',
    value: 'Self',
  },
  {
    shortName: 'OU',
    value: 'Self',
  },
];

export const caAttributes: Array<pki.CertificateField> = [
  {
    name: 'commonName',
    value: 'root',
  },
  ...baseAttributes,
];

export const serverAttributes: Array<pki.CertificateField> = [
  {
    name: 'commonName',
    value: 'server',
  },
  ...baseAttributes,
];

export const clientAttributes: Array<pki.CertificateField> = [
  {
    name: 'commonName',
    value: 'client',
  },
  ...baseAttributes,
];
