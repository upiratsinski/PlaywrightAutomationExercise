import { expect, Locator, Page } from '@playwright/test';
import { PaymentPage } from './paymentPage.ts';
import { BasePage } from './basePage.ts';
import { registrationData } from '../data/authData.ts';

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Finds the Address Details section title.
  private get addressDetailsTitle(): Locator {
    return this.page.getByText('Address Details');
  }

  // Finds the Review Your Order section title.
  private get reviewOrderTitle(): Locator {
    return this.page.getByText('Review Your Order');
  }

  // Finds the order comment text area.
  private get commentTextarea(): Locator {
    return this.page.locator('textarea[name="message"]');
  }

  // Finds the Place Order button.
  private get placeOrderButton(): Locator {
    return this.page.getByRole('link', { name: 'Place Order' });
  }

  // Finds the delivery address block.
  private get deliveryAddress(): Locator {
    return this.page.locator('#address_delivery');
  }

  // Finds the billing address block.
  private get billingAddress(): Locator {
    return this.page.locator('#address_invoice');
  }

  // Checks that the checkout page is opened.
  async shouldBeOpened(): Promise<void> {
    await expect(this.page).toHaveURL('/checkout');
    await expect(this.addressDetailsTitle).toBeVisible();
    await expect(this.reviewOrderTitle).toBeVisible();
  }

  // Checks that delivery and billing addresses match the registered user.
  async shouldShowRegisteredAddressDetails(): Promise<void> {
    for (const address of [this.deliveryAddress, this.billingAddress]) {
      await expect(address).toContainText(registrationData.firstName);
      await expect(address).toContainText(registrationData.lastName);
      await expect(address).toContainText(registrationData.company);
      await expect(address).toContainText(registrationData.address1);
      await expect(address).toContainText(registrationData.address2);
      await expect(address).toContainText(registrationData.city);
      await expect(address).toContainText(registrationData.state);
      await expect(address).toContainText(registrationData.zipCode);
      await expect(address).toContainText(registrationData.country);
      await expect(address).toContainText(registrationData.mobileNumber);
    }
  }

  // Places the order with a test comment.
  async placeOrder(comment: string): Promise<PaymentPage> {
    this.log('place order from checkout page');
    await this.commentTextarea.fill(comment);
    await this.placeOrderButton.click();
    return new PaymentPage(this.page);
  }
}
