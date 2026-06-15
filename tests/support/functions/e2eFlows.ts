import { Browser, Page } from '@playwright/test';
import { orderData } from '../fixtures/authData.ts';
import { CartPage } from '../elements/cartPage.ts';
import { MainPage } from '../elements/mainPage.ts';

// Adds the first two products to the cart.
export async function addTwoProductsToCart(mainPage: MainPage): Promise<CartPage> {
  const productsPage = await mainPage.navigateToProductsPage();

  await productsPage.addProductToCartByIndex(0);
  await productsPage.continueShopping();
  await productsPage.addProductToCartByIndex(1);
  return productsPage.openCartFromModal();
}

// Registers a regular test user from the login page.
export async function registerUserFromLogin(mainPage: MainPage): Promise<MainPage> {
  const loginPage = await mainPage.navigateToLoginPage();

  await loginPage.signup();
  return loginPage.registerUser();
}

// Completes checkout and optionally downloads invoice.
export async function finishOrder(cartPage: CartPage, downloadInvoice = false): Promise<void> {
  const checkoutPage = await cartPage.proceedToCheckout();

  await checkoutPage.verifyCheckoutPage();
  const paymentPage = await checkoutPage.placeOrder(orderData.comment);
  await paymentPage.fillPaymentDetails();
  await paymentPage.payAndConfirmOrder();

  if (downloadInvoice) {
    await paymentPage.downloadInvoice();
    await paymentPage.continueAfterOrder();
  }
}

// Blocks ad requests that make UI tests unstable.
export async function blockAds(page: Page): Promise<void> {
  await page.route('**/*', (route) => {
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
}

// Creates reusable login user through UI.
export async function createLoginUserThroughUi(browser: Browser): Promise<void> {
  const page = await browser.newPage();
  await blockAds(page);

  const mainPage = new MainPage(page);
  await mainPage.openMainPage();
  await deleteLoginUserFromMainPage(mainPage);

  await mainPage.openMainPage();
  const loginPage = await mainPage.navigateToLoginPage();
  await loginPage.signupLoginUser();
  await loginPage.registerLoginUser();
  await page.close();
}

// Deletes reusable login user through UI.
export async function deleteLoginUserThroughUi(browser: Browser): Promise<void> {
  const page = await browser.newPage();
  await blockAds(page);

  const mainPage = new MainPage(page);
  await mainPage.openMainPage();
  await deleteLoginUserFromMainPage(mainPage);
  await page.close();
}

// Logs in and deletes user if it exists.
async function deleteLoginUserFromMainPage(mainPage: MainPage): Promise<void> {
  const loginPage = await mainPage.navigateToLoginPage();
  await loginPage.login();
  await mainPage.deleteAccountIfLoggedIn();
}
