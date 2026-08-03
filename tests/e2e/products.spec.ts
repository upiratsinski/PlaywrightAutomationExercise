import { brandData, createReviewData, productSearchData } from '../support/data/products.ts';
import { test } from '../support/fixtures/uiTest.ts';

test.describe('Products', { tag: '@regression' }, () => {
  test('8. Show the products list and product details', { tag: '@smoke' }, async ({ mainPage }) => {
    await mainPage.shouldBeOpened();
    const productsPage = await mainPage.openProductsPage();

    await productsPage.shouldBeOpened();
    await productsPage.shouldShowProductsList();
    await productsPage.openFirstProductDetails();
    await productsPage.shouldShowFirstProductDetails();
  });

  test('9. Search for products', { tag: '@smoke' }, async ({ mainPage }) => {
    const productsPage = await mainPage.openProductsPage();

    await productsPage.shouldBeOpened();
    await productsPage.search(productSearchData.productName);
    await productsPage.shouldShowSearchResults(productSearchData.productName);
  });

  test('18. Browse products by category', async ({ mainPage }) => {
    await mainPage.shouldShowCategories();
    await mainPage.openWomenDressCategory();
    await mainPage.openMenTshirtsCategory();
  });

  test('19. Browse products by brand', async ({ mainPage }) => {
    const productsPage = await mainPage.openProductsPage();

    await productsPage.shouldShowBrands();
    await productsPage.openBrand(brandData.firstBrand);
    await productsPage.shouldShowBrand(brandData.firstBrand);
    await productsPage.openBrand(brandData.secondBrand);
    await productsPage.shouldShowBrand(brandData.secondBrand);
  });

  test('21. Submit a product review', async ({ mainPage }) => {
    const productsPage = await mainPage.openProductsPage();

    await productsPage.shouldBeOpened();
    await productsPage.openFirstProductDetails();
    await productsPage.shouldShowWriteReviewForm();
    await productsPage.submitReview(createReviewData());
    await productsPage.shouldShowReviewSubmitted();
  });

  test('22. Add a recommended product to the cart', async ({ mainPage }) => {
    await mainPage.shouldShowRecommendedItems();
    const cartPage = await mainPage.addRecommendedProductToCart();

    await cartPage.shouldShowAnyProduct();
  });
});
