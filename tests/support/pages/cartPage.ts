import { expect, type Locator, type Page } from '@playwright/test';
import type { CartProduct } from '../data/products.ts';
import { CheckoutPage } from './checkoutPage.ts';
import { LoginPage } from './loginPage.ts';

export class CartPage {
  constructor(private readonly page: Page) {}

  private get cartRows(): Locator {
    return this.page.locator('tr[id^="product-"]');
  }

  private get subscriptionTitle(): Locator {
    return this.page.getByRole('heading', { name: 'Subscription' });
  }

  private get subscriptionEmailInput(): Locator {
    return this.page.getByPlaceholder('Your email address');
  }

  private get subscriptionButton(): Locator {
    return this.page.locator('#subscribe');
  }

  private get subscriptionSuccessMessage(): Locator {
    return this.page.locator('#success-subscribe');
  }

  private get proceedToCheckoutButton(): Locator {
    return this.page.getByText('Proceed To Checkout', { exact: true });
  }

  private get registerLoginLink(): Locator {
    return this.page.getByRole('link', { name: 'Register / Login' });
  }

  private get headerLoginLink(): Locator {
    return this.page.getByRole('banner').getByRole('link', { name: 'Signup / Login' });
  }

  private cartProductById(id: number): Locator {
    return this.page.locator(`#product-${id}`);
  }

  async shouldBeOpened(): Promise<void> {
    await expect(this.page).toHaveURL('/view_cart');
  }

  async shouldShowSubscription(): Promise<void> {
    await this.subscriptionTitle.scrollIntoViewIfNeeded();
    await expect(this.subscriptionTitle).toBeInViewport();
  }

  async subscribe(email: string): Promise<void> {
    await this.subscriptionEmailInput.fill(email);
    await this.subscriptionButton.click();
    await expect(this.subscriptionSuccessMessage).toContainText('You have been successfully subscribed!');
    await expect(this.subscriptionSuccessMessage).toBeVisible();
  }

  async shouldShowProducts(products: readonly CartProduct[]): Promise<void> {
    for (const product of products) {
      await this.shouldShowProductInCart(product);
    }
  }

  async shouldShowProductQuantity(id: number, expectedQuantity: string): Promise<void> {
    await expect(this.cartProductById(id).locator('.cart_quantity')).toHaveText(expectedQuantity);
  }

  async shouldShowAnyProduct(): Promise<void> {
    await expect(this.cartRows.filter({ visible: true })).not.toHaveCount(0);
  }

  async proceedToCheckout(): Promise<CheckoutPage> {
    await this.proceedToCheckoutButton.click();
    return new CheckoutPage(this.page);
  }

  async proceedToCheckoutAndOpenRegistration(): Promise<LoginPage> {
    await this.proceedToCheckoutButton.click();
    await this.registerLoginLink.click();
    return new LoginPage(this.page);
  }

  async openLoginPage(): Promise<LoginPage> {
    await this.headerLoginLink.click();
    return new LoginPage(this.page);
  }

  async removeProductById(id: number): Promise<void> {
    await this.cartProductById(id).locator('.cart_quantity_delete').click();
    await expect(this.cartProductById(id)).toBeHidden();
  }

  private async shouldShowProductInCart(productData: CartProduct): Promise<void> {
    const product = this.cartProductById(productData.id);

    await expect(product.locator('.cart_description')).toContainText(productData.name);
    await expect(product.locator('.cart_price')).toHaveText(productData.price);
    await expect(product.locator('.cart_quantity')).toHaveText(productData.quantity);
    await expect(product.locator('.cart_total')).toHaveText(productData.totalPrice);
  }
}
