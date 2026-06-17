import { APIRequestContext, Page } from '@playwright/test';
import { CartPage } from '../pages/cartPage.ts';
import { MainPage } from '../pages/mainPage.ts';
import { loginUserProfileData, orderData, validLoginData } from '../data/authData.ts';
import { logAction } from '../utils/logger.ts';

// Adds the first two catalog products and opens the cart from the modal.
export async function addFirstTwoProductsToCart(mainPage: MainPage): Promise<CartPage> {
  const productsPage = await mainPage.openProductsPage();

  await productsPage.addProductToCartByIndex(0);
  await productsPage.continueShopping();
  await productsPage.addProductToCartByIndex(1);
  return productsPage.openCartFromModal();
}

// Registers a fresh UI user from the login page.
export async function registerUserFromLogin(mainPage: MainPage): Promise<MainPage> {
  const loginPage = await mainPage.openLoginPage();

  return loginPage.registerNewUser();
}

// Completes checkout and optionally checks invoice download.
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

// Blocks known ad hosts because third-party ads occasionally cover controls on the demo site.
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

// Creates the reusable login user through API to keep UI setup fast and stable.
export async function createReusableLoginUser(request: APIRequestContext): Promise<void> {
  logAction('prepare reusable UI login user through API');
  await deleteReusableLoginUser(request);

  const body = await sendCreateLoginUserRequest(request);

  if (body.responseCode !== 201) {
    throw new Error(`Reusable UI user was not created. API response code: ${body.responseCode}`);
  }
}

// Deletes the reusable login user through API; 404 is fine when setup failed early.
export async function deleteReusableLoginUser(request: APIRequestContext): Promise<void> {
  logAction('delete reusable UI login user through API');
  const response = await request.delete('/api/deleteAccount', {
    form: {
      email: validLoginData.email,
      password: validLoginData.password,
    },
  });
  const body = await parseApiResponse(response);

  if (![200, 404].includes(body.responseCode)) {
    throw new Error(`Reusable UI user was not deleted. API response code: ${body.responseCode}`);
  }
}

async function sendCreateLoginUserRequest(request: APIRequestContext): Promise<{ responseCode: number }> {
  const response = await request.post('/api/createAccount', {
    form: {
      name: validLoginData.username,
      email: validLoginData.email,
      password: validLoginData.password,
      title: 'Mr',
      birth_date: loginUserProfileData.birthDay,
      birth_month: loginUserProfileData.birthMonth,
      birth_year: loginUserProfileData.birthYear,
      firstname: loginUserProfileData.firstName,
      lastname: loginUserProfileData.lastName,
      company: loginUserProfileData.company,
      address1: loginUserProfileData.address1,
      address2: loginUserProfileData.address2,
      country: loginUserProfileData.country,
      zipcode: loginUserProfileData.zipCode,
      state: loginUserProfileData.state,
      city: loginUserProfileData.city,
      mobile_number: loginUserProfileData.mobileNumber,
    },
  });

  return parseApiResponse(response);
}

async function parseApiResponse(response: { text(): Promise<string> }): Promise<{ responseCode: number }> {
  return JSON.parse(await response.text()) as { responseCode: number };
}
