import { expect, Locator, Page } from '@playwright/test';

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

  async fillPaymentDetails(): Promise<void> {
    await this.nameOnCardInput.fill('Luke Skywalker');
    await this.cardNumberInput.fill('4111111111111111');
    await this.cvcInput.fill('123');
    await this.expiryMonthInput.fill('12');
    await this.expiryYearInput.fill('2030');
  }

  async payAndConfirmOrder(): Promise<void> {
    await this.payButton.click();
    await expect(this.orderPlacedTitle).toBeVisible();
  }

  async downloadInvoice(): Promise<void> {
    const download = await Promise.all([
      this.page.waitForEvent('download'),
      this.downloadInvoiceLink.click(),
    ]);

    expect(download[0].suggestedFilename()).toContain('invoice');
  }

  async continueAfterOrder(): Promise<void> {
    await this.continueButton.click();
  }
}
