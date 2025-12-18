import { test, expect } from '../fixtures/mainPage';
import { MainPage } from '../models/MainPage';

// let mainPage: MainPage;

test.describe('Main page tests', () => {
  // test.beforeEach(async ({ page }) => {
  //   mainPage = new MainPage(page);
  //   await mainPage.openMainPage();
  // });

  test('Header layout test', async ({ mainPage }) => {
    await mainPage.checkElementsVisability();
  });

  test('Name header layout test', async ({ mainPage }) => {
    await mainPage.checkElementsText();
  });

  test('Attributes check test', async ({ mainPage }) => {
    await mainPage.checkElementsHrefAttribute();
  });

  test('Light mode switcher test', async ({ mainPage }) => {
    await test.step('Press of icon light mode switcher', async () => {
      await mainPage.clickSwitchLightModeIcon();
    });
    await test.step('Check of attribute value change', async () => {
      await mainPage.checkDataThemeAttributeValue();
    });
  });

  test('Check for light mode style', async ({ mainPage }) => {
    await test.step('Setting light mode', async () => {
      await mainPage.setLightMode();
    });
    await test.step('Check of Layout With Light Mode', async () => {
      await mainPage.checkLayoutWithLightMode();
    });
  });
  test('Check for dark mode style', async ({ mainPage }) => {
    await test.step('Setting dark mode', async () => {
      await mainPage.setDarkMode();
    });
    await test.step('Check of Layout With Dark Mode', async () => {
      await mainPage.checkLayoutWithDarkMode();
    });
  });
});
