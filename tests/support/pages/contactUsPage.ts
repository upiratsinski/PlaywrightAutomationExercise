import { expect, Locator, Page } from '@playwright/test';
import { MainPage } from './mainPage.ts';
import { BasePage } from './basePage.ts';
import { contactUsData } from '../data/authData.ts';

export class ContactUsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

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

  private get successMessage(): Locator {
    return this.page.locator('.status.alert.alert-success');
  }

  async submitContactForm(): Promise<MainPage> {
    this.log('submit contact us form');
    const dialogMessagePromise = new Promise<string>((resolve) => {
      this.page.once('dialog', async (dialog) => {
        const message = dialog.message();

        await dialog.accept();
        resolve(message);
      });
    });

    await this.nameInput.fill(contactUsData.name);
    await this.emailInput.fill(contactUsData.email);
    await this.subjectInput.fill(contactUsData.subject);
    await this.messageTextarea.fill(contactUsData.message);
    await this.uploadFileInput.setInputFiles(contactUsData.filePath);

    await expect(this.nameInput).toHaveValue(contactUsData.name);
    await expect(this.emailInput).toHaveValue(contactUsData.email);
    await expect(this.subjectInput).toHaveValue(contactUsData.subject);
    await expect(this.messageTextarea).toHaveValue(contactUsData.message);

    await this.submitButton.click();
    expect(await dialogMessagePromise).toBe('Press OK to proceed!');
    await expect(this.successMessage).toBeVisible();

    return new MainPage(this.page);
  }
}
