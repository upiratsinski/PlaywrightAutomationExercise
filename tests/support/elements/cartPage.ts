import { Page, Locator, expect } from '@playwright/test';
import { CheckoutPage } from './checkoutPage.ts';

export class CartPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locators for cart items

  private get cartDescription(): Locator {
    return this.page.locator('td.cart_description');
  }

  private get cartPrice(): Locator {
    return this.page.locator('td.cart_price');
  }

  private get cartQuantity(): Locator {
    return this.page.locator('td.cart_quantity');
  }

  private get cartTotalPrice(): Locator {
    return this.page.locator('td.cart_total_price');
  }

  private get deleteBtn(): Locator {
    return this.page.locator('td.cart_delete > a.cart_quantity_delete');
  }

  private get cartRows(): Locator {
    return this.page.locator('tr[id^="product-"]');
  }

  private get subscriptionTitle(): Locator {
    return this.page.getByRole('heading', { name: 'Subscription' });
  }

  private get subscriptionEmailInput(): Locator {
    return this.page.locator('#susbscribe_email');
  }

  private get subscriptionButton(): Locator {
    return this.page.locator('#subscribe');
  }

  private get subscriptionSuccessMessage(): Locator {
    return this.page.locator('#success-subscribe');
  }

  private cartProductById(id: number): Locator {
    return this.page.locator(`#product-${id}`);
  }

  private get proceedToCheckoutButton(): Locator {
    return this.page.getByText('Proceed To Checkout');
  }

  private get registerLoginLink(): Locator {
    return this.page.getByRole('link', { name: 'Register / Login' });
  }

  async verifyCartPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/view_cart$/);
  }

  async verifySubscription(): Promise<void> {
    await this.subscriptionTitle.scrollIntoViewIfNeeded();
    await expect(this.subscriptionTitle).toBeVisible();
  }

  async subscribe(email: string): Promise<void> {
    await this.subscriptionEmailInput.fill(email);
    await this.subscriptionButton.click();
    await expect(this.subscriptionSuccessMessage).toContainText('You have been successfully subscribed!');
  }

  async verifyProductInCart(
    id: number,
    expectedName: string,
    expectedPrice: string,
    expectedQuantity: string,
    expectedTotalPrice: string,
  ): Promise<void> {
    const product = this.cartProductById(id);

    await expect(product.locator('.cart_description')).toContainText(expectedName);
    await expect(product.locator('.cart_price')).toHaveText(expectedPrice);
    await expect(product.locator('.cart_quantity')).toHaveText(expectedQuantity);
    await expect(product.locator('.cart_total')).toHaveText(expectedTotalPrice);
  }

  async verifyProductQuantity(id: number, expectedQuantity: string): Promise<void> {
    await expect(this.cartProductById(id).locator('.cart_quantity')).toHaveText(expectedQuantity);
  }

  async verifyAnyProductVisible(): Promise<void> {
    await expect(this.cartRows.first()).toBeVisible();
  }

  async proceedToCheckout(): Promise<CheckoutPage> {
    await this.proceedToCheckoutButton.click();
    return new CheckoutPage(this.page);
  }

  async proceedToCheckoutAndRegister(): Promise<void> {
    await this.proceedToCheckoutButton.click();
    await this.registerLoginLink.click();
  }

  async removeProduct(id: number): Promise<void> {
    await this.cartProductById(id).locator('.cart_quantity_delete').click();
    await expect(this.cartProductById(id)).toBeHidden();
  }

  // Method to verify cart item details
  async verifyCartItemDetails(
    expectedDescription: string,
    expectedPrice: string,
    expectedQuantity: string,
    expectedTotalPrice: string,
  ): Promise<void> {
    await expect(this.cartDescription).toHaveText(expectedDescription);
    await expect(this.cartPrice).toHaveText(expectedPrice);
    await expect(this.cartQuantity).toHaveText(expectedQuantity);
    await expect(this.cartTotalPrice).toHaveText(expectedTotalPrice);
  }

  // Method to delete an item from the cart
  async deleteCartItem(): Promise<void> {
    await this.deleteBtn.click();
  }
}
