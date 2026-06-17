import { expect, Locator, Page } from '@playwright/test';
import { MainPage } from './mainPage.ts';
import { BasePage } from './basePage.ts';
import { invalidLoginData, loginUserProfileData, registrationData, validLoginData } from '../data/authData.ts';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private get loginEmailInput(): Locator {
    return this.page.locator('[data-qa="login-email"]');
  }

  private get loginPasswordInput(): Locator {
    return this.page.locator('[data-qa="login-password"]');
  }

  private get loginButton(): Locator {
    return this.page.locator('[data-qa="login-button"]');
  }

  private get signupNameInput(): Locator {
    return this.page.locator('[data-qa="signup-name"]');
  }

  private get signupEmailInput(): Locator {
    return this.page.locator('[data-qa="signup-email"]');
  }

  private get signupButton(): Locator {
    return this.page.locator('[data-qa="signup-button"]');
  }

  private get genderRadio(): Locator {
    return this.page.locator('#id_gender1');
  }

  private get registrationPasswordInput(): Locator {
    return this.page.locator('[data-qa="password"]');
  }

  private get birthDaySelect(): Locator {
    return this.page.locator('[data-qa="days"]');
  }

  private get birthMonthSelect(): Locator {
    return this.page.locator('[data-qa="months"]');
  }

  private get birthYearSelect(): Locator {
    return this.page.locator('[data-qa="years"]');
  }

  private get firstNameInput(): Locator {
    return this.page.locator('[data-qa="first_name"]');
  }

  private get lastNameInput(): Locator {
    return this.page.locator('[data-qa="last_name"]');
  }

  private get companyInput(): Locator {
    return this.page.locator('[data-qa="company"]');
  }

  private get address1Input(): Locator {
    return this.page.locator('[data-qa="address"]');
  }

  private get address2Input(): Locator {
    return this.page.locator('[data-qa="address2"]');
  }

  private get countrySelect(): Locator {
    return this.page.locator('[data-qa="country"]');
  }

  private get stateInput(): Locator {
    return this.page.locator('[data-qa="state"]');
  }

  private get cityInput(): Locator {
    return this.page.locator('[data-qa="city"]');
  }

  private get zipCodeInput(): Locator {
    return this.page.locator('[data-qa="zipcode"]');
  }

  private get mobileNumberInput(): Locator {
    return this.page.locator('[data-qa="mobile_number"]');
  }

  private get createAccountButton(): Locator {
    return this.page.locator('[data-qa="create-account"]');
  }

  private get continueButton(): Locator {
    return this.page.locator('[data-qa="continue-button"]');
  }

  private get accountCreatedTitle(): Locator {
    return this.page.locator('[data-qa="account-created"]');
  }

  private get invalidLoginError(): Locator {
    return this.page.getByText('Your email or password is incorrect!');
  }

  private get existingEmailError(): Locator {
    return this.page.getByText('Email Address already exist!');
  }

  async shouldBeOpened(): Promise<void> {
    await expect(this.page).toHaveURL('/login');
    await expect(this.page.getByRole('heading', { name: 'Login to your account' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'New User Signup!' })).toBeVisible();
  }

  // Registers a one-off user for scenarios that need a fresh account.
  async registerNewUser(): Promise<MainPage> {
    this.log('register new user');
    await this.startSignup(registrationData.name, registrationData.email);
    await this.fillRegistrationForm(registrationData);
    return this.submitRegistrationForm();
  }

  // Creates the reusable account used by positive login scenarios.
  async registerReusableLoginUser(): Promise<MainPage> {
    this.log('register reusable login user');
    await this.startSignup(validLoginData.username, validLoginData.email);
    await this.fillRegistrationForm({
      ...loginUserProfileData,
      password: validLoginData.password,
    });
    return this.submitRegistrationForm();
  }

  async loginAsValidUser(): Promise<MainPage> {
    this.log('login as valid user');
    await this.loginEmailInput.fill(validLoginData.email);
    await this.loginPasswordInput.fill(validLoginData.password);
    await this.loginButton.click();
    return new MainPage(this.page);
  }

  async loginWithInvalidCredentialsShouldFail(): Promise<void> {
    this.log('try login with invalid credentials');
    await this.loginEmailInput.fill(invalidLoginData.email);
    await this.loginPasswordInput.fill(invalidLoginData.password);
    await this.loginButton.click();
    await expect(this.invalidLoginError).toBeVisible();
  }

  async registerWithExistingEmailShouldFail(): Promise<void> {
    this.log('try signup with existing email');
    await this.startSignup(validLoginData.username, validLoginData.email);
    await expect(this.existingEmailError).toBeVisible();
  }

  private async startSignup(name: string, email: string): Promise<void> {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
  }

  private async fillRegistrationForm(user: typeof registrationData | (typeof loginUserProfileData & { password: string })): Promise<void> {
    await this.genderRadio.click();
    await this.registrationPasswordInput.fill(user.password);
    await this.birthDaySelect.selectOption(user.birthDay);
    await this.birthMonthSelect.selectOption(user.birthMonth);
    await this.birthYearSelect.selectOption(user.birthYear);
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.companyInput.fill(user.company);
    await this.address1Input.fill(user.address1);
    await this.address2Input.fill(user.address2);
    await this.countrySelect.selectOption(user.country);
    await this.stateInput.fill(user.state);
    await this.cityInput.fill(user.city);
    await this.zipCodeInput.fill(user.zipCode);
    await this.mobileNumberInput.fill(user.mobileNumber);
  }

  private async submitRegistrationForm(): Promise<MainPage> {
    await this.createAccountButton.click();
    await expect(this.accountCreatedTitle).toBeVisible();
    await this.continueButton.click();
    return new MainPage(this.page);
  }
}
