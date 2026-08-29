import { expect, test as base, type Page } from '@playwright/test';
import { AutomationExerciseApiClient } from '../api/automationExerciseApiClient.ts';
import { createTestUser, toApiUser } from '../data/users.ts';
import { MainPage } from '../pages/mainPage.ts';
import type { TestUser } from '../data/users.ts';

const AD_HOST_SUFFIXES = ['doubleclick.net', 'googlesyndication.com', 'googleadservices.com'];
const AD_HOSTS = new Set(['adservice.google.com']);

interface UiFixtures {
  blockAds: void;
  generatedUser: TestUser;
  mainPage: MainPage;
  registeredUser: TestUser;
}

async function blockThirdPartyAds(page: Page): Promise<void> {
  await page.route('**/*', async (route) => {
    const hostname = new URL(route.request().url()).hostname;
    const isKnownAdHost =
      AD_HOSTS.has(hostname) ||
      AD_HOST_SUFFIXES.some((suffix) => hostname === suffix || hostname.endsWith(`.${suffix}`));

    if (isKnownAdHost) {
      await route.abort();
      return;
    }

    await route.continue();
  });
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

  mainPage: async ({ page }, use) => {
    const mainPage = new MainPage(page);

    await mainPage.open();
    await use(mainPage);
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
