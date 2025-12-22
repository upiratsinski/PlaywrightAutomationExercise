import { test, expect } from '@playwright/test';
import { validLogin, invalidLogin } from '../support/functions/loginPageFunc';
import { openMainPage } from '../support/functions/mainPageFunc';
import { validLoginData, invalidLoginData } from '../support/fixtures/authData';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await openMainPage(page);
    await page.getByRole('button', { name: 'Consent' }).click();
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
