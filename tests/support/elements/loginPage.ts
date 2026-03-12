// export const LoginSelectors = {
//   emailInput: '[data-qa="login-email"]',
//   passwordInput: '[data-qa="login-password"]',
//   submitButton: '[data-qa="login-button"]',
//   signupNameInput: '[data-qa="signup-name"]',
//   signupEmailInput: '[data-qa="signup-email"]',
//   signUpSubmitButton: '[data-qa="signup-button"]',
// };

import { Locator, Page, expect } from '@playwright/test';
import { MainPage } from './mainPage.ts';
import { validLoginData, invalidLoginData } from '../fixtures/authData.ts';
import { registrationData } from '../fixtures/authData.ts';

export class LoginPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Login/Signup selectors

  private get emailInput() {
    return this.page.locator('[data-qa="login-email"]');
  }

  private get passwordInput() {
    return this.page.locator('[data-qa="login-password"]');
  }

  private get submitButton() {
    return this.page.locator('[data-qa="login-button"]');
  }

  private get signupNameInput() {
    return this.page.locator('[data-qa="signup-name"]');
  }

  private get signupEmailInput() {
    return this.page.locator('[data-qa="signup-email"]');
  }

  private get signUpSubmitButton() {
    return this.page.locator('[data-qa="signup-button"]');
  }

  // Registration selectors

  private get genderRadio() {
    return this.page.locator('#id_gender1');
  }

  private get passwordRegistrationInput() {
    return this.page.locator('[data-qa="password"]');
  }

  private get birthDaySelect() {
    return this.page.locator('[data-qa="days"]');
  }

  private get birthMonthSelect() {
    return this.page.locator('[data-qa="months"]');
  }

  private get birthYearSelect() {
    return this.page.locator('[data-qa="years"]');
  }

  private get firstNameInput() {
    return this.page.locator('[data-qa="first_name"]');
  }

  private get lastNameInput() {
    return this.page.locator('[data-qa="last_name"]');
  }

  private get companyInput() {
    return this.page.locator('[data-qa="company"]');
  }

  private get address1Input() {
    return this.page.locator('[data-qa="address"]');
  }

  private get address2Input() {
    return this.page.locator('[data-qa="address2"]');
  }

  private get countrySelect() {
    return this.page.locator('[data-qa="country"]');
  }

  private get stateInput() {
    return this.page.locator('[data-qa="state"]');
  }

  private get cityInput() {
    return this.page.locator('[data-qa="city"]');
  }

  private get zipCodeInput() {
    return this.page.locator('[data-qa="zipcode"]');
  }

  private get mobileNumberInput() {
    return this.page.locator('[data-qa="mobile_number"]');
  }

  private get createAccountButton() {
    return this.page.locator('[data-qa="create-account"]');
  }

  private get continueButton() {
    return this.page.locator('[data-qa="continue-button"]');
  }

  //Delete user selectors

  private get deleteAccountButton() {
    return this.page.locator('a[href="/delete_account"]');
  }

  private get confirmDeleteButton() {
    return this.page.locator('a[data-qa="continue-button"]');
  }

  // Method to perform registration
  async registerUser(): Promise<MainPage> {
    await this.genderRadio.click();
    await this.passwordRegistrationInput.fill(registrationData.registrationPassword);
    await this.birthDaySelect.selectOption(registrationData.registrationDateOfBirthDay);
    await this.birthMonthSelect.selectOption(registrationData.registrationDateOfBirthMonth);
    await this.birthYearSelect.selectOption(registrationData.registrationDateOfBirthYear);
    await this.firstNameInput.fill(registrationData.registrationFirstName);
    await this.lastNameInput.fill(registrationData.registrationLastName);
    await this.companyInput.fill(registrationData.registrationCompany);
    await this.address1Input.fill(registrationData.registrationAddress1);
    await this.address2Input.fill(registrationData.registrationAddress2);
    await this.countrySelect.selectOption(registrationData.registrationCountry);
    await this.stateInput.fill(registrationData.registrationState);
    await this.cityInput.fill(registrationData.registrationCity);
    await this.zipCodeInput.fill(registrationData.registrationZipCode);
    await this.mobileNumberInput.fill(registrationData.registrationMobileNumber);

    await this.createAccountButton.click();
    await this.continueButton.click();
    return new MainPage(this.page);
  }
  //Method to delete the logged-in user
  async deleteUser(): Promise<MainPage> {
    await this.deleteAccountButton.click();
    await this.confirmDeleteButton.click();
    return new MainPage(this.page);
  }
  // Method to perform signup
  async signup(): Promise<MainPage> {
    await this.signupNameInput.fill(validLoginData.validUsername);
    await this.signupEmailInput.fill(validLoginData.validEmail);
    await this.signUpSubmitButton.click();
    return new MainPage(this.page);
  }

  // Method to perform login
  async login(): Promise<MainPage> {
    await this.emailInput.fill(validLoginData.validEmail);
    await this.passwordInput.fill(validLoginData.validPassword);
    await this.submitButton.click();
    return new MainPage(this.page);
  }

  // Method to perform login with invalid credentials
  async loginWithInvalidCredentials(): Promise<void> {
    await this.emailInput.fill(invalidLoginData.invalidEmail);
    await this.passwordInput.fill(invalidLoginData.invalidPassword);
    await this.submitButton.click();
  }

  // Method to perform signup with existing email
  async signupWithExistingEmail(): Promise<void> {
    await this.signupNameInput.fill(validLoginData.validUsername);
    await this.signupEmailInput.fill(validLoginData.validEmail);
    await this.signUpSubmitButton.click();
  }
}
