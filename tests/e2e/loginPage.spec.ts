import { test, expect } from '@playwright/test';
import { validLogin, invalidLogin } from '../support/functions/loginPageFunc.js';
import { openMainPage } from '../support/functions/mainPageFunc.js';
import {
  validLoginData,
  invalidLoginData,
  registrationData,
} from '../support/fixtures/authData.ts';
import { registerUser } from '../support/functions/registrationPageFunc.js';
import { signUpUser } from '../support/functions/registrationPageFunc.js';

test.describe('Login Page Tests', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.route('**/*', (route) => {
      const url = route.request().url();

      if (
        url.includes('googleads') ||
        url.includes('doubleclick') ||
        url.includes('googlesyndication') ||
        url.includes('adservice')
      ) {
        return route.abort();
      }

      return route.continue();
    });

    await openMainPage(page);
  });

  test('Test Case 1: Register user and delete it afterwards', async ({ page }) => {
    await signUpUser(page, registrationData);
    await registerUser(page, registrationData);

    await test.step('Check user is logged in after registration', async () => {
      await expect(
        page.getByText(`Logged in as ${registrationData.registrationName}`),
      ).toBeVisible();
    });

    await test.step('Delete the logged-in user', async () => {
      await page.click('a[href="/delete_account"]');
      await expect(page.getByText('ACCOUNT DELETED!')).toBeVisible();
      await page.click('a[data-qa="continue-button"]');
    });
  });

  test('Test Case 2: Login User with correct email and password', async ({ page }) => {
    await validLogin(page, validLoginData);

    await test.step('Check successful login', async () => {
      await expect(page.getByText('Logged in as')).toBeVisible();
    });
  });

  test('Test Case 3: Login User with incorrect email and password', async ({ page }) => {
    await invalidLogin(page, invalidLoginData);

    await test.step('Check error message for invalid login', async () => {
      await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();
    });
  });

  test('Test Case 4: Logout User', async ({ page }) => {
    await validLogin(page, validLoginData);

    await test.step('Logout the user and verify redirection to login page', async () => {
      await page.getByRole('link', { name: ' Logout' }).click();
      await expect(page).toHaveURL('https://automationexercise.com/login');
    });
  });
});
