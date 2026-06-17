import { expect, Locator, Page } from '@playwright/test';
import { MainPage } from './mainPage.ts';
import { BasePage } from './basePage.ts';
import { invalidLoginData, loginUserProfileData, registrationData, validLoginData } from '../data/authData.ts';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Finds the login email input.
  private get loginEmailInput(): Locator {
    return this.page.locator('[data-qa="login-email"]');
  }

  // Finds the login password input.
  private get loginPasswordInput(): Locator {
    return this.page.locator('[data-qa="login-password"]');
  }

  // Finds the login submit button.
  private get loginButton(): Locator {
    return this.page.locator('[data-qa="login-button"]');
  }

  // Finds the signup name input.
  private get signupNameInput(): Locator {
    return this.page.locator('[data-qa="signup-name"]');
  }

  // Finds the signup email input.
  private get signupEmailInput(): Locator {
    return this.page.locator('[data-qa="signup-email"]');
  }

  // Finds the signup submit button.
  private get signupButton(): Locator {
    return this.page.locator('[data-qa="signup-button"]');
  }

  // Finds the gender radio button used by test users.
  private get genderRadio(): Locator {
    return this.page.locator('#id_gender1');
  }

  // Finds the registration password input.
  private get registrationPasswordInput(): Locator {
    return this.page.locator('[data-qa="password"]');
  }

  // Finds the birth day select.
  private get birthDaySelect(): Locator {
    return this.page.locator('[data-qa="days"]');
  }

  // Finds the birth month select.
  private get birthMonthSelect(): Locator {
    return this.page.locator('[data-qa="months"]');
  }

  // Finds the birth year select.
  private get birthYearSelect(): Locator {
    return this.page.locator('[data-qa="years"]');
  }

  // Finds the first name input.
  private get firstNameInput(): Locator {
    return this.page.locator('[data-qa="first_name"]');
  }

  // Finds the last name input.
  private get lastNameInput(): Locator {
    return this.page.locator('[data-qa="last_name"]');
  }

  // Finds the company input.
  private get companyInput(): Locator {
    return this.page.locator('[data-qa="company"]');
  }

  // Finds the first address input.
  private get address1Input(): Locator {
    return this.page.locator('[data-qa="address"]');
  }

  // Finds the second address input.
  private get address2Input(): Locator {
    return this.page.locator('[data-qa="address2"]');
  }

  // Finds the country select.
  private get countrySelect(): Locator {
    return this.page.locator('[data-qa="country"]');
  }

  // Finds the state input.
  private get stateInput(): Locator {
    return this.page.locator('[data-qa="state"]');
  }

  // Finds the city input.
  private get cityInput(): Locator {
    return this.page.locator('[data-qa="city"]');
  }

  // Finds the zip code input.
  private get zipCodeInput(): Locator {
    return this.page.locator('[data-qa="zipcode"]');
  }

  // Finds the mobile number input.
  private get mobileNumberInput(): Locator {
    return this.page.locator('[data-qa="mobile_number"]');
  }

  // Finds the create account button.
  private get createAccountButton(): Locator {
    return this.page.locator('[data-qa="create-account"]');
  }

  // Finds the continue button after account creation.
  private get continueButton(): Locator {
    return this.page.locator('[data-qa="continue-button"]');
  }

  // Finds the account created confirmation title.
  private get accountCreatedTitle(): Locator {
    return this.page.locator('[data-qa="account-created"]');
  }

  // Finds the invalid login error message.
  private get invalidLoginError(): Locator {
    return this.page.getByText('Your email or password is incorrect!');
  }

  // Finds the duplicate email signup error message.
  private get existingEmailError(): Locator {
    return this.page.getByText('Email Address already exist!');
  }

  // Checks that the login/signup page is opened.
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

  // Logs in with the reusable valid user.
  async loginAsValidUser(): Promise<MainPage> {
    this.log('login as valid user');
    await this.loginEmailInput.fill(validLoginData.email);
    await this.loginPasswordInput.fill(validLoginData.password);
    await this.loginButton.click();
    return new MainPage(this.page);
  }

  // Tries invalid credentials and checks the validation error.
  async loginWithInvalidCredentialsShouldFail(): Promise<void> {
    this.log('try login with invalid credentials');
    await this.loginEmailInput.fill(invalidLoginData.email);
    await this.loginPasswordInput.fill(invalidLoginData.password);
    await this.loginButton.click();
    await expect(this.invalidLoginError).toBeVisible();
  }

  // Tries duplicate signup and checks the validation error.
  async registerWithExistingEmailShouldFail(): Promise<void> {
    this.log('try signup with existing email');
    await this.startSignup(validLoginData.username, validLoginData.email);
    await expect(this.existingEmailError).toBeVisible();
  }

  // Starts the signup flow with name and email.
  private async startSignup(name: string, email: string): Promise<void> {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
  }

  // Fills the shared registration form fields.
  private async fillRegistrationForm(
    user: typeof registrationData | (typeof loginUserProfileData & { password: string }),
  ): Promise<void> {
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

  // Submits registration and returns to the main page.
  private async submitRegistrationForm(): Promise<MainPage> {
    await this.createAccountButton.click();
    await expect(this.accountCreatedTitle).toBeVisible();
    await this.continueButton.click();
    return new MainPage(this.page);
  }
}
