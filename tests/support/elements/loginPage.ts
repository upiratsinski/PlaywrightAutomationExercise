import { expect, Page } from '@playwright/test';
import { MainPage } from './mainPage.ts';
import { validLoginData, invalidLoginData, loginUserProfileData } from '../fixtures/authData.ts';
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

  private get accountCreatedTitle() {
    return this.page.locator('[data-qa="account-created"]');
  }

  //Delete user selectors

  private get deleteAccountButton() {
    return this.page.locator('a[href="/delete_account"]');
  }

  private get confirmDeleteButton() {
    return this.page.locator('a[data-qa="continue-button"]');
  }

  // Registers a new user with registration data.
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
    await expect(this.accountCreatedTitle).toBeVisible();
    await this.continueButton.click();
    return new MainPage(this.page);
  }

  // Registers reusable login user.
  async registerLoginUser(): Promise<MainPage> {
    await this.genderRadio.click();
    await this.passwordRegistrationInput.fill(validLoginData.validPassword);
    await this.birthDaySelect.selectOption(loginUserProfileData.birthDay);
    await this.birthMonthSelect.selectOption(loginUserProfileData.birthMonth);
    await this.birthYearSelect.selectOption(loginUserProfileData.birthYear);
    await this.firstNameInput.fill(loginUserProfileData.firstName);
    await this.lastNameInput.fill(loginUserProfileData.lastName);
    await this.companyInput.fill(loginUserProfileData.company);
    await this.address1Input.fill(loginUserProfileData.address1);
    await this.address2Input.fill(loginUserProfileData.address2);
    await this.countrySelect.selectOption(loginUserProfileData.country);
    await this.stateInput.fill(loginUserProfileData.state);
    await this.cityInput.fill(loginUserProfileData.city);
    await this.zipCodeInput.fill(loginUserProfileData.zipCode);
    await this.mobileNumberInput.fill(loginUserProfileData.mobileNumber);
    await this.createAccountButton.click();
    await expect(this.accountCreatedTitle).toBeVisible();
    await this.continueButton.click();
    return new MainPage(this.page);
  }
  // Deletes the logged-in user.
  async deleteUser(): Promise<MainPage> {
    await this.deleteAccountButton.click();
    await this.confirmDeleteButton.click();
    return new MainPage(this.page);
  }
  // Starts signup with registration data.
  async signup(): Promise<MainPage> {
    await this.signupNameInput.fill(registrationData.registrationName);
    await this.signupEmailInput.fill(registrationData.registrationEmail);
    await this.signUpSubmitButton.click();
    return new MainPage(this.page);
  }

  // Starts signup with login user data.
  async signupLoginUser(): Promise<MainPage> {
    await this.signupNameInput.fill(validLoginData.validUsername);
    await this.signupEmailInput.fill(validLoginData.validEmail);
    await this.signUpSubmitButton.click();
    return new MainPage(this.page);
  }

  // Logs in with valid credentials.
  async login(): Promise<MainPage> {
    await this.emailInput.fill(validLoginData.validEmail);
    await this.passwordInput.fill(validLoginData.validPassword);
    await this.submitButton.click();
    return new MainPage(this.page);
  }

  // Tries login with invalid credentials.
  async loginWithInvalidCredentials(): Promise<void> {
    await this.emailInput.fill(invalidLoginData.invalidEmail);
    await this.passwordInput.fill(invalidLoginData.invalidPassword);
    await this.submitButton.click();
  }

  // Starts signup with existing email.
  async signupWithExistingEmail(): Promise<void> {
    await this.signupNameInput.fill(validLoginData.validUsername);
    await this.signupEmailInput.fill(validLoginData.validEmail);
    await this.signUpSubmitButton.click();
  }
}
