import {SignOptions} from 'jsonwebtoken';
import {generateAccessToken} from 'generators';

/** Generate Bearer Token authorization header */
export function getBearer(
  userId: string,
  options: SignOptions = {},
  payload: string | object | Buffer = {},
): string {
  return `Bearer ${generateAccessToken(userId, options, payload)}`;
}
