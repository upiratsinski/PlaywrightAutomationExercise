import { expect, Locator, Page } from '@playwright/test';
import { CartPage } from './cartPage.ts';
import { BasePage } from './basePage.ts';
import { brandData, productSearchData, reviewData } from '../data/authData.ts';

export class ProductsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private get firstProductDetailsLink(): Locator {
    return this.page.locator('a[href="/product_details/1"]').first();
  }

  private get quantityInput(): Locator {
    return this.page.locator('#quantity');
  }

  private get productDetailsAddToCartButton(): Locator {
    return this.page.locator('button.btn.btn-default.cart');
  }

  private get reviewNameInput(): Locator {
    return this.page.locator('#name');
  }

  private get reviewEmailInput(): Locator {
    return this.page.locator('#email');
  }

  private get reviewTextarea(): Locator {
    return this.page.locator('#review');
  }

  private get submitReviewButton(): Locator {
    return this.page.locator('#button-review');
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

  private get productNames(): Locator {
    return this.productCards.locator('.productinfo p');
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

  async shouldBeOpened(): Promise<void> {
    await expect(this.page).toHaveURL('/products');
    await expect(this.allProductsTitle).toBeVisible();
  }

  async shouldShowProductsList(): Promise<void> {
    await expect(this.productCards.first()).toBeVisible();
    expect(await this.productCards.count()).toBeGreaterThan(0);
  }

  async openFirstProductDetails(): Promise<void> {
    this.log('open first product details');
    await this.firstProductDetailsLink.click();
  }

  async shouldShowFirstProductDetails(): Promise<void> {
    await expect(this.page).toHaveURL('/product_details/1');
    const productInformation = this.page.locator('.product-information');

    await expect(productInformation.getByRole('heading')).toBeVisible();
    await expect(productInformation).toContainText('Category:');
    await expect(productInformation).toContainText('Rs.');
    await expect(productInformation).toContainText('Availability:');
    await expect(productInformation).toContainText('Condition:');
    await expect(productInformation).toContainText('Brand:');
  }

  async searchDefaultProduct(): Promise<void> {
    this.log(`search product: ${productSearchData.productName}`);
    await this.searchInput.fill(productSearchData.productName);
    await this.searchButton.click();
  }

  async shouldShowDefaultSearchResults(): Promise<void> {
    await expect(this.searchedProductsTitle).toBeVisible();
    await this.shouldShowProductsList();

    const names = await this.productNames.allTextContents();
    expect(names.length).toBeGreaterThan(0);
    expect(names.some((name) => name.toLowerCase().includes(productSearchData.productName.toLowerCase()))).toBeTruthy();
  }

  async addProductToCartByIndex(index: number): Promise<void> {
    this.log(`add product with index ${index} to cart`);
    await this.productCard(index).hover();
    await this.productAddToCartLink(index).click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async openCartFromModal(): Promise<CartPage> {
    await this.viewCartLink.click();
    return new CartPage(this.page);
  }

  async addFirstSearchedProductToCart(): Promise<CartPage> {
    await this.addProductToCartByIndex(0);
    return this.openCartFromModal();
  }

  async addFirstProductWithQuantity(quantity: number): Promise<void> {
    this.log(`add first product with quantity ${quantity}`);
    await this.firstProductDetailsLink.click();
    await this.quantityInput.fill(quantity.toString());
    await this.productDetailsAddToCartButton.click();
  }

  async shouldShowBrands(): Promise<void> {
    await expect(this.brandsSidebar.getByRole('heading', { name: 'Brands' })).toBeVisible();
  }

  async openPoloBrand(): Promise<void> {
    await this.openBrand(brandData.firstBrand);
  }

  async openHmBrand(): Promise<void> {
    await this.openBrand(brandData.secondBrand);
  }

  async shouldShowWriteReviewForm(): Promise<void> {
    await expect(this.page.getByRole('link', { name: 'Write Your Review' })).toBeVisible();
  }

  async submitDefaultReview(): Promise<void> {
    this.log('submit product review');
    await this.reviewNameInput.fill(reviewData.name);
    await this.reviewEmailInput.fill(reviewData.email);
    await this.reviewTextarea.fill(reviewData.review);
    await this.submitReviewButton.click();
    await expect(this.reviewSuccessMessage).toContainText('Thank you for your review.');
  }

  private async openBrand(brandName: string): Promise<void> {
    this.log(`open brand: ${brandName}`);
    await this.brandsSidebar.getByRole('link', { name: brandName }).click();
    await expect(this.page.getByRole('heading', { name: `Brand - ${brandName} Products` })).toBeVisible();
  }
}
