import { test } from '@playwright/test';
import { MainPage } from '../support/pages/mainPage.ts';
import {
  addFirstTwoProductsToCart,
  blockThirdPartyAds,
  completeOrder,
  createReusableLoginUser,
  deleteReusableLoginUser,
  registerUserFromLogin,
} from '../support/flows/e2eFlows.ts';

test.describe('Automation Exercise UI tests', () => {
  let mainPage: MainPage;

  test.beforeAll(async ({ request }) => {
    await createReusableLoginUser(request);
  });

  test.afterAll(async ({ request }) => {
    await deleteReusableLoginUser(request);
  });

  test.beforeEach(async ({ page }) => {
    await blockThirdPartyAds(page);

    mainPage = new MainPage(page);
    await mainPage.open();
  });

  // Checks that a new user can register and remove the account.
  test('@smoke @regression Test Case 1: Register user and delete user after test', async () => {
    const loginPage = await mainPage.openLoginPage();
    const registeredMainPage = await loginPage.registerNewUser();

    await registeredMainPage.deleteAccount();
  });

  // Checks that an existing user can log in successfully.
  test('@smoke @regression Test Case 2: Login User with correct email and password', async () => {
    const loginPage = await mainPage.openLoginPage();
    const loggedInMainPage = await loginPage.loginAsValidUser();

    await loggedInMainPage.shouldShowLoginUser();
  });

  // Checks that invalid login credentials show a validation error.
  test('@regression Test Case 3: Login User with incorrect email and password', async () => {
    const loginPage = await mainPage.openLoginPage();

    await loginPage.loginWithInvalidCredentialsShouldFail();
  });

  // Checks that a logged-in user can log out.
  test('@regression Test Case 4: Logout User', async () => {
    const loginPage = await mainPage.openLoginPage();
    const loggedInMainPage = await loginPage.loginAsValidUser();
    const loginPageAfterLogout = await loggedInMainPage.logout();

    await loginPageAfterLogout.shouldBeOpened();
  });

  // Checks that duplicate signup emails are rejected.
  test('@regression Test Case 5: Register User with existing email', async () => {
    const loginPage = await mainPage.openLoginPage();

    await loginPage.registerWithExistingEmailShouldFail();
  });

  // Checks that the contact form accepts valid feedback.
  test('@regression Test Case 6: Contact Us Form', async () => {
    const contactUsPage = await mainPage.openContactUsPage();

    await contactUsPage.submitContactForm();
  });

  // Checks that the Test Cases page opens from navigation.
  test('@regression Test Case 7: Verify Test Cases Page', async () => {
    await mainPage.shouldBeOpened();
    await mainPage.openTestCasesPage();
    await mainPage.shouldShowTestCasesPage();
  });

  // Checks that products list and first product details are visible.
  test('@smoke @regression Test Case 8: Verify All Products and product detail page', async () => {
    await mainPage.shouldBeOpened();
    const productsPage = await mainPage.openProductsPage();

    await productsPage.shouldBeOpened();
    await productsPage.shouldShowProductsList();
    await productsPage.openFirstProductDetails();
    await productsPage.shouldShowFirstProductDetails();
  });

  // Checks that product search returns matching catalog items.
  test('@smoke @regression Test Case 9: Search Product', async () => {
    await mainPage.shouldBeOpened();
    const productsPage = await mainPage.openProductsPage();

    await productsPage.shouldBeOpened();
    await productsPage.searchDefaultProduct();
    await productsPage.shouldShowDefaultSearchResults();
  });

  // Checks subscription from the home page footer.
  test('@regression Test Case 10: Verify Subscription in home page', async () => {
    await mainPage.shouldBeOpened();
    await mainPage.shouldShowSubscription();
    await mainPage.subscribeWithDefaultEmail();
  });

  // Checks subscription from the cart page footer.
  test('@regression Test Case 11: Verify Subscription in Cart page', async () => {
    await mainPage.shouldBeOpened();
    const cartPage = await mainPage.openCartPage();

    await cartPage.shouldBeOpened();
    await cartPage.shouldShowSubscription();
    await cartPage.subscribeWithDefaultEmail();
  });

  // Checks that two products can be added to the cart.
  test('@smoke @regression Test Case 12: Add Products in Cart', async () => {
    await mainPage.shouldBeOpened();
    const cartPage = await addFirstTwoProductsToCart(mainPage);

    await cartPage.shouldBeOpened();
    await cartPage.shouldShowFirstTwoProducts();
  });

  // Checks that a custom product quantity is saved in the cart.
  test('@regression Test Case 13: Verify Product quantity in Cart', async () => {
    await mainPage.shouldBeOpened();
    const productsPage = await mainPage.openProductsPage();

    await productsPage.addFirstProductWithQuantity(4);
    const cartPage = await productsPage.openCartFromModal();

    await cartPage.shouldShowProductQuantity(1, '4');
  });

  // Checks checkout when registration starts from the checkout modal.
  test('@regression Test Case 14: Place Order: Register while Checkout', async () => {
    await mainPage.shouldBeOpened();
    let cartPage = await addFirstTwoProductsToCart(mainPage);

    await cartPage.shouldBeOpened();
    await cartPage.proceedToCheckoutAndOpenRegistration();
    const registeredMainPage = await registerUserFromLogin(mainPage);

    await registeredMainPage.shouldShowRegistrationUser();
    cartPage = await registeredMainPage.openCartPage();
    await completeOrder(cartPage);
    await registeredMainPage.deleteAccount();
  });

  // Checks checkout when registration is completed before adding products.
  test('@regression Test Case 15: Place Order: Register before Checkout', async () => {
    await mainPage.shouldBeOpened();
    const registeredMainPage = await registerUserFromLogin(mainPage);

    await registeredMainPage.shouldShowRegistrationUser();
    const cartPage = await addFirstTwoProductsToCart(registeredMainPage);

    await cartPage.shouldBeOpened();
    await completeOrder(cartPage);
    await registeredMainPage.deleteAccount();
  });

  // Checks checkout when an existing user logs in before adding products.
  test('@regression Test Case 16: Place Order: Login before Checkout', async () => {
    await mainPage.shouldBeOpened();
    const loginPage = await mainPage.openLoginPage();
    const loggedInMainPage = await loginPage.loginAsValidUser();

    await loggedInMainPage.shouldShowLoginUser();
    const cartPage = await addFirstTwoProductsToCart(loggedInMainPage);

    await cartPage.shouldBeOpened();
    await completeOrder(cartPage);
  });

  // Checks that a product can be removed from the cart.
  test('@regression Test Case 17: Remove Products From Cart', async () => {
    await mainPage.shouldBeOpened();
    const cartPage = await addFirstTwoProductsToCart(mainPage);

    await cartPage.shouldBeOpened();
    await cartPage.removeProductById(1);
  });

  // Checks navigation through product categories.
  test('@regression Test Case 18: View Category Products', async () => {
    await mainPage.shouldShowCategories();
    await mainPage.openWomenDressCategory();
    await mainPage.openMenTshirtsCategory();
  });

  // Checks navigation through brand product pages.
  test('@regression Test Case 19: View & Cart Brand Products', async () => {
    const productsPage = await mainPage.openProductsPage();

    await productsPage.shouldShowBrands();
    await productsPage.openPoloBrand();
    await productsPage.openHmBrand();
  });

  // Checks that searched cart items remain visible after login.
  test('@regression Test Case 20: Search Products and Verify Cart After Login', async () => {
    const productsPage = await mainPage.openProductsPage();

    await productsPage.shouldBeOpened();
    await productsPage.searchDefaultProduct();
    await productsPage.shouldShowDefaultSearchResults();
    let cartPage = await productsPage.addFirstSearchedProductToCart();

    await cartPage.shouldShowAnyProduct();
    const loginPage = await mainPage.openLoginPage();
    const loggedInMainPage = await loginPage.loginAsValidUser();

    cartPage = await loggedInMainPage.openCartPage();
    await cartPage.shouldShowAnyProduct();
  });

  // Checks that a product review can be submitted.
  test('@regression Test Case 21: Add review on product', async () => {
    const productsPage = await mainPage.openProductsPage();

    await productsPage.shouldBeOpened();
    await productsPage.openFirstProductDetails();
    await productsPage.shouldShowWriteReviewForm();
    await productsPage.submitDefaultReview();
  });

  // Checks adding a product from the recommended items carousel.
  test('@regression Test Case 22: Add to cart from Recommended items', async () => {
    await mainPage.shouldShowRecommendedItems();
    const cartPage = await mainPage.addRecommendedProductToCart();

    await cartPage.shouldShowAnyProduct();
  });

  // Checks registered address details on the checkout page.
  test('@regression Test Case 23: Verify address details in checkout page', async () => {
    await mainPage.shouldBeOpened();
    const registeredMainPage = await registerUserFromLogin(mainPage);

    await registeredMainPage.shouldShowRegistrationUser();
    const cartPage = await addFirstTwoProductsToCart(registeredMainPage);

    await cartPage.shouldBeOpened();
    const checkoutPage = await cartPage.proceedToCheckout();

    await checkoutPage.shouldBeOpened();
    await checkoutPage.shouldShowRegisteredAddressDetails();
    await registeredMainPage.deleteAccount();
  });

  // Checks invoice download after a completed order.
  test('@regression Test Case 24: Download Invoice after purchase order', async () => {
    await mainPage.shouldBeOpened();
    let cartPage = await addFirstTwoProductsToCart(mainPage);

    await cartPage.shouldBeOpened();
    await cartPage.proceedToCheckoutAndOpenRegistration();
    const registeredMainPage = await registerUserFromLogin(mainPage);

    await registeredMainPage.shouldShowRegistrationUser();
    cartPage = await registeredMainPage.openCartPage();
    await completeOrder(cartPage, true);
    await registeredMainPage.deleteAccount();
  });

  // Checks scrolling back to the top with the arrow button.
  test("@regression Test Case 25: Verify Scroll Up using 'Arrow' button and Scroll Down functionality", async () => {
    await mainPage.shouldBeOpened();
    await mainPage.scrollToFooter();
    await mainPage.shouldShowSubscription();
    await mainPage.scrollUpWithArrow();
  });

  // Checks scrolling back to the top without using the arrow button.
  test("@regression Test Case 26: Verify Scroll Up without 'Arrow' button and Scroll Down functionality", async () => {
    await mainPage.shouldBeOpened();
    await mainPage.scrollToFooter();
    await mainPage.shouldShowSubscription();
    await mainPage.scrollUpManually();
  });
});
