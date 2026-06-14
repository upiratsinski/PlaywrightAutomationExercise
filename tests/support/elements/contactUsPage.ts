import { Page, Locator, expect } from '@playwright/test';
import { MainPage } from './mainPage';
import { contactUsData } from '../fixtures/authData';
export class ContactUsPage {
  private readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  //Locators for contact us page elements

  private get nameInput(): Locator {
    return this.page.locator('[data-qa="name"]');
  }
  private get emailInput(): Locator {
    return this.page.locator('[data-qa="email"]');
  }
  private get subjectInput(): Locator {
    return this.page.locator('[data-qa="subject"]');
  }
  private get messageTextarea(): Locator {
    return this.page.locator('[data-qa="message"]');
  }
  private get uploadFileInput(): Locator {
    return this.page.locator('input[name="upload_file"]');
  }
  private get submitButton(): Locator {
    return this.page.locator('[data-qa="submit-button"]');
  }

  // Method to fill out and submit the contact us form
  async fillContactUsForm(): Promise<MainPage> {
    this.page.once('dialog', (dialog) => dialog.accept());

    await this.nameInput.fill(contactUsData.name);
    await this.emailInput.fill(contactUsData.email);
    await this.subjectInput.fill(contactUsData.subject);
    await this.messageTextarea.fill(contactUsData.message);
    await expect(this.nameInput).toHaveValue(contactUsData.name);
    await expect(this.emailInput).toHaveValue(contactUsData.email);
    await expect(this.subjectInput).toHaveValue(contactUsData.subject);
    await expect(this.messageTextarea).toHaveValue(contactUsData.message);

    if (contactUsData.filePath) {
      await this.uploadFileInput.setInputFiles(contactUsData.filePath);
    }

    await this.submitButton.click();

    return new MainPage(this.page);
  }

  // Method to accept the dialog that appears after form submission
  async catchDialog(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }
}
