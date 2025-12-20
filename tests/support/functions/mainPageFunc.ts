import { expect, Page, Locator, test } from '@playwright/test';
import { mainPageElements, Element } from '../elements/mainPageUI';

export async function openMainPage(page: Page) {
  await page.goto('https://automationexercise.com/');
}

export async function checkElementsVisability(page: Page, elements: Element[]) {
  for (const { locator, name } of elements) {
    await test.step(`Check visibility of ${name}`, async () => {
      await expect.soft(locator(page)).toBeVisible();
    });
  }
}

export async function checkElementsText(page: Page, elements: Element[]) {
  for (const { locator, name, text } of elements) {
    if (text) {
      await test.step(`Check text of ${name}`, async () => {
        await expect(locator(page)).toContainText(text);
      });
    }
  }
}

export async function checkElementsHrefAttribute(page: Page, elements: Element[]) {
  for (const { locator, name, attribute } of elements) {
    if (attribute) {
      await test.step(`Check href of ${name}`, async () => {
        await expect(locator(page)).toHaveAttribute(attribute.type, attribute.value);
      });
    }
  }
}
