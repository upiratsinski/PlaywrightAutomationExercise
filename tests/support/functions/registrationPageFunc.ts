import { Page, expect } from '@playwright/test';
import { LoginSelectors } from '../elements/loginPageUI';
import { registrationData } from '../fixtures/authData.ts';
import { RegistrationSelectors } from '../elements/registrationPageUI';

export async function signUpUser(page: Page, data: typeof registrationData) {
  await page.getByRole('link', { name: ' Signup / Login' }).click();

  await page.locator(LoginSelectors.signupNameInput).fill(data.registrationName);
  await page.locator(LoginSelectors.signupEmailInput).fill(data.registrationEmail);

  await Promise.all([
    page.waitForURL('https://automationexercise.com/signup'),
    page.locator(LoginSelectors.signUpSubmitButton).click(),
  ]);
}

export async function registerUser(page: Page, data: typeof registrationData) {
  await page
    .locator(RegistrationSelectors.passwordRegistrationInput)
    .fill(data.registrationPassword);
  await page
    .locator(RegistrationSelectors.birthDaySelect)
    .selectOption(data.registrationDateOfBirthDay);
  await page
    .locator(RegistrationSelectors.birthMonthSelect)
    .selectOption(data.registrationDateOfBirthMonth);
  await page
    .locator(RegistrationSelectors.birthYearSelect)
    .selectOption(data.registrationDateOfBirthYear);
  await page.locator(RegistrationSelectors.firstNameInput).fill(data.registrationFirstName);
  await page.locator(RegistrationSelectors.lastNameInput).fill(data.registrationLastName);
  await page.locator(RegistrationSelectors.companyInput).fill(data.registrationCompany);
  await page.locator(RegistrationSelectors.address1Input).fill(data.registrationAddress1);
  await page.locator(RegistrationSelectors.address2Input).fill(data.registrationAddress2);
  await page.locator(RegistrationSelectors.countrySelect).selectOption(data.registrationCountry);
  await page.locator(RegistrationSelectors.stateInput).fill(data.registrationState);
  await page.locator(RegistrationSelectors.cityInput).fill(data.registrationCity);
  await page.locator(RegistrationSelectors.zipCodeInput).fill(data.registrationZipCode);
  await page.locator(RegistrationSelectors.mobileNumberInput).fill(data.registrationMobileNumber);

  await Promise.all([
    page.waitForURL('https://automationexercise.com/account_created'),
    page.locator(RegistrationSelectors.createAccountButton).click(),
  ]);

  await expect(
    page.getByText('Congratulations! Your new account has been successfully created!'),
  ).toBeVisible();
  await page.locator(RegistrationSelectors.continueButton).click();
}
