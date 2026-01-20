import { Page } from '@playwright/test';
import { validLoginData, invalidLoginData } from '../fixtures/authData';
import { ContactUsPageSelectors } from '../elements/contactUsPageUI';
import path from 'path';

export async function fillContactUsForm(page: Page, data: typeof validLoginData) {
  await page.locator(ContactUsPageSelectors.nameInput).fill(data.validUsername);
  await page.locator(ContactUsPageSelectors.emailInput).fill(data.validEmail);
  await page.locator(ContactUsPageSelectors.subjectInput).fill(data.contactUsSubject);
  await page.locator(ContactUsPageSelectors.messageTextarea).fill(data.contactUsMessage);

  const filePath = path.resolve(__dirname, '../fixtures/SampleFile.txt');

  await page.locator(ContactUsPageSelectors.uploadFileInput).setInputFiles(filePath);

  await page.locator(ContactUsPageSelectors.submitButton).click();
}
