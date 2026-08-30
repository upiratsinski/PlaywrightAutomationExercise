import { createOrderData } from '../support/data/checkout.ts';
import { cartProductData } from '../support/data/products.ts';
import { addFirstTwoProductsToCart, completeOrder, registerUserFromLogin } from '../support/flows/e2eFlows.ts';
import { test } from '../support/fixtures/uiTest.ts';

const firstTwoProducts = [cartProductData.firstProduct, cartProductData.secondProduct] as const;

test.describe('Checkout', () => {
  test('14. Register while checking out', async ({ generatedUser, homePage }) => {
    let cartPage = await addFirstTwoProductsToCart(homePage, firstTwoProducts);

    await cartPage.shouldBeOpened();
    const loginPage = await cartPage.proceedToCheckoutAndOpenRegistration();
    const registeredHomePage = await loginPage.register(generatedUser);

    await registeredHomePage.shouldShowLoggedInUser(generatedUser.name);
    cartPage = await registeredHomePage.openCartPage();
    await completeOrder(cartPage, createOrderData());
    await registeredHomePage.deleteAccount();
  });

  test('15. Register before checking out', async ({ generatedUser, homePage }) => {
    const registeredHomePage = await registerUserFromLogin(homePage, generatedUser);

    await registeredHomePage.shouldShowLoggedInUser(generatedUser.name);
    const cartPage = await addFirstTwoProductsToCart(registeredHomePage, firstTwoProducts);

    await cartPage.shouldBeOpened();
    await completeOrder(cartPage, createOrderData());
    await registeredHomePage.deleteAccount();
  });

  test('16. Login before checking out', async ({ homePage, registeredUser }) => {
    const loginPage = await homePage.openLoginPage();
    const loggedInHomePage = await loginPage.login(registeredUser);

    await loggedInHomePage.shouldShowLoggedInUser(registeredUser.name);
    const cartPage = await addFirstTwoProductsToCart(loggedInHomePage, firstTwoProducts);

    await cartPage.shouldBeOpened();
    await completeOrder(cartPage, createOrderData());
  });

  test('23. Show the registered checkout address', async ({ generatedUser, homePage }) => {
    const registeredHomePage = await registerUserFromLogin(homePage, generatedUser);

    await registeredHomePage.shouldShowLoggedInUser(generatedUser.name);
    const cartPage = await addFirstTwoProductsToCart(registeredHomePage, firstTwoProducts);

    await cartPage.shouldBeOpened();
    const checkoutPage = await cartPage.proceedToCheckout();

    await checkoutPage.shouldBeOpened();
    await checkoutPage.shouldShowRegisteredAddressDetails(generatedUser);
    await registeredHomePage.deleteAccount();
  });

  test('24. Download an invoice after an order', async ({ generatedUser, homePage }) => {
    let cartPage = await addFirstTwoProductsToCart(homePage, firstTwoProducts);

    await cartPage.shouldBeOpened();
    const loginPage = await cartPage.proceedToCheckoutAndOpenRegistration();
    const registeredHomePage = await loginPage.register(generatedUser);

    await registeredHomePage.shouldShowLoggedInUser(generatedUser.name);
    cartPage = await registeredHomePage.openCartPage();
    const paymentPage = await completeOrder(cartPage, createOrderData());

    await paymentPage.downloadInvoiceShouldHaveCorrectName();
    const homePageAfterOrder = await paymentPage.continueAfterOrder();
    await homePageAfterOrder.deleteAccount();
  });
});
