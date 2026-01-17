import { test, expect } from '@playwright/test';
import { validLogin, invalidLogin } from '../support/functions/loginPageFunc.js';
import { openMainPage } from '../support/functions/mainPageFunc.js';
import { validLoginData, invalidLoginData } from '../support/fixtures/authData.js';
import { registerUser } from '../support/functions/registrationPageFunc.js';
import { signUpUser } from '../support/functions/registrationPageFunc.js';
import { registrationData } from '../support/fixtures/registrationData.js';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await openMainPage(page);
    await page.getByRole('button', { name: 'Consent' }).click();
  });

  test.beforeEach(async ({ context }) => {
    await context.route('**/*', (route) => {
      const url = route.request().url();

      if (
        url.includes('googleads') ||
        url.includes('doubleclick') ||
        url.includes('googlesyndication')
      ) {
        return route.abort();
      }

      route.continue();
    });
  });

  test('Register user test', async ({ page }) => {
    await signUpUser(page, registrationData);
    await registerUser(page, registrationData);
    await test.step('Check user is logged in after registration', async () => {
      await expect(
        page.getByText(`Logged in as ${registrationData.registrationName}`),
      ).toBeVisible();
    });
  });

  test('Valid login test', async ({ page }) => {
    await validLogin(page, validLoginData);
    await test.step('Check successful login', async () => {
      await expect(page.getByText('Logged in as')).toBeVisible();
    });
  });

  test('Invalid login test', async ({ page }) => {
    await invalidLogin(page, invalidLoginData);
    await test.step('Check error message for invalid login', async () => {
      await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();
    });
  });
});
