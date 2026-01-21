import { test, expect } from '@playwright/test';
import { mainPageElements } from '../support/elements/mainPageUI';
import {
  openMainPage,
  checkElementsVisability,
  checkElementsText,
  checkElementsHrefAttribute,
} from '../support/functions/mainPageFunc';
import { fillContactUsForm } from '../support/functions/contactUsPageFunc.ts';
import { validLoginData } from '../support/fixtures/authData.ts';

test.describe('Main page taskbar UI tests', () => {
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

  test('Header layout test', async ({ page }) => {
    await checkElementsVisability(page, mainPageElements);
  });

  test('Name header layout test', async ({ page }) => {
    await checkElementsText(page, mainPageElements);
  });

  test('Attributes check test', async ({ page }) => {
    await checkElementsHrefAttribute(page, mainPageElements);
  });

  //   test('Test Case 6: Contact Us Form', async ({ page }) => {
  //     await page.click('a[href="/contact_us"]');
  //     await expect(page.getByText('Get In Touch')).toBeVisible();
  //     await fillContactUsForm(page, validLoginData);
  //   });
});
