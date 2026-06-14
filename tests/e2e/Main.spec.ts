import { Browser, expect, Page, test } from '@playwright/test';
import {
  orderData,
  productSearchData,
  registrationData,
  reviewData,
  subscriptionData,
  validLoginData,
} from '../support/fixtures/authData.ts';
import { MainPage } from '../support/elements/mainPage.ts';
import { CartPage } from '../support/elements/cartPage.ts';

async function addTwoProductsToCart(mainPage: MainPage): Promise<CartPage> {
  const productsPage = await mainPage.navigateToProductsPage();

  await productsPage.addProductToCartByIndex(0);
  await productsPage.continueShopping();
  await productsPage.addProductToCartByIndex(1);
  return productsPage.openCartFromModal();
}

async function registerUserFromLogin(mainPage: MainPage): Promise<MainPage> {
  const loginPage = await mainPage.navigateToLoginPage();

  await loginPage.signup();
  return loginPage.registerUser();
}

async function finishOrder(cartPage: CartPage, downloadInvoice = false): Promise<void> {
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

async function blockAds(page: Page): Promise<void> {
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

async function createLoginUserThroughUi(browser: Browser): Promise<void> {
  const page = await browser.newPage();
  await blockAds(page);
  await page.goto('/');
  await page.getByRole('link', { name: ' Signup / Login' }).click();
  await page.locator('[data-qa="signup-name"]').fill(validLoginData.validUsername);
  await page.locator('[data-qa="signup-email"]').fill(validLoginData.validEmail);
  await page.locator('[data-qa="signup-button"]').click();
  await page.locator('#id_gender1').click();
  await page.locator('[data-qa="password"]').fill(validLoginData.validPassword);
  await page.locator('[data-qa="days"]').selectOption('1');
  await page.locator('[data-qa="months"]').selectOption('January');
  await page.locator('[data-qa="years"]').selectOption('2001');
  await page.locator('[data-qa="first_name"]').fill('Luke');
  await page.locator('[data-qa="last_name"]').fill('Skywalker');
  await page.locator('[data-qa="company"]').fill('Rebellion Inc.');
  await page.locator('[data-qa="address"]').fill('123 Test St');
  await page.locator('[data-qa="address2"]').fill('Apt 4B');
  await page.locator('[data-qa="country"]').selectOption('Israel');
  await page.locator('[data-qa="state"]').fill('Israel');
  await page.locator('[data-qa="city"]').fill('Jerusalem');
  await page.locator('[data-qa="zipcode"]').fill('12345');
  await page.locator('[data-qa="mobile_number"]').fill('+1234567890');
  await page.locator('[data-qa="create-account"]').click();
  await expect(page.locator('[data-qa="account-created"]')).toBeVisible();
  await page.locator('[data-qa="continue-button"]').click();
  await page.close();
}

async function deleteLoginUserThroughUi(browser: Browser): Promise<void> {
  const page = await browser.newPage();
  await blockAds(page);
  await page.goto('/');
  await page.getByRole('link', { name: ' Signup / Login' }).click();
  await page.locator('[data-qa="login-email"]').fill(validLoginData.validEmail);
  await page.locator('[data-qa="login-password"]').fill(validLoginData.validPassword);
  await page.locator('[data-qa="login-button"]').click();

  if (await page.locator('a[href="/delete_account"]').isVisible()) {
    await page.locator('a[href="/delete_account"]').click();
    await page.locator('[data-qa="continue-button"]').click();
  }

  await page.close();
}

test.describe('Main page taskbar UI tests', () => {
  let mainPage: MainPage;

  test.beforeAll(async ({ browser }) => {
    await createLoginUserThroughUi(browser);
  });

  test.afterAll(async ({ browser }) => {
    await deleteLoginUserThroughUi(browser);
  });

  test.beforeEach(async ({ page }) => {
    await blockAds(page);

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
  test('Test Case 7: Verify Test Cases Page', async ({ page }) => {
    const mainPage = new MainPage(page);

    await mainPage.verifyHomePageVisible();
    await mainPage.navigateToTestCasesPage();
    await mainPage.verifyTestCasesPage();
  });
  test('Test Case 8: Verify All Products and product detail page', async ({ page }) => {
    const mainPage = new MainPage(page);

    await mainPage.verifyHomePageVisible();
    const productsPage = await mainPage.navigateToProductsPage();
    await productsPage.verifyAllProductsPage();
    await productsPage.verifyProductsListVisible();
    await productsPage.openFirstProductDetails();
    await productsPage.verifyProductDetailsVisible();
  });
  test('Test Case 9: Search Product', async ({ page }) => {
    const mainPage = new MainPage(page);

    await mainPage.verifyHomePageVisible();
    const productsPage = await mainPage.navigateToProductsPage();
    await productsPage.verifyAllProductsPage();
    await productsPage.searchProduct(productSearchData.productName);
    await productsPage.verifySearchedProductsVisible(productSearchData.productName);
  });
  test('Test Case 10: Verify Subscription in home page', async ({ page }) => {
    const mainPage = new MainPage(page);

    await mainPage.verifyHomePageVisible();
    await mainPage.verifySubscription();
    await mainPage.subscribe(subscriptionData.email);
  });
  test('Test Case 11: Verify Subscription in Cart page', async ({ page }) => {
    const mainPage = new MainPage(page);

    await mainPage.verifyHomePageVisible();
    const cartPage = await mainPage.navigateToCartPage();
    await cartPage.verifyCartPage();
    await cartPage.verifySubscription();
    await cartPage.subscribe(subscriptionData.email);
  });
  test('Test Case 12: Add Products in Cart', async ({ page }) => {
    const mainPage = new MainPage(page);

    await mainPage.verifyHomePageVisible();
    const productsPage = await mainPage.navigateToProductsPage();
    await productsPage.addProductToCartByIndex(0);
    await productsPage.continueShopping();
    await productsPage.addProductToCartByIndex(1);
    const cartPage = await productsPage.openCartFromModal();
    await cartPage.verifyCartPage();
    await cartPage.verifyProductInCart(1, 'Blue Top', 'Rs. 500', '1', 'Rs. 500');
    await cartPage.verifyProductInCart(2, 'Men Tshirt', 'Rs. 400', '1', 'Rs. 400');
  });
  test('Test Case 13: Verify Product quantity in Cart', async ({ page }) => {
    const mainPage = new MainPage(page);

    await mainPage.verifyHomePageVisible();
    const productsPage = await mainPage.navigateToProductsPage();
    await productsPage.addProductToCart(4);
    const cartPage = await productsPage.openCartFromModal();
    await cartPage.verifyProductQuantity(1, '4');
  });
  test('Test Case 14: Place Order: Register while Checkout', async ({ page }) => {
    const mainPage = new MainPage(page);

    await mainPage.verifyHomePageVisible();
    let cartPage = await addTwoProductsToCart(mainPage);
    await cartPage.verifyCartPage();
    await cartPage.proceedToCheckoutAndRegister();
    await registerUserFromLogin(mainPage);
    await mainPage.verifyLoggedInAs(registrationData.registrationName);
    cartPage = await mainPage.navigateToCartPage();
    await finishOrder(cartPage);
    await mainPage.deleteAccount();
  });
  test('Test Case 15: Place Order: Register before Checkout', async ({ page }) => {
    const mainPage = new MainPage(page);

    await mainPage.verifyHomePageVisible();
    await registerUserFromLogin(mainPage);
    await mainPage.verifyLoggedInAs(registrationData.registrationName);
    const cartPage = await addTwoProductsToCart(mainPage);
    await cartPage.verifyCartPage();
    await finishOrder(cartPage);
    await mainPage.deleteAccount();
  });
  test('Test Case 16: Place Order: Login before Checkout', async ({ page }) => {
    const mainPage = new MainPage(page);

    await mainPage.verifyHomePageVisible();
    const loginPage = await mainPage.navigateToLoginPage();
    await loginPage.login();
    await mainPage.verifyLoggedInAs(validLoginData.validUsername);
    const cartPage = await addTwoProductsToCart(mainPage);
    await cartPage.verifyCartPage();
    await finishOrder(cartPage);
  });
  test('Test Case 17: Remove Products From Cart', async ({ page }) => {
    const mainPage = new MainPage(page);

    await mainPage.verifyHomePageVisible();
    const cartPage = await addTwoProductsToCart(mainPage);
    await cartPage.verifyCartPage();
    await cartPage.removeProduct(1);
  });
  test('Test Case 18: View Category Products', async ({ page }) => {
    const mainPage = new MainPage(page);

    await mainPage.verifyCategoriesVisible();
    await mainPage.openWomenDressCategory();
    await mainPage.openMenTshirtsCategory();
  });
  test('Test Case 19: View & Cart Brand Products', async ({ page }) => {
    const mainPage = new MainPage(page);

    const productsPage = await mainPage.navigateToProductsPage();
    await productsPage.verifyBrandsVisible();
    await productsPage.openBrand('Polo');
    await productsPage.openBrand('H&M');
  });
  test('Test Case 20: Search Products and Verify Cart After Login', async ({ page }) => {
    const mainPage = new MainPage(page);

    const productsPage = await mainPage.navigateToProductsPage();
    await productsPage.verifyAllProductsPage();
    await productsPage.searchProduct(productSearchData.productName);
    await productsPage.verifySearchedProductsVisible(productSearchData.productName);
    let cartPage = await productsPage.addFirstSearchedProductToCart();
    await cartPage.verifyAnyProductVisible();
    const loginPage = await mainPage.navigateToLoginPage();
    await loginPage.login();
    cartPage = await mainPage.navigateToCartPage();
    await cartPage.verifyAnyProductVisible();
  });
  test('Test Case 21: Add review on product', async ({ page }) => {
    const mainPage = new MainPage(page);

    const productsPage = await mainPage.navigateToProductsPage();
    await productsPage.verifyAllProductsPage();
    await productsPage.openFirstProductDetails();
    await productsPage.verifyWriteReviewVisible();
    await productsPage.submitReview(reviewData.name, reviewData.email, reviewData.review);
  });
  test('Test Case 22: Add to cart from Recommended items', async ({ page }) => {
    const mainPage = new MainPage(page);

    await mainPage.verifyRecommendedItemsVisible();
    const cartPage = await mainPage.addRecommendedProductToCart();
    await cartPage.verifyAnyProductVisible();
  });
  test('Test Case 23: Verify address details in checkout page', async ({ page }) => {
    const mainPage = new MainPage(page);

    await mainPage.verifyHomePageVisible();
    await registerUserFromLogin(mainPage);
    await mainPage.verifyLoggedInAs(registrationData.registrationName);
    const cartPage = await addTwoProductsToCart(mainPage);
    await cartPage.verifyCartPage();
    const checkoutPage = await cartPage.proceedToCheckout();
    await checkoutPage.verifyCheckoutPage();
    await checkoutPage.verifyRegisteredAddressDetails();
    await mainPage.deleteAccount();
  });
  test('Test Case 24: Download Invoice after purchase order', async ({ page }) => {
    const mainPage = new MainPage(page);

    await mainPage.verifyHomePageVisible();
    let cartPage = await addTwoProductsToCart(mainPage);
    await cartPage.verifyCartPage();
    await cartPage.proceedToCheckoutAndRegister();
    await registerUserFromLogin(mainPage);
    await mainPage.verifyLoggedInAs(registrationData.registrationName);
    cartPage = await mainPage.navigateToCartPage();
    await finishOrder(cartPage, true);
    await mainPage.deleteAccount();
  });
  test("Test Case 25: Verify Scroll Up using 'Arrow' button and Scroll Down functionality", async ({ page }) => {
    const mainPage = new MainPage(page);

    await mainPage.verifyHomePageVisible();
    await mainPage.scrollToBottom();
    await mainPage.verifySubscription();
    await mainPage.scrollUpWithArrow();
  });
  test("Test Case 26: Verify Scroll Up without 'Arrow' button and Scroll Down functionality", async ({ page }) => {
    const mainPage = new MainPage(page);

    await mainPage.verifyHomePageVisible();
    await mainPage.scrollToBottom();
    await mainPage.verifySubscription();
    await mainPage.scrollUpManually();
  });
});
