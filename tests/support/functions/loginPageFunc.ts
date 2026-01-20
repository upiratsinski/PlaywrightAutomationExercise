import { Page } from '@playwright/test';
import { validLoginData, invalidLoginData } from '../fixtures/authData';
import { LoginSelectors } from '../elements/loginPageUI';

export async function validLogin(page: Page, data: typeof validLoginData) {
  await page.getByRole('link', { name: ' Signup / Login' }).click();
  await page.locator(LoginSelectors.emailInput).fill(data.validUsername);
  await page.locator(LoginSelectors.passwordInput).fill(data.validPassword);
  await page.locator(LoginSelectors.submitButton).click();
}

export async function invalidLogin(page: Page, data: typeof invalidLoginData) {
  await page.getByRole('link', { name: ' Signup / Login' }).click();
  await page.locator(LoginSelectors.emailInput).fill(data.invalidUsername);
  await page.locator(LoginSelectors.passwordInput).fill(data.invalidPassword);
  await page.locator(LoginSelectors.submitButton).click();
}

export async function invalidSignUp(page: Page, data: typeof validLoginData) {
  await page.getByRole('link', { name: ' Signup / Login' }).click();
  await page.locator(LoginSelectors.signupNameInput).fill(data.validUsername);
  await page.locator(LoginSelectors.signupEmailInput).fill(data.validEmail);
  await page.locator(LoginSelectors.signUpSubmitButton).click();
}
