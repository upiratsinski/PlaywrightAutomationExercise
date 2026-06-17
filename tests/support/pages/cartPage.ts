import { expect, Locator, Page } from '@playwright/test';
import { CheckoutPage } from './checkoutPage.ts';
import { BasePage } from './basePage.ts';
import { cartProductData, subscriptionData } from '../data/authData.ts';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Finds all product rows in the cart table.
  private get cartRows(): Locator {
    return this.page.locator('tr[id^="product-"]');
  }

  // Finds the cart footer subscription title.
  private get subscriptionTitle(): Locator {
    return this.page.getByRole('heading', { name: 'Subscription' });
  }

  // Finds the cart footer subscription email input.
  private get subscriptionEmailInput(): Locator {
    return this.page.locator('#susbscribe_email');
  }

  // Finds the cart footer subscription submit button.
  private get subscriptionButton(): Locator {
    return this.page.locator('#subscribe');
  }

  // Finds the cart footer subscription success message.
  private get subscriptionSuccessMessage(): Locator {
    return this.page.locator('#success-subscribe');
  }

  // Finds the Proceed To Checkout button.
  private get proceedToCheckoutButton(): Locator {
    return this.page.getByText('Proceed To Checkout');
  }

  // Finds the Register/Login link in the checkout modal.
  private get registerLoginLink(): Locator {
    return this.page.getByRole('link', { name: 'Register / Login' });
  }

  // Finds one cart row by product id.
  private cartProductById(id: number): Locator {
    return this.page.locator(`#product-${id}`);
  }

  // Checks that the cart page is opened.
  async shouldBeOpened(): Promise<void> {
    await expect(this.page).toHaveURL('/view_cart');
  }

  // Checks that the subscription block is visible.
  async shouldShowSubscription(): Promise<void> {
    await this.subscriptionTitle.scrollIntoViewIfNeeded();
    await expect(this.subscriptionTitle).toBeVisible();
  }

  // Subscribes with a generated test email from the cart footer.
  async subscribeWithDefaultEmail(): Promise<void> {
    this.log('subscribe from cart footer');
    await this.subscriptionEmailInput.fill(subscriptionData.email);
    await this.subscriptionButton.click();
    await expect(this.subscriptionSuccessMessage).toContainText('You have been successfully subscribed!');
  }

  // Checks that the first two expected products are in the cart.
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

  // Checks a product quantity in the cart by product id.
  async shouldShowProductQuantity(id: number, expectedQuantity: string): Promise<void> {
    await expect(this.cartProductById(id).locator('.cart_quantity')).toHaveText(expectedQuantity);
  }

  // Checks that at least one product is visible in the cart.
  async shouldShowAnyProduct(): Promise<void> {
    await expect(this.cartRows.first()).toBeVisible();
  }

  // Opens the checkout page from the cart.
  async proceedToCheckout(): Promise<CheckoutPage> {
    this.log('proceed to checkout');
    await this.proceedToCheckoutButton.click();
    return new CheckoutPage(this.page);
  }

  // Opens registration from the checkout modal for guest users.
  async proceedToCheckoutAndOpenRegistration(): Promise<void> {
    this.log('open registration from checkout modal');
    await this.proceedToCheckoutButton.click();
    await this.registerLoginLink.click();
  }

  // Removes one product from the cart by product id.
  async removeProductById(id: number): Promise<void> {
    this.log(`remove product ${id} from cart`);
    await this.cartProductById(id).locator('.cart_quantity_delete').click();
    await expect(this.cartProductById(id)).toBeHidden();
  }

  // Checks the name, price, quantity, and total for one cart product.
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
