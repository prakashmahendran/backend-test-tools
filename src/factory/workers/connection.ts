import {randomUUID} from 'crypto';
import { faker } from '@faker-js/faker';
import {ConnectionBuildOptions, ConnectionModel} from './connection.types';

/** Create a random connection */
export function connectionFactoryWorker(
  buildOptions: ConnectionBuildOptions = {},
): ConnectionModel {
  const accepted = buildOptions.accepted ?? true;
  const blocked = buildOptions.blocked ?? false;
  return {
    ownerId: randomUUID(),
    otherUserId: randomUUID(),
    accepted,
    acceptedAt: accepted ? faker.date.recent() : undefined,
    blocked,
    blockedAt: blocked ? faker.date.recent() : undefined,
    initiator: true,
    message: faker.lorem.sentence(),
    note: faker.lorem.sentence(),
  };
}
