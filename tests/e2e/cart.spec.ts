import { cartProductData, productSearchData } from '../support/data/products.ts';
import { createSubscriptionEmail } from '../support/data/users.ts';
import { addFirstTwoProductsToCart } from '../support/flows/e2eFlows.ts';
import { test } from '../support/fixtures/uiTest.ts';

const firstTwoProducts = [cartProductData.firstProduct, cartProductData.secondProduct] as const;

test.describe('Cart', () => {
  test('11. Subscribe from the cart page', async ({ homePage }) => {
    const cartPage = await homePage.openCartPage();

    await cartPage.shouldBeOpened();
    await cartPage.shouldShowSubscription();
    await cartPage.subscribe(createSubscriptionEmail('cart-subscription'));
  });

  test('12. Add two products to the cart', { tag: '@smoke' }, async ({ homePage }) => {
    const cartPage = await addFirstTwoProductsToCart(homePage, firstTwoProducts);

    await cartPage.shouldBeOpened();
    await cartPage.shouldShowProducts(firstTwoProducts);
  });

  test('13. Keep a selected product quantity', async ({ homePage }) => {
    const productsPage = await homePage.openProductsPage();

    await productsPage.addFirstProductWithQuantity(4);
    const cartPage = await productsPage.openCartFromModal();

    await cartPage.shouldShowProductQuantity(cartProductData.firstProduct.id, '4');
  });

  test('17. Remove a product from the cart', async ({ homePage }) => {
    const cartPage = await addFirstTwoProductsToCart(homePage, firstTwoProducts);

    await cartPage.shouldBeOpened();
    await cartPage.removeProductById(cartProductData.firstProduct.id);
  });

  test('20. Keep searched products in the cart after login', async ({ homePage, registeredUser }) => {
    const productsPage = await homePage.openProductsPage();

    await productsPage.shouldBeOpened();
    await productsPage.search(productSearchData.productName);
    await productsPage.shouldShowSearchResults(productSearchData.productName);
    const { cartPage, product } = await productsPage.addFirstSearchedProductToCart();

    await cartPage.shouldShowProduct(product);
    const loginPage = await cartPage.openLoginPage();
    const loggedInHomePage = await loginPage.login(registeredUser);

    await loggedInHomePage.shouldShowLoggedInUser(registeredUser.name);
    const cartPageAfterLogin = await loggedInHomePage.openCartPage();
    await cartPageAfterLogin.shouldShowProduct(product);
  });
});
