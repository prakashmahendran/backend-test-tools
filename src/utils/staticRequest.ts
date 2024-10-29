// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Application } from 'express';
import supertest from 'supertest';

/**
 * Get a pre-configured generator for an express instance that uses STATIC client key authentication
 * @param app Express app
 * @param method Method in which the requests will be made
 * @param endpoint PAth of the endpoint where the requests are to be made
 * @return - Supertest instance with STATIC Authorization
 */
export function staticRequest(
  app: Application,
  method: string,
  endpoint: string
) {
  return async function request(): supertest.Request {
    return supertest(app) [method](endpoint)
      .set('Authorization', `Bearer ${process.env.STATIC_TOKEN as string}`);
  };
}
