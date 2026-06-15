import { Page, Locator, expect } from '@playwright/test';
import { CheckoutPage } from './checkoutPage.ts';
import { cartProductData, subscriptionData } from '../fixtures/authData.ts';

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

  // Verifies cart page is opened.
  async verifyCartPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/view_cart$/);
  }

  // Verifies subscription block in cart footer.
  async verifySubscription(): Promise<void> {
    await this.subscriptionTitle.scrollIntoViewIfNeeded();
    await expect(this.subscriptionTitle).toBeVisible();
  }

  // Submits subscription email and checks success message.
  async subscribe(email: string): Promise<void> {
    await this.subscriptionEmailInput.fill(email);
    await this.subscriptionButton.click();
    await expect(this.subscriptionSuccessMessage).toContainText('You have been successfully subscribed!');
  }

  // Subscribes with default test email.
  async subscribeWithDefaultEmail(): Promise<void> {
    await this.subscribe(subscriptionData.email);
  }

  // Verifies a specific product row in cart.
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

  // Verifies first two products in cart.
  async verifyFirstTwoProductsInCart(): Promise<void> {
    await this.verifyProductInCart(
      cartProductData.firstProduct.id,
      cartProductData.firstProduct.name,
      cartProductData.firstProduct.price,
      cartProductData.firstProduct.quantity,
      cartProductData.firstProduct.totalPrice,
    );
    await this.verifyProductInCart(
      cartProductData.secondProduct.id,
      cartProductData.secondProduct.name,
      cartProductData.secondProduct.price,
      cartProductData.secondProduct.quantity,
      cartProductData.secondProduct.totalPrice,
    );
  }

  // Verifies product quantity in cart.
  async verifyProductQuantity(id: number, expectedQuantity: string): Promise<void> {
    await expect(this.cartProductById(id).locator('.cart_quantity')).toHaveText(expectedQuantity);
  }

  // Verifies at least one product is in cart.
  async verifyAnyProductVisible(): Promise<void> {
    await expect(this.cartRows.first()).toBeVisible();
  }

  // Proceeds to checkout.
  async proceedToCheckout(): Promise<CheckoutPage> {
    await this.proceedToCheckoutButton.click();
    return new CheckoutPage(this.page);
  }

  // Proceeds to checkout and opens registration.
  async proceedToCheckoutAndRegister(): Promise<void> {
    await this.proceedToCheckoutButton.click();
    await this.registerLoginLink.click();
  }

  // Removes product from cart.
  async removeProduct(id: number): Promise<void> {
    await this.cartProductById(id).locator('.cart_quantity_delete').click();
    await expect(this.cartProductById(id)).toBeHidden();
  }

  // Verifies cart item details by expected text.
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

  // Deletes first cart item.
  async deleteCartItem(): Promise<void> {
    await this.deleteBtn.click();
  }
}
