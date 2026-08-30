import { expect, test as base, type Page } from '@playwright/test';
import { AutomationExerciseApiClient } from '../api/automationExerciseApiClient.ts';
import { createTestUser, toApiUser } from '../data/users.ts';
import { HomePage } from '../pages/homePage.ts';
import type { TestUser } from '../data/users.ts';

const AD_URL_PATTERN =
  /^https?:\/\/(?:(?:[^./]+\.)*(?:doubleclick\.net|googlesyndication\.com|googleadservices\.com)|adservice\.google\.com)(?=[:/])/i;

interface UiFixtures {
  blockAds: void;
  generatedUser: TestUser;
  homePage: HomePage;
  registeredUser: TestUser;
}

async function blockThirdPartyAds(page: Page): Promise<void> {
  await page.route(AD_URL_PATTERN, (route) => route.abort());
}

async function deleteUiUserStrict(apiClient: AutomationExerciseApiClient, user: TestUser): Promise<void> {
  const response = await apiClient.deleteAccount(user.email, user.password);

  expect(response.httpStatus, 'UI account cleanup transport status').toBe(200);

  if (response.body.responseCode === 200) {
    expect(response.body.message).toBe('Account deleted!');
    return;
  }

  expect(response.body.responseCode).toBe(404);
  expect(response.body.message).toBe('Account not found!');
}

export const test = base.extend<UiFixtures>({
  blockAds: [
    async ({ page }, use) => {
      await blockThirdPartyAds(page);
      await use();
    },
    { auto: true },
  ],

  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);

    await homePage.open();
    await use(homePage);
  },

  generatedUser: async ({ request }, use, testInfo) => {
    const user = createTestUser(`ui-r${testInfo.retry}`);
    const apiClient = new AutomationExerciseApiClient(request);

    try {
      await use(user);
    } finally {
      await deleteUiUserStrict(apiClient, user);
    }
  },

  registeredUser: async ({ generatedUser, request }, use) => {
    const apiClient = new AutomationExerciseApiClient(request);
    const response = await apiClient.createAccount(toApiUser(generatedUser));

    expect(response.httpStatus, 'UI account setup transport status').toBe(200);
    expect(response.body.responseCode, 'UI account setup responseCode').toBe(201);
    expect(response.body.message).toBe('User created!');
    await use(generatedUser);
  },
});

export { expect };
