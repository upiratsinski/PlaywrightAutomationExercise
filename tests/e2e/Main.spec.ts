import { test, expect } from '@playwright/test';
import { registrationData, validLoginData } from '../support/fixtures/authData.ts';
import { ProductsPage } from '../support/elements/productsPage.ts';
import { CartPage } from '../support/elements/cartPage.ts';
import { MainPage } from '../support/elements/mainPage.ts';
import { LoginPage } from '../support/elements/loginPage.ts';

test.describe('Main page taskbar UI tests', () => {
  let mainPage: MainPage;

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

    mainPage = new MainPage(page);
    await mainPage.openMainPage();
  });

  test('Test Case 1: Register user and delete user after test', async ({ page }) => {
    const mainPage = new MainPage(page);
    const loginPage = await mainPage.navigateToLoginPage();
    await loginPage.signup();
    await loginPage.registerUser();
    await loginPage.deleteUser();
  });
  test('Test Case 2: Login User with correct email and password', async ({ page }) => {
    const mainPage = new MainPage(page);
    const loginPage = await mainPage.navigateToLoginPage();
    await loginPage.login();
  });
  test('Test Case 3: Login User with incorrect email and password', async ({ page }) => {
    const mainPage = new MainPage(page);
    const loginPage = await mainPage.navigateToLoginPage();
    await loginPage.loginWithInvalidCredentials();
  });
  test('Test Case 4: Logout User', async ({ page }) => {
    const mainPage = new MainPage(page);
    const loginPage = await mainPage.navigateToLoginPage();
    await loginPage.login();
    await mainPage.logout();
  });
  test('Test Case 5: Register User with existing email', async ({ page }) => {
    const mainPage = new MainPage(page);
    const loginPage = await mainPage.navigateToLoginPage();
    await loginPage.signupWithExistingEmail();
  });
  test('Test Case 6: Contact Us Form', async ({ page }) => {
    const mainPage = new MainPage(page);
    const contactUsPage = await mainPage.navigateToContactUsPage();
    await contactUsPage.fillContactUsForm();
    await contactUsPage.catchDialog();
  });
});
