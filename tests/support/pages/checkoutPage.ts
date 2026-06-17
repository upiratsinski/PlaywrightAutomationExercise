import { expect, Locator, Page } from '@playwright/test';
import { PaymentPage } from './paymentPage.ts';
import { BasePage } from './basePage.ts';
import { registrationData } from '../data/authData.ts';

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private get addressDetailsTitle(): Locator {
    return this.page.getByText('Address Details');
  }

  private get reviewOrderTitle(): Locator {
    return this.page.getByText('Review Your Order');
  }

  private get commentTextarea(): Locator {
    return this.page.locator('textarea[name="message"]');
  }

  private get placeOrderButton(): Locator {
    return this.page.getByRole('link', { name: 'Place Order' });
  }

  private get deliveryAddress(): Locator {
    return this.page.locator('#address_delivery');
  }

  private get billingAddress(): Locator {
    return this.page.locator('#address_invoice');
  }

  async shouldBeOpened(): Promise<void> {
    await expect(this.page).toHaveURL('/checkout');
    await expect(this.addressDetailsTitle).toBeVisible();
    await expect(this.reviewOrderTitle).toBeVisible();
  }

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

  async placeOrder(comment: string): Promise<PaymentPage> {
    this.log('place order from checkout page');
    await this.commentTextarea.fill(comment);
    await this.placeOrderButton.click();
    return new PaymentPage(this.page);
  }
}
