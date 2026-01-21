import { Page, expect } from '@playwright/test';
import { validLoginData, invalidLoginData } from '../fixtures/authData';
import { ContactUsPageSelectors } from '../elements/contactUsPageUI';
import path from 'path';

export async function fillContactUsForm(page: Page, data: typeof validLoginData) {
  page.once('dialog', async (dialog) => {
    await dialog.accept();
  });

  await page.locator(ContactUsPageSelectors.nameInput).fill(data.validUsername);
  await page.locator(ContactUsPageSelectors.emailInput).fill(data.validEmail);
  await page.locator(ContactUsPageSelectors.subjectInput).fill(data.contactUsSubject);
  await page.locator(ContactUsPageSelectors.messageTextarea).fill(data.contactUsMessage);

  const filePath = path.resolve(__dirname, '../fixtures/SampleFile.txt');
  await page.locator(ContactUsPageSelectors.uploadFileInput).setInputFiles(filePath);

  await Promise.all([
    page.waitForResponse((resp) => resp.url().includes('/contact_us') && resp.status() === 200),
    page.locator(ContactUsPageSelectors.submitButton).click(),
  ]);

  const overlayClose = page.locator('.popup-overlay .close-button');
  if (await overlayClose.isVisible()) {
    await overlayClose.click();
  }

  const successMessage = page.locator('.alert-success');
  await expect(successMessage).toBeVisible();
  await expect(successMessage).toHaveText(
    'Success! Your details have been submitted successfully.',
  );
}
