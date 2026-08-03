import { expect, type Locator, type Page } from '@playwright/test';
import type { PaymentDetails } from '../data/checkout.ts';
import { MainPage } from './mainPage.ts';

export class PaymentPage {
  constructor(private readonly page: Page) {}

  private get nameOnCardInput(): Locator {
    return this.page.getByTestId('name-on-card');
  }

  private get cardNumberInput(): Locator {
    return this.page.getByTestId('card-number');
  }

  private get cvcInput(): Locator {
    return this.page.getByTestId('cvc');
  }

  private get expiryMonthInput(): Locator {
    return this.page.getByTestId('expiry-month');
  }

  private get expiryYearInput(): Locator {
    return this.page.getByTestId('expiry-year');
  }

  private get payButton(): Locator {
    return this.page.getByTestId('pay-button');
  }

  private get orderPlacedTitle(): Locator {
    return this.page.getByTestId('order-placed');
  }

  private get downloadInvoiceLink(): Locator {
    return this.page.getByRole('link', { name: 'Download Invoice' });
  }

  private get continueButton(): Locator {
    return this.page.getByTestId('continue-button');
  }

  async fillPaymentDetails(data: PaymentDetails): Promise<void> {
    await this.nameOnCardInput.fill(data.nameOnCard);
    await this.cardNumberInput.fill(data.cardNumber);
    await this.cvcInput.fill(data.cvc);
    await this.expiryMonthInput.fill(data.expiryMonth);
    await this.expiryYearInput.fill(data.expiryYear);
  }

  async pay(): Promise<void> {
    await this.payButton.click();
  }

  async shouldShowSuccessfulOrder(): Promise<void> {
    await expect(this.orderPlacedTitle).toBeVisible();
  }

  async downloadInvoiceShouldHaveCorrectName(): Promise<void> {
    const [download] = await Promise.all([this.page.waitForEvent('download'), this.downloadInvoiceLink.click()]);
    expect(download.suggestedFilename()).toContain('invoice');
  }

  async continueAfterOrder(): Promise<MainPage> {
    await this.continueButton.click();
    return new MainPage(this.page);
  }
}
