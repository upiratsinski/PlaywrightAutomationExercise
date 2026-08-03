import { createOrderData } from '../support/data/checkout.ts';
import { cartProductData } from '../support/data/products.ts';
import { addFirstTwoProductsToCart, completeOrder, registerUserFromLogin } from '../support/flows/e2eFlows.ts';
import { test } from '../support/fixtures/uiTest.ts';

const firstTwoProducts = [cartProductData.firstProduct, cartProductData.secondProduct] as const;

test.describe('Checkout', { tag: '@regression' }, () => {
  test('14. Register while checking out', async ({ generatedUser, mainPage }) => {
    let cartPage = await addFirstTwoProductsToCart(mainPage, firstTwoProducts);

    await cartPage.shouldBeOpened();
    const loginPage = await cartPage.proceedToCheckoutAndOpenRegistration();
    const registeredMainPage = await loginPage.register(generatedUser);

    await registeredMainPage.shouldShowLoggedInUser(generatedUser.name);
    cartPage = await registeredMainPage.openCartPage();
    await completeOrder(cartPage, createOrderData());
    await registeredMainPage.deleteAccount();
  });

  test('15. Register before checking out', async ({ generatedUser, mainPage }) => {
    const registeredMainPage = await registerUserFromLogin(mainPage, generatedUser);

    await registeredMainPage.shouldShowLoggedInUser(generatedUser.name);
    const cartPage = await addFirstTwoProductsToCart(registeredMainPage, firstTwoProducts);

    await cartPage.shouldBeOpened();
    await completeOrder(cartPage, createOrderData());
    await registeredMainPage.deleteAccount();
  });

  test('16. Login before checking out', async ({ mainPage, registeredUser }) => {
    const loginPage = await mainPage.openLoginPage();
    const loggedInMainPage = await loginPage.login(registeredUser);

    await loggedInMainPage.shouldShowLoggedInUser(registeredUser.name);
    const cartPage = await addFirstTwoProductsToCart(loggedInMainPage, firstTwoProducts);

    await cartPage.shouldBeOpened();
    await completeOrder(cartPage, createOrderData());
  });

  test('23. Show the registered checkout address', async ({ generatedUser, mainPage }) => {
    const registeredMainPage = await registerUserFromLogin(mainPage, generatedUser);

    await registeredMainPage.shouldShowLoggedInUser(generatedUser.name);
    const cartPage = await addFirstTwoProductsToCart(registeredMainPage, firstTwoProducts);

    await cartPage.shouldBeOpened();
    const checkoutPage = await cartPage.proceedToCheckout();

    await checkoutPage.shouldBeOpened();
    await checkoutPage.shouldShowRegisteredAddressDetails(generatedUser);
    await registeredMainPage.deleteAccount();
  });

  test('24. Download an invoice after an order', async ({ generatedUser, mainPage }) => {
    let cartPage = await addFirstTwoProductsToCart(mainPage, firstTwoProducts);

    await cartPage.shouldBeOpened();
    const loginPage = await cartPage.proceedToCheckoutAndOpenRegistration();
    const registeredMainPage = await loginPage.register(generatedUser);

    await registeredMainPage.shouldShowLoggedInUser(generatedUser.name);
    cartPage = await registeredMainPage.openCartPage();
    const paymentPage = await completeOrder(cartPage, createOrderData());

    await paymentPage.downloadInvoiceShouldHaveCorrectName();
    const mainPageAfterOrder = await paymentPage.continueAfterOrder();
    await mainPageAfterOrder.deleteAccount();
  });
});
