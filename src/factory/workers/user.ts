import { faker } from '@faker-js/faker';
import { UserModel, UserBuildOptions } from './user.types';
import {
  generateLocale,
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
  const random = Math.random().toString(36).substring(7);
  return {
    firstName,
    lastName,
    displayName: `${firstName} ${lastName}`,
    casualName: `${firstName}`,
    formalName: `${firstName}`,
    email: buildOptions.moreRandom ? `${random}${email}` : email,
    locale: generateLocale(),
    pictureUrl: faker.image.avatar(),
  };
}
