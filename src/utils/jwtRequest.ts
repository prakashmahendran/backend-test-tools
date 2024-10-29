 
 
 
 
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import supertest from 'supertest';
import {getBearer} from './getBearer';

/**
 * Get a pre-configured generator for an express instance that uses JWT authentication
 * @param {Object} app Express app
 * @param {String} method Method in which the requests will be made
 * @param {String} endpoint PAth of the endpoint where the requests are to be made
 * @return {Function} - Supertest instance with JWT Authorization
 */
export function jwtRequest(app, method, endpoint) {
  /**
   * @param {Object} user User making the request
   * @return {Object} Pre-configured supertest instance
   */
  return async function request(userId: string): supertest.Request {
    return supertest(app)[method](endpoint).set('Authorization', getBearer(userId));
  };
}
