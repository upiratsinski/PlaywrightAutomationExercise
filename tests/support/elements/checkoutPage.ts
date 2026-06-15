import { expect, Locator, Page } from '@playwright/test';
import { PaymentPage } from './paymentPage.ts';
import { registrationData } from '../fixtures/authData.ts';

export class CheckoutPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
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

  // Verifies checkout page sections.
  async verifyCheckoutPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/checkout$/);
    await expect(this.addressDetailsTitle).toBeVisible();
    await expect(this.reviewOrderTitle).toBeVisible();
  }

  // Verifies delivery and billing addresses.
  async verifyRegisteredAddressDetails(): Promise<void> {
    for (const address of [this.deliveryAddress, this.billingAddress]) {
      await expect(address).toContainText(registrationData.registrationFirstName);
      await expect(address).toContainText(registrationData.registrationLastName);
      await expect(address).toContainText(registrationData.registrationCompany);
      await expect(address).toContainText(registrationData.registrationAddress1);
      await expect(address).toContainText(registrationData.registrationAddress2);
      await expect(address).toContainText(registrationData.registrationCity);
      await expect(address).toContainText(registrationData.registrationState);
      await expect(address).toContainText(registrationData.registrationZipCode);
      await expect(address).toContainText(registrationData.registrationCountry);
      await expect(address).toContainText(registrationData.registrationMobileNumber);
    }
  }

  // Adds order comment and places order.
  async placeOrder(comment: string): Promise<PaymentPage> {
    await this.commentTextarea.fill(comment);
    await this.placeOrderButton.click();
    return new PaymentPage(this.page);
  }
}
