import { faker } from '@faker-js/faker';
import {OrganizationModel} from './organization.types';

/** Create a random organization */
export function organizationFactoryWorker(): OrganizationModel {
  return {
    name: faker.company.name(),
    territory: faker.address.countryCode(),
    description: faker.company.catchPhrase(),
    contactInfo: faker.address.streetAddress(),
    productsInfo: faker.company.catchPhrase(),
    avatarUrl: faker.internet.url(),
    coverUrl: faker.internet.url(),
    membersVisible: faker.datatype.boolean(),
    searchable: faker.datatype.boolean(),
    activities: [
      {
        id: faker.string.uuid(),
        translationKey: faker.lorem.word(),
      },
    ],
    members: [
      {
        id: faker.string.uuid(),
        organizationId: faker.string.uuid(),
        userId: faker.string.uuid(),
        requested: faker.datatype.boolean(),
        requestedAt: faker.date.recent(),
        invited: faker.datatype.boolean(),
        invitedAt: faker.date.recent(),
        admin: faker.datatype.boolean(),
      },
    ],
  };
}
