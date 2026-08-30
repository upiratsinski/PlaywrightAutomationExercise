import { brandData, createReviewData, firstProductDetails, productSearchData } from '../support/data/products.ts';
import { test } from '../support/fixtures/uiTest.ts';

test.describe('Products', () => {
  test('8. Show the products list and product details', { tag: '@smoke' }, async ({ homePage }) => {
    await homePage.shouldBeOpened();
    const productsPage = await homePage.openProductsPage();

    await productsPage.shouldBeOpened();
    await productsPage.shouldShowProductsList();
    await productsPage.openFirstProductDetails();
    await productsPage.shouldShowProductDetails(firstProductDetails);
  });

  test('9. Search for products', { tag: '@smoke' }, async ({ homePage }) => {
    const productsPage = await homePage.openProductsPage();

    await productsPage.shouldBeOpened();
    await productsPage.search(productSearchData.productName);
    await productsPage.shouldShowSearchResults(productSearchData.productName);
  });

  test('18. Browse products by category', async ({ homePage }) => {
    await homePage.shouldShowCategories();
    await homePage.openWomenDressCategory();
    await homePage.openMenTshirtsCategory();
  });

  test('19. Browse products by brand', async ({ homePage }) => {
    const productsPage = await homePage.openProductsPage();

    await productsPage.shouldShowBrands();
    await productsPage.openBrand(brandData.firstBrand);
    await productsPage.shouldShowBrand(brandData.firstBrand);
    await productsPage.openBrand(brandData.secondBrand);
    await productsPage.shouldShowBrand(brandData.secondBrand);
  });

  test('21. Submit a product review', async ({ homePage }) => {
    const productsPage = await homePage.openProductsPage();

    await productsPage.shouldBeOpened();
    await productsPage.openFirstProductDetails();
    await productsPage.shouldShowWriteReviewForm();
    await productsPage.submitReview(createReviewData());
    await productsPage.shouldShowReviewSubmitted();
  });

  test('22. Add a recommended product to the cart', async ({ homePage }) => {
    await homePage.shouldShowRecommendedItems();
    const cartPage = await homePage.addRecommendedProductToCart();

    await cartPage.shouldShowAnyProduct();
  });
});
