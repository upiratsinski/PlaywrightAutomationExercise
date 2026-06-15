import { expect, Page, Locator } from '@playwright/test';
import { CartPage } from './cartPage.ts';
import { brandData, productSearchData, reviewData } from '../fixtures/authData.ts';

export class ProductsPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locator for product items
  get firstProduct(): Locator {
    return this.page.locator('li > a[href="/product_details/1"]');
  }

  private get quantityInput(): Locator {
    return this.page.locator('#quantity');
  }

  private get productAddToCartBtn(): Locator {
    return this.page.locator('button.btn.btn-default.cart');
  }

  private get reviewNameInput(): Locator {
    return this.page.locator('#name');
  }

  private get reviewEmailInput(): Locator {
    return this.page.locator('#email');
  }

  private get reviewTextBox(): Locator {
    return this.page.locator('#review');
  }

  private get reviewBtn(): Locator {
    return this.page.locator('#button-review');
  }

  private get cartBtn(): Locator {
    return this.page.locator('a[href="/view_cart"]');
  }

  private get allProductsTitle(): Locator {
    return this.page.getByRole('heading', { name: 'All Products' });
  }

  private get searchedProductsTitle(): Locator {
    return this.page.getByRole('heading', { name: 'Searched Products' });
  }

  private get productCards(): Locator {
    return this.page.locator('.features_items .product-image-wrapper');
  }

  private get searchInput(): Locator {
    return this.page.locator('#search_product');
  }

  private get searchButton(): Locator {
    return this.page.locator('#submit_search');
  }

  private get continueShoppingButton(): Locator {
    return this.page.getByRole('button', { name: 'Continue Shopping' });
  }

  private get viewCartLink(): Locator {
    return this.page.getByRole('link', { name: 'View Cart' });
  }

  private get brandsSidebar(): Locator {
    return this.page.locator('.brands_products');
  }

  private get reviewSuccessMessage(): Locator {
    return this.page.locator('#review-section .alert-success');
  }

  private productCard(index: number): Locator {
    return this.productCards.nth(index);
  }

  private productAddToCartLink(index: number): Locator {
    return this.productCard(index).locator('a.add-to-cart').last();
  }

  // Verifies all products page is opened.
  async verifyAllProductsPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/products$/);
    await expect(this.allProductsTitle).toBeVisible();
  }

  // Verifies products list is visible.
  async verifyProductsListVisible(): Promise<void> {
    await expect(this.productCards.first()).toBeVisible();
    expect(await this.productCards.count()).toBeGreaterThan(0);
  }

  // Opens first product details page.
  async openFirstProductDetails(): Promise<void> {
    await this.firstProduct.click();
  }

  // Verifies product details block.
  async verifyProductDetailsVisible(): Promise<void> {
    await expect(this.page).toHaveURL(/\/product_details\/\d+$/);
    const productInformation = this.page.locator('.product-information');

    await expect(productInformation.getByRole('heading')).toBeVisible();
    await expect(productInformation.getByText('Category:')).toBeVisible();
    await expect(productInformation.getByText(/^Rs\./)).toBeVisible();
    await expect(productInformation.getByText('Availability:')).toBeVisible();
    await expect(productInformation.getByText('Condition:')).toBeVisible();
    await expect(productInformation.getByText('Brand:')).toBeVisible();
  }

  // Searches product by name.
  async searchProduct(productName: string): Promise<void> {
    await this.searchInput.fill(productName);
    await this.searchButton.click();
  }

  // Searches default product from test data.
  async searchDefaultProduct(): Promise<void> {
    await this.searchProduct(productSearchData.productName);
  }

  // Verifies searched products are shown.
  async verifySearchedProductsVisible(productName: string): Promise<void> {
    await expect(this.searchedProductsTitle).toBeVisible();
    await this.verifyProductsListVisible();

    const productNames = await this.productCards.locator('.productinfo p').allTextContents();
    expect(productNames.length).toBeGreaterThan(0);
  }

  // Verifies default search results.
  async verifyDefaultSearchedProductsVisible(): Promise<void> {
    await this.verifySearchedProductsVisible(productSearchData.productName);
  }

  // Adds product by card index.
  async addProductToCartByIndex(index: number): Promise<void> {
    await this.productCard(index).hover();
    await this.productAddToCartLink(index).click();
  }

  // Closes modal and continues shopping.
  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  // Opens cart from add-to-cart modal.
  async openCartFromModal(): Promise<CartPage> {
    await this.viewCartLink.click();
    return new CartPage(this.page);
  }

  // Adds first searched product and opens cart.
  async addFirstSearchedProductToCart(): Promise<CartPage> {
    await this.addProductToCartByIndex(0);
    return this.openCartFromModal();
  }

  // Verifies brands sidebar is visible.
  async verifyBrandsVisible(): Promise<void> {
    await expect(this.brandsSidebar.getByRole('heading', { name: 'Brands' })).toBeVisible();
  }

  // Opens brand page and checks title.
  async openBrand(brandName: string): Promise<void> {
    await this.brandsSidebar.getByRole('link', { name: brandName }).click();
    await expect(this.page).toHaveURL(new RegExp(`/brand_products/${brandName}`));
    await expect(this.page.getByRole('heading', { name: `Brand - ${brandName} Products` })).toBeVisible();
  }

  // Opens Polo brand page.
  async openPoloBrand(): Promise<void> {
    await this.openBrand(brandData.firstBrand);
  }

  // Opens H&M brand page.
  async openHmBrand(): Promise<void> {
    await this.openBrand(brandData.secondBrand);
  }

  // Verifies review form is visible.
  async verifyWriteReviewVisible(): Promise<void> {
    await expect(this.page.getByRole('link', { name: 'Write Your Review' })).toBeVisible();
  }

  // Verifies review was submitted.
  async verifyReviewSubmitted(): Promise<void> {
    await expect(this.reviewSuccessMessage).toContainText('Thank you for your review.');
  }

  // Adds first product with custom quantity.
  async addProductToCart(quantity: number): Promise<void> {
    await this.firstProduct.click();
    await this.quantityInput.fill(quantity.toString());
    await this.productAddToCartBtn.click();
  }

  // Submits product review.
  async submitReview(name: string, email: string, review: string): Promise<void> {
    await this.reviewNameInput.fill(name);
    await this.reviewEmailInput.fill(email);
    await this.reviewTextBox.fill(review);
    await this.reviewBtn.click();
    await this.verifyReviewSubmitted();
  }

  // Submits default product review.
  async submitDefaultReview(): Promise<void> {
    await this.submitReview(reviewData.name, reviewData.email, reviewData.review);
  }
  // Opens cart page.
  async navigateToCart(): Promise<CartPage> {
    await this.cartBtn.click();
    return new CartPage(this.page);
  }
}
