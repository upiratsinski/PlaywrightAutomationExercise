import { expect, Locator, Page } from '@playwright/test';
import { CartPage } from './cartPage.ts';
import { BasePage } from './basePage.ts';
import { brandData, productSearchData, reviewData } from '../data/authData.ts';

export class ProductsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Finds the first product details link.
  private get firstProductDetailsLink(): Locator {
    return this.page.locator('a[href="/product_details/1"]').first();
  }

  // Finds the quantity input on a product details page.
  private get quantityInput(): Locator {
    return this.page.locator('#quantity');
  }

  // Finds the add-to-cart button on a product details page.
  private get productDetailsAddToCartButton(): Locator {
    return this.page.locator('button.btn.btn-default.cart');
  }

  // Finds the review name input.
  private get reviewNameInput(): Locator {
    return this.page.locator('#name');
  }

  // Finds the review email input.
  private get reviewEmailInput(): Locator {
    return this.page.locator('#email');
  }

  // Finds the review text area.
  private get reviewTextarea(): Locator {
    return this.page.locator('#review');
  }

  // Finds the submit review button.
  private get submitReviewButton(): Locator {
    return this.page.locator('#button-review');
  }

  // Finds the All Products page title.
  private get allProductsTitle(): Locator {
    return this.page.getByRole('heading', { name: 'All Products' });
  }

  // Finds the Searched Products title.
  private get searchedProductsTitle(): Locator {
    return this.page.getByRole('heading', { name: 'Searched Products' });
  }

  // Finds all product cards in the catalog area.
  private get productCards(): Locator {
    return this.page.locator('.features_items .product-image-wrapper');
  }

  // Finds product names inside product cards.
  private get productNames(): Locator {
    return this.productCards.locator('.productinfo p');
  }

  // Finds the product search input.
  private get searchInput(): Locator {
    return this.page.locator('#search_product');
  }

  // Finds the product search submit button.
  private get searchButton(): Locator {
    return this.page.locator('#submit_search');
  }

  // Finds the Continue Shopping button in the modal.
  private get continueShoppingButton(): Locator {
    return this.page.getByRole('button', { name: 'Continue Shopping' });
  }

  // Finds the View Cart link in the modal.
  private get viewCartLink(): Locator {
    return this.page.getByRole('link', { name: 'View Cart' });
  }

  // Finds the brands sidebar.
  private get brandsSidebar(): Locator {
    return this.page.locator('.brands_products');
  }

  // Finds the successful review message.
  private get reviewSuccessMessage(): Locator {
    return this.page.locator('#review-section .alert-success');
  }

  // Finds one product card by its visible index.
  private productCard(index: number): Locator {
    return this.productCards.nth(index);
  }

  // Finds the add-to-cart link for one product card.
  private productAddToCartLink(index: number): Locator {
    return this.productCard(index).locator('a.add-to-cart').last();
  }

  // Checks that the products page is opened.
  async shouldBeOpened(): Promise<void> {
    await expect(this.page).toHaveURL('/products');
    await expect(this.allProductsTitle).toBeVisible();
  }

  // Checks that the catalog has at least one visible product.
  async shouldShowProductsList(): Promise<void> {
    await expect(this.productCards.first()).toBeVisible();
    expect(await this.productCards.count()).toBeGreaterThan(0);
  }

  // Opens details for the first catalog product.
  async openFirstProductDetails(): Promise<void> {
    this.log('open first product details');
    await this.firstProductDetailsLink.click();
  }

  // Checks that the first product details page shows key product information.
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

  // Searches the catalog with the default product name.
  async searchDefaultProduct(): Promise<void> {
    this.log(`search product: ${productSearchData.productName}`);
    await this.searchInput.fill(productSearchData.productName);
    await this.searchButton.click();
  }

  // Checks that default search returns at least one relevant result.
  async shouldShowDefaultSearchResults(): Promise<void> {
    await expect(this.searchedProductsTitle).toBeVisible();
    await this.shouldShowProductsList();

    const names = await this.productNames.allTextContents();
    expect(names.length).toBeGreaterThan(0);
    expect(names.some((name) => name.toLowerCase().includes(productSearchData.productName.toLowerCase()))).toBeTruthy();
  }

  // Adds a catalog product to cart by index.
  async addProductToCartByIndex(index: number): Promise<void> {
    this.log(`add product with index ${index} to cart`);
    await this.productCard(index).hover();
    await this.productAddToCartLink(index).click();
  }

  // Closes the add-to-cart modal.
  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  // Opens the cart from the add-to-cart modal.
  async openCartFromModal(): Promise<CartPage> {
    await this.viewCartLink.click();
    return new CartPage(this.page);
  }

  // Adds the first searched product and opens the cart.
  async addFirstSearchedProductToCart(): Promise<CartPage> {
    await this.addProductToCartByIndex(0);
    return this.openCartFromModal();
  }

  // Adds the first product with a custom quantity.
  async addFirstProductWithQuantity(quantity: number): Promise<void> {
    this.log(`add first product with quantity ${quantity}`);
    await this.firstProductDetailsLink.click();
    await this.quantityInput.fill(quantity.toString());
    await this.productDetailsAddToCartButton.click();
  }

  // Checks that the brands sidebar is visible.
  async shouldShowBrands(): Promise<void> {
    await expect(this.brandsSidebar.getByRole('heading', { name: 'Brands' })).toBeVisible();
  }

  // Opens the Polo brand page.
  async openPoloBrand(): Promise<void> {
    await this.openBrand(brandData.firstBrand);
  }

  // Opens the H&M brand page.
  async openHmBrand(): Promise<void> {
    await this.openBrand(brandData.secondBrand);
  }

  // Checks that the review form is visible.
  async shouldShowWriteReviewForm(): Promise<void> {
    await expect(this.page.getByRole('link', { name: 'Write Your Review' })).toBeVisible();
  }

  // Submits the default product review.
  async submitDefaultReview(): Promise<void> {
    this.log('submit product review');
    await this.reviewNameInput.fill(reviewData.name);
    await this.reviewEmailInput.fill(reviewData.email);
    await this.reviewTextarea.fill(reviewData.review);
    await this.submitReviewButton.click();
    await expect(this.reviewSuccessMessage).toContainText('Thank you for your review.');
  }

  // Opens a brand page and checks its title.
  private async openBrand(brandName: string): Promise<void> {
    this.log(`open brand: ${brandName}`);
    await this.brandsSidebar.getByRole('link', { name: brandName }).click();
    await expect(this.page.getByRole('heading', { name: `Brand - ${brandName} Products` })).toBeVisible();
  }
}
