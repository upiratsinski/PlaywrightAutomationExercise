import { Page, Locator, expect } from '@playwright/test';
import { CartPage } from './cartPage.ts';

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

  // Method to add product to cart

  async addProductToCart(quantity: number): Promise<void> {
    await this.firstProduct.click();
    await this.quantityInput.fill(quantity.toString());
    await this.productAddToCartBtn.click();
  }

  // Method to submit a review
  async submitReview(name: string, email: string, review: string): Promise<void> {
    await this.reviewNameInput.fill(name);
    await this.reviewEmailInput.fill(email);
    await this.reviewTextBox.fill(review);
    await this.reviewBtn.click();
  }
  // Method to navigate to cart
  async navigateToCart(): Promise<CartPage> {
    await this.cartBtn.click();
    return new CartPage(this.page);
  }
}
