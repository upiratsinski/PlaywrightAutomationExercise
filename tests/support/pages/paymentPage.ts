import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './basePage.ts';
import { paymentData } from '../data/authData.ts';

export class PaymentPage extends BasePage {
  constructor(page: Page) {
    super(page);
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

  async fillPaymentDetails(): Promise<void> {
    this.log('fill payment details');
    await this.nameOnCardInput.fill(paymentData.nameOnCard);
    await this.cardNumberInput.fill(paymentData.cardNumber);
    await this.cvcInput.fill(paymentData.cvc);
    await this.expiryMonthInput.fill(paymentData.expiryMonth);
    await this.expiryYearInput.fill(paymentData.expiryYear);
  }

  async payAndShouldConfirmOrder(): Promise<void> {
    this.log('pay and confirm order');
    await this.payButton.click();
    await expect(this.orderPlacedTitle).toBeVisible();
  }

  async downloadInvoiceShouldHaveCorrectName(): Promise<void> {
    this.log('download invoice');
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.downloadInvoiceLink.click(),
    ]);

    expect(download.suggestedFilename()).toContain('invoice');
  }

  async continueAfterOrder(): Promise<void> {
    await this.continueButton.click();
  }
}
