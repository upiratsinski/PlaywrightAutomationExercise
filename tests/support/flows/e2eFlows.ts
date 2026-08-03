import { test, type Page } from '@playwright/test';
import type { OrderDetails } from '../data/checkout.ts';
import type { ProductReference } from '../data/products.ts';
import type { TestUser } from '../data/users.ts';
import type { CartPage } from '../pages/cartPage.ts';
import type { MainPage } from '../pages/mainPage.ts';
import type { PaymentPage } from '../pages/paymentPage.ts';

const AD_HOST_SUFFIXES = ['doubleclick.net', 'googlesyndication.com', 'googleadservices.com'];
const AD_HOSTS = new Set(['adservice.google.com']);

export async function addFirstTwoProductsToCart(
  mainPage: MainPage,
  products: readonly [ProductReference, ProductReference],
): Promise<CartPage> {
  return test.step('Add the first two products to the cart', async () => {
    const productsPage = await mainPage.openProductsPage();

    await productsPage.addProductToCart(products[0]);
    await productsPage.continueShopping();
    await productsPage.addProductToCart(products[1]);
    return productsPage.openCartFromModal();
  });
}

export async function registerUserFromLogin(mainPage: MainPage, user: TestUser): Promise<MainPage> {
  return test.step('Register a user', async () => {
    const loginPage = await mainPage.openLoginPage();
    return loginPage.register(user);
  });
}

export async function completeOrder(cartPage: CartPage, order: OrderDetails): Promise<PaymentPage> {
  return test.step('Complete checkout', async () => {
    const checkoutPage = await cartPage.proceedToCheckout();

    await checkoutPage.shouldBeOpened();
    const paymentPage = await checkoutPage.placeOrder(order.comment);
    await paymentPage.fillPaymentDetails(order.payment);
    await paymentPage.pay();
    await paymentPage.shouldShowSuccessfulOrder();
    return paymentPage;
  });
}

export async function blockThirdPartyAds(page: Page): Promise<void> {
  await page.route('**/*', async (route) => {
    const hostname = new URL(route.request().url()).hostname;
    const isKnownAdHost =
      AD_HOSTS.has(hostname) ||
      AD_HOST_SUFFIXES.some((suffix) => hostname === suffix || hostname.endsWith(`.${suffix}`));

    if (isKnownAdHost) {
      await route.abort();
      return;
    }

    await route.continue();
  });
}
