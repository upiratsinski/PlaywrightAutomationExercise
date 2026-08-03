import { expect, type Locator, type Page } from '@playwright/test';
import type { TestUser, UserCredentials } from '../data/users.ts';
import { MainPage } from './mainPage.ts';

export class LoginPage {
  constructor(private readonly page: Page) {}

  private get loginEmailInput(): Locator {
    return this.page.getByTestId('login-email');
  }

  private get loginPasswordInput(): Locator {
    return this.page.getByTestId('login-password');
  }

  private get loginButton(): Locator {
    return this.page.getByTestId('login-button');
  }

  private get signupNameInput(): Locator {
    return this.page.getByTestId('signup-name');
  }

  private get signupEmailInput(): Locator {
    return this.page.getByTestId('signup-email');
  }

  private get signupButton(): Locator {
    return this.page.getByTestId('signup-button');
  }

  private get genderRadio(): Locator {
    return this.page.getByRole('radio', { name: 'Mr.' });
  }

  private get registrationPasswordInput(): Locator {
    return this.page.getByTestId('password');
  }

  private get birthDaySelect(): Locator {
    return this.page.getByTestId('days');
  }

  private get birthMonthSelect(): Locator {
    return this.page.getByTestId('months');
  }

  private get birthYearSelect(): Locator {
    return this.page.getByTestId('years');
  }

  private get firstNameInput(): Locator {
    return this.page.getByTestId('first_name');
  }

  private get lastNameInput(): Locator {
    return this.page.getByTestId('last_name');
  }

  private get companyInput(): Locator {
    return this.page.getByTestId('company');
  }

  private get address1Input(): Locator {
    return this.page.getByTestId('address');
  }

  private get address2Input(): Locator {
    return this.page.getByTestId('address2');
  }

  private get countrySelect(): Locator {
    return this.page.getByTestId('country');
  }

  private get stateInput(): Locator {
    return this.page.getByTestId('state');
  }

  private get cityInput(): Locator {
    return this.page.getByTestId('city');
  }

  private get zipCodeInput(): Locator {
    return this.page.getByTestId('zipcode');
  }

  private get mobileNumberInput(): Locator {
    return this.page.getByTestId('mobile_number');
  }

  private get createAccountButton(): Locator {
    return this.page.getByTestId('create-account');
  }

  private get continueButton(): Locator {
    return this.page.getByTestId('continue-button');
  }

  private get accountCreatedTitle(): Locator {
    return this.page.getByTestId('account-created');
  }

  private get invalidLoginError(): Locator {
    return this.page.getByText('Your email or password is incorrect!', { exact: true });
  }

  private get existingEmailError(): Locator {
    return this.page.getByText('Email Address already exist!', { exact: true });
  }

  async shouldBeOpened(): Promise<void> {
    await expect(this.page).toHaveURL('/login');
    await expect(this.page.getByRole('heading', { name: 'Login to your account' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'New User Signup!' })).toBeVisible();
  }

  async register(user: TestUser): Promise<MainPage> {
    await this.submitSignup({ name: user.name, email: user.email });
    await this.fillRegistrationForm(user);
    return this.submitRegistrationForm();
  }

  async login(credentials: UserCredentials): Promise<MainPage> {
    await this.submitLogin(credentials);
    return new MainPage(this.page);
  }

  async submitLogin(credentials: UserCredentials): Promise<void> {
    await this.loginEmailInput.fill(credentials.email);
    await this.loginPasswordInput.fill(credentials.password);
    await this.loginButton.click();
  }

  async shouldShowInvalidLoginError(): Promise<void> {
    await expect(this.invalidLoginError).toBeVisible();
  }

  async submitSignup(user: Pick<TestUser, 'name' | 'email'>): Promise<void> {
    await this.signupNameInput.fill(user.name);
    await this.signupEmailInput.fill(user.email);
    await this.signupButton.click();
  }

  async shouldShowExistingEmailError(): Promise<void> {
    await expect(this.existingEmailError).toBeVisible();
  }

  private async fillRegistrationForm(user: TestUser): Promise<void> {
    await this.genderRadio.check();
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
