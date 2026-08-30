import { expect, type Locator, type Page } from '@playwright/test';
import type { ContactFormData } from '../data/contact.ts';

export class ContactUsPage {
  constructor(private readonly page: Page) {}

  private get nameInput(): Locator {
    return this.page.getByTestId('name');
  }

  private get emailInput(): Locator {
    return this.page.getByTestId('email');
  }

  private get subjectInput(): Locator {
    return this.page.getByTestId('subject');
  }

  private get messageTextarea(): Locator {
    return this.page.getByTestId('message');
  }

  private get uploadFileInput(): Locator {
    return this.page.locator('input[name="upload_file"]');
  }

  private get submitButton(): Locator {
    return this.page.getByTestId('submit-button');
  }

  private get successMessage(): Locator {
    return this.page
      .locator('#contact-page')
      .getByText('Success! Your details have been submitted successfully.', { exact: true });
  }

  async submit(data: ContactFormData): Promise<void> {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.subjectInput.fill(data.subject);
    await this.messageTextarea.fill(data.message);
    await this.uploadFileInput.setInputFiles(data.filePath);

    const dialogMessagePromise = this.page.waitForEvent('dialog').then(async (dialog) => {
      const message = dialog.message();
      await dialog.accept();
      return message;
    });

    await this.submitButton.click();
    expect(await dialogMessagePromise).toBe('Press OK to proceed!');
  }

  async shouldShowSuccess(): Promise<void> {
    await expect(this.successMessage).toBeVisible();
  }
}
