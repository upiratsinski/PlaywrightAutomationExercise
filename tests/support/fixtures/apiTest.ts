import { expect, test as base } from '@playwright/test';
import { AutomationExerciseApiClient } from '../api/automationExerciseApiClient.ts';
import { createApiUser } from '../data/users.ts';
import type { ApiUser } from '../data/users.ts';

interface ApiFixtures {
  apiClient: AutomationExerciseApiClient;
  generatedApiUser: ApiUser;
  registeredApiUser: ApiUser;
}

async function deleteApiUserStrict(apiClient: AutomationExerciseApiClient, user: ApiUser): Promise<void> {
  const response = await apiClient.deleteAccount(user.email, user.password);

  expect(response.httpStatus, 'Account cleanup transport status').toBe(200);
  expect([200, 404], 'Account cleanup responseCode').toContain(response.body.responseCode);

  if (response.body.responseCode === 200) {
    expect(response.body.message).toBe('Account deleted!');
    return;
  }

  expect(response.body.responseCode).toBe(404);
  expect(response.body.message).toBe('Account not found!');
}

export const test = base.extend<ApiFixtures>({
  apiClient: async ({ request }, use) => {
    await use(new AutomationExerciseApiClient(request));
  },

  generatedApiUser: async ({ apiClient }, use) => {
    const user = createApiUser('api-generated');

    try {
      await use(user);
    } finally {
      await deleteApiUserStrict(apiClient, user);
    }
  },

  registeredApiUser: async ({ apiClient }, use) => {
    const user = createApiUser('api-registered');

    try {
      const createResponse = await apiClient.createAccount(user);

      expect(createResponse.httpStatus, 'Account setup transport status').toBe(200);
      expect(createResponse.body.responseCode, 'Account setup responseCode').toBe(201);
      expect(createResponse.body.message).toBe('User created!');
      await use(user);
    } finally {
      await deleteApiUserStrict(apiClient, user);
    }
  },
});

export { expect };
