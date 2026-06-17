import { expect, Locator, Page } from '@playwright/test';
import { CheckoutPage } from './checkoutPage.ts';
import { BasePage } from './basePage.ts';
import { cartProductData, subscriptionData } from '../data/authData.ts';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
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

  private get proceedToCheckoutButton(): Locator {
    return this.page.getByText('Proceed To Checkout');
  }

  private get registerLoginLink(): Locator {
    return this.page.getByRole('link', { name: 'Register / Login' });
  }

  private cartProductById(id: number): Locator {
    return this.page.locator(`#product-${id}`);
  }

  async shouldBeOpened(): Promise<void> {
    await expect(this.page).toHaveURL('/view_cart');
  }

  async shouldShowSubscription(): Promise<void> {
    await this.subscriptionTitle.scrollIntoViewIfNeeded();
    await expect(this.subscriptionTitle).toBeVisible();
  }

  async subscribeWithDefaultEmail(): Promise<void> {
    this.log('subscribe from cart footer');
    await this.subscriptionEmailInput.fill(subscriptionData.email);
    await this.subscriptionButton.click();
    await expect(this.subscriptionSuccessMessage).toContainText('You have been successfully subscribed!');
  }

  async shouldShowFirstTwoProducts(): Promise<void> {
    await this.shouldShowProductInCart(
      cartProductData.firstProduct.id,
      cartProductData.firstProduct.name,
      cartProductData.firstProduct.price,
      cartProductData.firstProduct.quantity,
      cartProductData.firstProduct.totalPrice,
    );
    await this.shouldShowProductInCart(
      cartProductData.secondProduct.id,
      cartProductData.secondProduct.name,
      cartProductData.secondProduct.price,
      cartProductData.secondProduct.quantity,
      cartProductData.secondProduct.totalPrice,
    );
  }

  async shouldShowProductQuantity(id: number, expectedQuantity: string): Promise<void> {
    await expect(this.cartProductById(id).locator('.cart_quantity')).toHaveText(expectedQuantity);
  }

  async shouldShowAnyProduct(): Promise<void> {
    await expect(this.cartRows.first()).toBeVisible();
  }

  async proceedToCheckout(): Promise<CheckoutPage> {
    this.log('proceed to checkout');
    await this.proceedToCheckoutButton.click();
    return new CheckoutPage(this.page);
  }

  async proceedToCheckoutAndOpenRegistration(): Promise<void> {
    this.log('open registration from checkout modal');
    await this.proceedToCheckoutButton.click();
    await this.registerLoginLink.click();
  }

  async removeProductById(id: number): Promise<void> {
    this.log(`remove product ${id} from cart`);
    await this.cartProductById(id).locator('.cart_quantity_delete').click();
    await expect(this.cartProductById(id)).toBeHidden();
  }

  private async shouldShowProductInCart(
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
}
