import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './basePage.ts';
import { paymentData } from '../data/authData.ts';

export class PaymentPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Finds the name on card input.
  private get nameOnCardInput(): Locator {
    return this.page.locator('[data-qa="name-on-card"]');
  }

  // Finds the card number input.
  private get cardNumberInput(): Locator {
    return this.page.locator('[data-qa="card-number"]');
  }

  // Finds the card CVC input.
  private get cvcInput(): Locator {
    return this.page.locator('[data-qa="cvc"]');
  }

  // Finds the card expiry month input.
  private get expiryMonthInput(): Locator {
    return this.page.locator('[data-qa="expiry-month"]');
  }

  // Finds the card expiry year input.
  private get expiryYearInput(): Locator {
    return this.page.locator('[data-qa="expiry-year"]');
  }

  // Finds the Pay and Confirm Order button.
  private get payButton(): Locator {
    return this.page.locator('[data-qa="pay-button"]');
  }

  // Finds the order placed confirmation title.
  private get orderPlacedTitle(): Locator {
    return this.page.locator('[data-qa="order-placed"]');
  }

  // Finds the Download Invoice link.
  private get downloadInvoiceLink(): Locator {
    return this.page.getByRole('link', { name: 'Download Invoice' });
  }

  // Finds the continue button after order placement.
  private get continueButton(): Locator {
    return this.page.locator('[data-qa="continue-button"]');
  }

  // Fills payment details with safe test card data from env.
  async fillPaymentDetails(): Promise<void> {
    this.log('fill payment details');
    await this.nameOnCardInput.fill(paymentData.nameOnCard);
    await this.cardNumberInput.fill(paymentData.cardNumber);
    await this.cvcInput.fill(paymentData.cvc);
    await this.expiryMonthInput.fill(paymentData.expiryMonth);
    await this.expiryYearInput.fill(paymentData.expiryYear);
  }

  // Pays for the order and checks the confirmation page.
  async payAndShouldConfirmOrder(): Promise<void> {
    this.log('pay and confirm order');
    await this.payButton.click();
    await expect(this.orderPlacedTitle).toBeVisible();
  }

  // Downloads the invoice and checks the suggested file name.
  async downloadInvoiceShouldHaveCorrectName(): Promise<void> {
    this.log('download invoice');
    const [download] = await Promise.all([this.page.waitForEvent('download'), this.downloadInvoiceLink.click()]);

    expect(download.suggestedFilename()).toContain('invoice');
  }

  // Continues after successful order placement.
  async continueAfterOrder(): Promise<void> {
    await this.continueButton.click();
  }
}
