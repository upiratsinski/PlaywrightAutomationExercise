import { cartProductData, productSearchData } from '../support/data/products.ts';
import { createSubscriptionEmail } from '../support/data/users.ts';
import { addFirstTwoProductsToCart } from '../support/flows/e2eFlows.ts';
import { test } from '../support/fixtures/uiTest.ts';

const firstTwoProducts = [cartProductData.firstProduct, cartProductData.secondProduct] as const;

test.describe('Cart', { tag: '@regression' }, () => {
  test('11. Subscribe from the cart page', async ({ mainPage }) => {
    const cartPage = await mainPage.openCartPage();

    await cartPage.shouldBeOpened();
    await cartPage.shouldShowSubscription();
    await cartPage.subscribe(createSubscriptionEmail('cart-subscription'));
  });

  test('12. Add two products to the cart', { tag: '@smoke' }, async ({ mainPage }) => {
    const cartPage = await addFirstTwoProductsToCart(mainPage, firstTwoProducts);

    await cartPage.shouldBeOpened();
    await cartPage.shouldShowProducts(firstTwoProducts);
  });

  test('13. Keep a selected product quantity', async ({ mainPage }) => {
    const productsPage = await mainPage.openProductsPage();

    await productsPage.addFirstProductWithQuantity(4);
    const cartPage = await productsPage.openCartFromModal();

    await cartPage.shouldShowProductQuantity(cartProductData.firstProduct.id, '4');
  });

  test('17. Remove a product from the cart', async ({ mainPage }) => {
    const cartPage = await addFirstTwoProductsToCart(mainPage, firstTwoProducts);

    await cartPage.shouldBeOpened();
    await cartPage.removeProductById(cartProductData.firstProduct.id);
  });

  test('20. Keep searched products in the cart after login', async ({ mainPage, registeredUser }) => {
    const productsPage = await mainPage.openProductsPage();

    await productsPage.shouldBeOpened();
    await productsPage.search(productSearchData.productName);
    await productsPage.shouldShowSearchResults(productSearchData.productName);
    let cartPage = await productsPage.addFirstSearchedProductToCart();

    await cartPage.shouldShowAnyProduct();
    const loginPage = await cartPage.openLoginPage();
    const loggedInMainPage = await loginPage.login(registeredUser);

    await loggedInMainPage.shouldShowLoggedInUser(registeredUser.name);
    cartPage = await loggedInMainPage.openCartPage();
    await cartPage.shouldShowAnyProduct();
  });
});
