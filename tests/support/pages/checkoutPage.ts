import { expect, type Locator, type Page } from '@playwright/test';
import type { UserAddress } from '../data/users.ts';
import { PaymentPage } from './paymentPage.ts';

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  private get addressDetailsTitle(): Locator {
    return this.page.getByRole('heading', { name: 'Address Details' });
  }

  private get reviewOrderTitle(): Locator {
    return this.page.getByRole('heading', { name: 'Review Your Order' });
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

  async shouldShowRegisteredAddressDetails(user: UserAddress): Promise<void> {
    for (const address of [this.deliveryAddress, this.billingAddress]) {
      await expect(address).toContainText(user.firstName);
      await expect(address).toContainText(user.lastName);
      await expect(address).toContainText(user.company);
      await expect(address).toContainText(user.address1);
      await expect(address).toContainText(user.address2);
      await expect(address).toContainText(user.city);
      await expect(address).toContainText(user.state);
      await expect(address).toContainText(user.zipCode);
      await expect(address).toContainText(user.country);
      await expect(address).toContainText(user.mobileNumber);
    }
  }

  async placeOrder(comment: string): Promise<PaymentPage> {
    await this.commentTextarea.fill(comment);
    await this.placeOrderButton.click();
    return new PaymentPage(this.page);
  }
}
