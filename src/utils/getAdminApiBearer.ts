import { faker } from '@faker-js/faker';
import {generateAccessToken} from 'generators';

/** Generate Admin api Bearer Token authorization header */
export function getAdminApiBearer(email: string, payload = {}): string {
  return `Bearer ${generateAccessToken(
    email,
    {
      audience: process.env.ADMIN_API_ACCESS_TOKEN_AUDIENCE,
      issuer: process.env.ADMIN_API_PUBLIC_URL,
    },
    {
      per: [faker.lorem.word(), faker.lorem.word()],
      ...payload,
    },
  )}`;
}
