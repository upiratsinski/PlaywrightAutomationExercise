import { expect, Locator, Page } from '@playwright/test';
import { paymentData } from '../fixtures/authData.ts';

export class PaymentPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private get nameOnCardInput(): Locator {
    return this.page.locator('[data-qa="name-on-card"]');
  }

  private get cardNumberInput(): Locator {
    return this.page.locator('[data-qa="card-number"]');
  }

  private get cvcInput(): Locator {
    return this.page.locator('[data-qa="cvc"]');
  }

  private get expiryMonthInput(): Locator {
    return this.page.locator('[data-qa="expiry-month"]');
  }

  private get expiryYearInput(): Locator {
    return this.page.locator('[data-qa="expiry-year"]');
  }

  private get payButton(): Locator {
    return this.page.locator('[data-qa="pay-button"]');
  }

  private get orderPlacedTitle(): Locator {
    return this.page.locator('[data-qa="order-placed"]');
  }

  private get downloadInvoiceLink(): Locator {
    return this.page.getByRole('link', { name: 'Download Invoice' });
  }

  private get continueButton(): Locator {
    return this.page.locator('[data-qa="continue-button"]');
  }

  // Fills payment form with test card data.
  async fillPaymentDetails(): Promise<void> {
    await this.nameOnCardInput.fill(paymentData.nameOnCard);
    await this.cardNumberInput.fill(paymentData.cardNumber);
    await this.cvcInput.fill(paymentData.cvc);
    await this.expiryMonthInput.fill(paymentData.expiryMonth);
    await this.expiryYearInput.fill(paymentData.expiryYear);
  }

  // Pays and verifies order confirmation.
  async payAndConfirmOrder(): Promise<void> {
    await this.payButton.click();
    await expect(this.orderPlacedTitle).toBeVisible();
  }

  // Downloads invoice and checks file name.
  async downloadInvoice(): Promise<void> {
    const download = await Promise.all([
      this.page.waitForEvent('download'),
      this.downloadInvoiceLink.click(),
    ]);

    expect(download[0].suggestedFilename()).toContain('invoice');
  }

  // Continues after order confirmation.
  async continueAfterOrder(): Promise<void> {
    await this.continueButton.click();
  }
}
