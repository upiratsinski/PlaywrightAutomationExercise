import { expect, type Locator, type Page } from '@playwright/test';
import type { ProductDetails, ProductReference, ProductReview } from '../data/products.ts';
import { CartPage } from './cartPage.ts';

export class ProductsPage {
  constructor(private readonly page: Page) {}

  private get firstProductDetailsLink(): Locator {
    // Test Cases 8, 13, and 21 explicitly exercise the first catalog product.
    return this.page.getByRole('link', { name: 'View Product' }).first();
  }

  private get quantityInput(): Locator {
    return this.page.locator('#quantity');
  }

  private get productDetailsAddToCartButton(): Locator {
    return this.page.getByRole('button', { name: 'Add to cart' });
  }

  private get reviewForm(): Locator {
    return this.page.locator('#review-form');
  }

  private get reviewNameInput(): Locator {
    return this.reviewForm.getByPlaceholder('Your Name');
  }

  private get reviewEmailInput(): Locator {
    return this.reviewForm.getByPlaceholder('Email Address');
  }

  private get reviewTextarea(): Locator {
    return this.reviewForm.getByPlaceholder('Add Review Here!');
  }

  private get submitReviewButton(): Locator {
    return this.reviewForm.getByRole('button', { name: 'Submit' });
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
    return this.page.getByPlaceholder('Search Product');
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

  private get brandsSection(): Locator {
    return this.page.locator('.brands_products');
  }

  private get reviewSuccessMessage(): Locator {
    return this.page.locator('#review-section').getByText('Thank you for your review.', { exact: true });
  }

  private productCard(product: ProductReference): Locator {
    return this.productCards.filter({ hasText: product.name });
  }

  private productAddToCartLink(product: ProductReference): Locator {
    return this.productCard(product).locator('.product-overlay').getByText('Add to cart', { exact: true });
  }

  async shouldBeOpened(): Promise<void> {
    await expect(this.page).toHaveURL('/products');
    await expect(this.allProductsTitle).toBeVisible();
  }

  async shouldShowProductsList(): Promise<void> {
    await expect(this.productCards.filter({ visible: true })).not.toHaveCount(0);
  }

  async openFirstProductDetails(): Promise<void> {
    await this.firstProductDetailsLink.click();
  }

  async shouldShowProductDetails(product: ProductDetails): Promise<void> {
    await expect(this.page).toHaveURL(`/product_details/${product.id}`);
    const productInformation = this.page.locator('.product-information');

    await expect(productInformation.getByRole('heading', { name: product.name, exact: true })).toBeVisible();
    await expect(productInformation).toContainText(`Category: ${product.category}`);
    await expect(productInformation).toContainText(product.price);
    await expect(productInformation).toContainText(`Availability: ${product.availability}`);
    await expect(productInformation).toContainText(`Condition: ${product.condition}`);
    await expect(productInformation).toContainText(`Brand: ${product.brand}`);
  }

  async search(productName: string): Promise<void> {
    await this.searchInput.fill(productName);
    await this.searchButton.click();
  }

  async shouldShowSearchResults(productName: string): Promise<void> {
    await expect(this.searchedProductsTitle).toBeVisible();
    const visibleProductNames = this.productNames.filter({ visible: true });

    await expect(visibleProductNames).not.toHaveCount(0);

    const expectedName = productName.toLowerCase();
    const names = await visibleProductNames.allTextContents();
    expect(names.every((name) => name.toLowerCase().includes(expectedName))).toBe(true);
  }

  async addProductToCart(product: ProductReference): Promise<void> {
    await this.productCard(product).hover();
    await this.productAddToCartLink(product).click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async openCartFromModal(): Promise<CartPage> {
    await this.viewCartLink.click();
    return new CartPage(this.page);
  }

  async addFirstSearchedProductToCart(): Promise<{ cartPage: CartPage; product: ProductReference }> {
    // Test Case 20 intentionally adds the first product from the filtered results.
    const firstProductCard = this.productCards.filter({ visible: true }).first();
    const productName = (await firstProductCard.locator('.productinfo p').innerText()).trim();
    const addToCartButton = firstProductCard.locator('.product-overlay').getByText('Add to cart', { exact: true });
    const productIdAttribute = await addToCartButton.getAttribute('data-product-id');
    const productId = Number(productIdAttribute);

    if (!productName || productIdAttribute === null || !Number.isInteger(productId)) {
      throw new Error('The first searched product is missing a usable name or product ID.');
    }

    await firstProductCard.hover();
    await addToCartButton.click();

    return {
      cartPage: await this.openCartFromModal(),
      product: { id: productId, name: productName },
    };
  }

  async addFirstProductWithQuantity(quantity: number): Promise<void> {
    await this.firstProductDetailsLink.click();
    await this.quantityInput.fill(quantity.toString());
    await this.productDetailsAddToCartButton.click();
  }

  async shouldShowBrands(): Promise<void> {
    await expect(this.brandsSection.getByRole('heading', { name: 'Brands' })).toBeVisible();
  }

  async openBrand(brandName: string): Promise<void> {
    await this.brandsSection.getByRole('link', { name: brandName }).click();
  }

  async shouldShowBrand(brandName: string): Promise<void> {
    await expect(this.page.getByRole('heading', { name: `Brand - ${brandName} Products` })).toBeVisible();
    await this.shouldShowProductsList();
  }

  async shouldShowWriteReviewForm(): Promise<void> {
    await expect(this.page.getByRole('link', { name: 'Write Your Review' })).toBeVisible();
    await expect(this.reviewForm).toBeVisible();
  }

  async submitReview(review: ProductReview): Promise<void> {
    await this.reviewNameInput.fill(review.name);
    await this.reviewEmailInput.fill(review.email);
    await this.reviewTextarea.fill(review.review);
    await this.submitReviewButton.click();
  }

  async shouldShowReviewSubmitted(): Promise<void> {
    await expect(this.reviewSuccessMessage).toBeVisible();
  }
}
