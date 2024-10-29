import { randomUUID } from 'crypto';
import { faker } from '@faker-js/faker';
import { UserModel, UserBuildOptions } from './user.types';
import {
  generateRegId,
  generateLocale,
  generateSignKeyPub,
  generateSignKeyEncrypted,
  generateBbEncrypted
} from 'generators';

/**
 * Create a random user
 */
export function userFactoryWorker(
  buildOptions: UserBuildOptions = {}
): UserModel {
  const firstName = buildOptions.firstName ?? faker.person.firstName();
  const lastName = buildOptions.lastName ?? faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName });
  const userName = faker.internet.userName({ firstName, lastName });
  const random = Math.random().toString(36).substring(7);
  const organizationId = buildOptions.organizationId;
  const organizationMember = buildOptions.member ?? false;
  const organizationAdmin = buildOptions.admin ?? false;
  return {
    firstName,
    lastName,
    firstNameLastName: `${firstName}${lastName}`,
    firstNameSpaceLastName: `${firstName} ${lastName}`,
    lastNameFirstName: `${lastName}${firstName}`,
    lastNameSpaceFirstName: `${lastName} ${firstName}`,
    displayName: `${firstName} ${lastName}`,
    casualName: `${firstName}`,
    formalName: `${firstName}`,
    email: buildOptions.moreRandom ? `${random}${email}` : email,
    username: buildOptions.moreRandom ? `${random}${userName}` : userName,
    regId: generateRegId(),
    locale: generateLocale(),
    pictureUrl: faker.image.avatar(),
    organizationId,
    joinedOrganizationAt: organizationId ? faker.date.recent() : null,
    organizationAdmin: organizationAdmin,
    requestedToJoinOrganization: organizationMember || organizationAdmin,
    acceptedInOrganization: organizationMember || organizationAdmin,
    linkId: randomUUID(),
    bbId: randomUUID(),
    bbEncrypted: generateBbEncrypted(),
    signKeyEncrypted: generateSignKeyEncrypted(),
    signKeyPub: generateSignKeyPub(),
    autoConnect: true,
    searchable: true,
    enableUrlScan: true,
    enableMessageTranslation: true,
    emailVisibility: true
  };
}
