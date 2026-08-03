import { createUniqueEmail } from './users.ts';
import type { UserCredentials } from './users.ts';

export const apiSearchData = {
  productName: 'top',
} as const;

export function getInvalidApiLoginData(): UserCredentials {
  return {
    email: createUniqueEmail('invalid-api-user'),
    password: 'invalid-api-password',
  };
}
