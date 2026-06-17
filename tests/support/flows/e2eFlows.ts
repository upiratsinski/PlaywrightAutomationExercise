import { Browser, Page } from '@playwright/test';
import { CartPage } from '../pages/cartPage.ts';
import { MainPage } from '../pages/mainPage.ts';
import { orderData } from '../data/authData.ts';
import { logAction } from '../utils/logger.ts';

export async function addFirstTwoProductsToCart(mainPage: MainPage): Promise<CartPage> {
  const productsPage = await mainPage.openProductsPage();

  await productsPage.addProductToCartByIndex(0);
  await productsPage.continueShopping();
  await productsPage.addProductToCartByIndex(1);
  return productsPage.openCartFromModal();
}

export async function registerUserFromLogin(mainPage: MainPage): Promise<MainPage> {
  const loginPage = await mainPage.openLoginPage();

  return loginPage.registerNewUser();
}

export async function completeOrder(cartPage: CartPage, shouldDownloadInvoice = false): Promise<void> {
  const checkoutPage = await cartPage.proceedToCheckout();

  await checkoutPage.shouldBeOpened();
  const paymentPage = await checkoutPage.placeOrder(orderData.comment);
  await paymentPage.fillPaymentDetails();
  await paymentPage.payAndShouldConfirmOrder();

  if (shouldDownloadInvoice) {
    await paymentPage.downloadInvoiceShouldHaveCorrectName();
    await paymentPage.continueAfterOrder();
  }
}

// Third-party ads occasionally cover controls on the demo site, so UI tests block only known ad hosts.
export async function blockThirdPartyAds(page: Page): Promise<void> {
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

export async function createReusableLoginUser(browser: Browser): Promise<void> {
  logAction('prepare reusable UI login user');
  const page = await browser.newPage();

  try {
    await blockThirdPartyAds(page);

    const mainPage = new MainPage(page);
    await mainPage.open();
    await deleteLoginUserFromMainPage(mainPage);

    await mainPage.open();
    const loginPage = await mainPage.openLoginPage();
    await loginPage.registerReusableLoginUser();
  } finally {
    await page.close();
  }
}

export async function deleteReusableLoginUser(browser: Browser): Promise<void> {
  logAction('delete reusable UI login user');
  const page = await browser.newPage();

  try {
    await blockThirdPartyAds(page);

    const mainPage = new MainPage(page);
    await mainPage.open();
    await deleteLoginUserFromMainPage(mainPage);
  } finally {
    await page.close();
  }
}

async function deleteLoginUserFromMainPage(mainPage: MainPage): Promise<void> {
  const loginPage = await mainPage.openLoginPage();
  const loggedInMainPage = await loginPage.loginAsValidUser();

  await loggedInMainPage.deleteAccountIfLoggedIn();
}
