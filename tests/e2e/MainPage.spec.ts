import { test } from '@playwright/test';
import { mainPageElements } from '../support/elements/mainPageUI';
import {
  openMainPage,
  checkElementsVisability,
  checkElementsText,
  checkElementsHrefAttribute,
} from '../support/functions/mainPageFunc';

test.describe('Main page tests', () => {
  test.beforeEach(async ({ page }) => {
    await openMainPage(page);
    await page.getByRole('button', { name: 'Consent' }).click();
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
});
