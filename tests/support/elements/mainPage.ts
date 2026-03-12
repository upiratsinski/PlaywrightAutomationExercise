import { Locator, Page, expect } from '@playwright/test';
import { ProductsPage } from './productsPage.ts';
import { validLoginData, invalidLoginData } from '../fixtures/authData.ts';
import { LoginPage } from './loginPage.ts';

export class MainPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locators for main page elements

  private get homeButton() {
    return this.page.getByRole('link', { name: 'Home' });
  }

  private get productsLink() {
    return this.page.getByRole('link', { name: 'Products' });
  }

  private get cartLink() {
    return this.page.getByRole('link', { name: 'Cart' });
  }

  private get signupLoginLink() {
    return this.page.getByRole('link', { name: ' Signup / Login' });
  }

  private get testCasesLink() {
    return this.page.getByRole('link', { name: ' Test Cases' });
  }

  private get apiTestingLink() {
    return this.page.getByRole('link', { name: 'API Testing' });
  }

  private get videoTutorialsLink() {
    return this.page.getByRole('link', { name: 'Video Tutorials' });
  }

  private get contactUsLink() {
    return this.page.getByRole('link', { name: 'Contact us' });
  }

  private get loggedInUser() {
    return this.page.getByText(' Logged in as ');
  }

  private get logoutLink() {
    return this.page.getByRole('link', { name: 'logout' });
  }

  // Method to navigate to the login page
  async navigateToLoginPage(): Promise<LoginPage> {
    await this.signupLoginLink.click();
    return new LoginPage(this.page);
  }
  // Method to navigate to products page
  async navigateToProductsPage(): Promise<ProductsPage> {
    await this.productsLink.click();
    return new ProductsPage(this.page);
  }

  // Method to open the main page (if needed)
  async openMainPage(): Promise<void> {
    await this.page.goto('/');
  }

  // Method to navigate to cart page
  async navigateToCartPage(): Promise<void> {
    await this.cartLink.click();
  }

  // Method to navigate to signup/login page
  async navigateToSignupLoginPage(): Promise<void> {
    await this.signupLoginLink.click();
  }

  // Method to navigate to contact us page
  async navigateToContactUsPage(): Promise<void> {
    await this.contactUsLink.click();
  }

  // Method to navigate to test cases page
  async navigateToTestCasesPage(): Promise<void> {
    await this.testCasesLink.click();
  }

  // Method to navigate to API testing page
  async navigateToAPITestingPage(): Promise<void> {
    await this.apiTestingLink.click();
  }

  // Method to navigate to video tutorials page
  async navigateToVideoTutorialsPage(): Promise<void> {
    await this.videoTutorialsLink.click();
  }

  // Method to navigate to home page
  async navigateToHomePage(): Promise<void> {
    await this.homeButton.click();
  }
  // Method to perform logout
  async logout(): Promise<MainPage> {
    await this.logoutLink.click();
    return new MainPage(this.page);
  }
}
