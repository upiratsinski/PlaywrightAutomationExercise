import { test } from '@playwright/test';
import { MainPage } from '../support/elements/mainPage.ts';
import {
  addTwoProductsToCart,
  blockAds,
  createLoginUserThroughUi,
  deleteLoginUserThroughUi,
  finishOrder,
  registerUserFromLogin,
} from '../support/functions/e2eFlows.ts';

test.describe('Main page taskbar UI tests', () => {
  let mainPage: MainPage;

  // Creates a reusable login user before UI tests.
  test.beforeAll(async ({ browser }) => {
    await createLoginUserThroughUi(browser);
  });

  // Removes the reusable login user after UI tests.
  test.afterAll(async ({ browser }) => {
    await deleteLoginUserThroughUi(browser);
  });

  // Opens the home page before each UI test.
  test.beforeEach(async ({ page }) => {
    await blockAds(page);

    mainPage = new MainPage(page);
    await mainPage.openMainPage();
  });

  // Registers a new user and deletes it.
  test('Test Case 1: Register user and delete user after test', async () => {
    const loginPage = await mainPage.navigateToLoginPage();
    await loginPage.signup();
    await loginPage.registerUser();
    await loginPage.deleteUser();
  });
  // Logs in with valid credentials.
  test('Test Case 2: Login User with correct email and password', async () => {
    const loginPage = await mainPage.navigateToLoginPage();
    await loginPage.login();
  });
  // Checks invalid login error.
  test('Test Case 3: Login User with incorrect email and password', async () => {
    const loginPage = await mainPage.navigateToLoginPage();
    await loginPage.loginWithInvalidCredentials();
  });
  // Logs in and logs out.
  test('Test Case 4: Logout User', async () => {
    const loginPage = await mainPage.navigateToLoginPage();
    await loginPage.login();
    await mainPage.logout();
  });
  // Tries to register with an existing email.
  test('Test Case 5: Register User with existing email', async () => {
    const loginPage = await mainPage.navigateToLoginPage();
    await loginPage.signupWithExistingEmail();
  });
  // Fills and submits the contact form.
  test('Test Case 6: Contact Us Form', async () => {
    const contactUsPage = await mainPage.navigateToContactUsPage();
    await contactUsPage.fillContactUsForm();
    await contactUsPage.catchDialog();
  });
  // Opens and verifies the Test Cases page.
  test('Test Case 7: Verify Test Cases Page', async () => {
    await mainPage.verifyHomePageVisible();
    await mainPage.navigateToTestCasesPage();
    await mainPage.verifyTestCasesPage();
  });
  // Opens products and verifies product details.
  test('Test Case 8: Verify All Products and product detail page', async () => {
    await mainPage.verifyHomePageVisible();
    const productsPage = await mainPage.navigateToProductsPage();
    await productsPage.verifyAllProductsPage();
    await productsPage.verifyProductsListVisible();
    await productsPage.openFirstProductDetails();
    await productsPage.verifyProductDetailsVisible();
  });
  // Searches for a product and verifies results.
  test('Test Case 9: Search Product', async () => {
    await mainPage.verifyHomePageVisible();
    const productsPage = await mainPage.navigateToProductsPage();
    await productsPage.verifyAllProductsPage();
    await productsPage.searchDefaultProduct();
    await productsPage.verifyDefaultSearchedProductsVisible();
  });
  // Subscribes from the home page footer.
  test('Test Case 10: Verify Subscription in home page', async () => {
    await mainPage.verifyHomePageVisible();
    await mainPage.verifySubscription();
    await mainPage.subscribeWithDefaultEmail();
  });
  // Subscribes from the cart page footer.
  test('Test Case 11: Verify Subscription in Cart page', async () => {
    await mainPage.verifyHomePageVisible();
    const cartPage = await mainPage.navigateToCartPage();
    await cartPage.verifyCartPage();
    await cartPage.verifySubscription();
    await cartPage.subscribeWithDefaultEmail();
  });
  // Adds two products and verifies the cart.
  test('Test Case 12: Add Products in Cart', async () => {
    await mainPage.verifyHomePageVisible();
    const productsPage = await mainPage.navigateToProductsPage();
    await productsPage.addProductToCartByIndex(0);
    await productsPage.continueShopping();
    await productsPage.addProductToCartByIndex(1);
    const cartPage = await productsPage.openCartFromModal();
    await cartPage.verifyCartPage();
    await cartPage.verifyFirstTwoProductsInCart();
  });
  // Adds a product with custom quantity and verifies it in cart.
  test('Test Case 13: Verify Product quantity in Cart', async () => {
    await mainPage.verifyHomePageVisible();
    const productsPage = await mainPage.navigateToProductsPage();
    await productsPage.addProductToCart(4);
    const cartPage = await productsPage.openCartFromModal();
    await cartPage.verifyProductQuantity(1, '4');
  });
  // Registers during checkout and places an order.
  test('Test Case 14: Place Order: Register while Checkout', async () => {
    await mainPage.verifyHomePageVisible();
    let cartPage = await addTwoProductsToCart(mainPage);
    await cartPage.verifyCartPage();
    await cartPage.proceedToCheckoutAndRegister();
    await registerUserFromLogin(mainPage);
    await mainPage.verifyLoggedInAsRegistrationUser();
    cartPage = await mainPage.navigateToCartPage();
    await finishOrder(cartPage);
    await mainPage.deleteAccount();
  });
  // Registers before checkout and places an order.
  test('Test Case 15: Place Order: Register before Checkout', async () => {
    await mainPage.verifyHomePageVisible();
    await registerUserFromLogin(mainPage);
    await mainPage.verifyLoggedInAsRegistrationUser();
    const cartPage = await addTwoProductsToCart(mainPage);
    await cartPage.verifyCartPage();
    await finishOrder(cartPage);
    await mainPage.deleteAccount();
  });
  // Logs in before checkout and places an order.
  test('Test Case 16: Place Order: Login before Checkout', async () => {
    await mainPage.verifyHomePageVisible();
    const loginPage = await mainPage.navigateToLoginPage();
    await loginPage.login();
    await mainPage.verifyLoggedInAsLoginUser();
    const cartPage = await addTwoProductsToCart(mainPage);
    await cartPage.verifyCartPage();
    await finishOrder(cartPage);
  });
  // Removes a product from the cart.
  test('Test Case 17: Remove Products From Cart', async () => {
    await mainPage.verifyHomePageVisible();
    const cartPage = await addTwoProductsToCart(mainPage);
    await cartPage.verifyCartPage();
    await cartPage.removeProduct(1);
  });
  // Opens women and men category pages.
  test('Test Case 18: View Category Products', async () => {
    await mainPage.verifyCategoriesVisible();
    await mainPage.openWomenDressCategory();
    await mainPage.openMenTshirtsCategory();
  });
  // Opens brand product pages.
  test('Test Case 19: View & Cart Brand Products', async () => {
    const productsPage = await mainPage.navigateToProductsPage();
    await productsPage.verifyBrandsVisible();
    await productsPage.openPoloBrand();
    await productsPage.openHmBrand();
  });
  // Searches products and checks cart after login.
  test('Test Case 20: Search Products and Verify Cart After Login', async () => {
    const productsPage = await mainPage.navigateToProductsPage();
    await productsPage.verifyAllProductsPage();
    await productsPage.searchDefaultProduct();
    await productsPage.verifyDefaultSearchedProductsVisible();
    let cartPage = await productsPage.addFirstSearchedProductToCart();
    await cartPage.verifyAnyProductVisible();
    const loginPage = await mainPage.navigateToLoginPage();
    await loginPage.login();
    cartPage = await mainPage.navigateToCartPage();
    await cartPage.verifyAnyProductVisible();
  });
  // Adds a review to a product.
  test('Test Case 21: Add review on product', async () => {
    const productsPage = await mainPage.navigateToProductsPage();
    await productsPage.verifyAllProductsPage();
    await productsPage.openFirstProductDetails();
    await productsPage.verifyWriteReviewVisible();
    await productsPage.submitDefaultReview();
  });
  // Adds a recommended product to cart.
  test('Test Case 22: Add to cart from Recommended items', async () => {
    await mainPage.verifyRecommendedItemsVisible();
    const cartPage = await mainPage.addRecommendedProductToCart();
    await cartPage.verifyAnyProductVisible();
  });
  // Verifies checkout address details.
  test('Test Case 23: Verify address details in checkout page', async () => {
    await mainPage.verifyHomePageVisible();
    await registerUserFromLogin(mainPage);
    await mainPage.verifyLoggedInAsRegistrationUser();
    const cartPage = await addTwoProductsToCart(mainPage);
    await cartPage.verifyCartPage();
    const checkoutPage = await cartPage.proceedToCheckout();
    await checkoutPage.verifyCheckoutPage();
    await checkoutPage.verifyRegisteredAddressDetails();
    await mainPage.deleteAccount();
  });
  // Places an order and downloads invoice.
  test('Test Case 24: Download Invoice after purchase order', async () => {
    await mainPage.verifyHomePageVisible();
    let cartPage = await addTwoProductsToCart(mainPage);
    await cartPage.verifyCartPage();
    await cartPage.proceedToCheckoutAndRegister();
    await registerUserFromLogin(mainPage);
    await mainPage.verifyLoggedInAsRegistrationUser();
    cartPage = await mainPage.navigateToCartPage();
    await finishOrder(cartPage, true);
    await mainPage.deleteAccount();
  });
  // Scrolls down and back up using arrow button.
  test("Test Case 25: Verify Scroll Up using 'Arrow' button and Scroll Down functionality", async () => {
    await mainPage.verifyHomePageVisible();
    await mainPage.scrollToBottom();
    await mainPage.verifySubscription();
    await mainPage.scrollUpWithArrow();
  });
  // Scrolls down and back up without arrow button.
  test("Test Case 26: Verify Scroll Up without 'Arrow' button and Scroll Down functionality", async () => {
    await mainPage.verifyHomePageVisible();
    await mainPage.scrollToBottom();
    await mainPage.verifySubscription();
    await mainPage.scrollUpManually();
  });
});
