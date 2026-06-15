import { expect, Page } from '@playwright/test';
import { ProductsPage } from './productsPage.ts';
import { LoginPage } from './loginPage.ts';
import { ContactUsPage } from './contactUsPage.ts';
import { CartPage } from './cartPage.ts';
import { registrationData, subscriptionData, validLoginData } from '../fixtures/authData.ts';

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

  private get deleteAccountLink() {
    return this.page.locator('a[href="/delete_account"]');
  }

  private get continueButton() {
    return this.page.locator('[data-qa="continue-button"]');
  }

  private get subscriptionTitle() {
    return this.page.getByRole('heading', { name: 'Subscription' });
  }

  private get subscriptionEmailInput() {
    return this.page.locator('#susbscribe_email');
  }

  private get subscriptionButton() {
    return this.page.locator('#subscribe');
  }

  private get subscriptionSuccessMessage() {
    return this.page.locator('#success-subscribe');
  }

  private get recommendedItemsTitle() {
    return this.page.getByRole('heading', { name: 'recommended items' });
  }

  private get recommendedAddToCartButton() {
    return this.page.locator('.recommended_items a.add-to-cart').first();
  }

  private get viewCartLink() {
    return this.page.getByRole('link', { name: 'View Cart' });
  }

  private get categorySidebar() {
    return this.page.locator('.left-sidebar');
  }

  private get scrollUpArrow() {
    return this.page.locator('#scrollUp');
  }

  private get carouselText() {
    return this.page.getByRole('heading', { name: 'Full-Fledged practice website' }).first();
  }

  // Verifies that home page is opened.
  async verifyHomePageVisible(): Promise<void> {
    await expect(this.homeButton).toBeVisible();
    await expect(this.page).toHaveURL(/automationexercise\.com\/?$/);
  }

  // Verifies subscription block in footer.
  async verifySubscription(): Promise<void> {
    await this.subscriptionTitle.scrollIntoViewIfNeeded();
    await expect(this.subscriptionTitle).toBeVisible();
  }

  // Submits subscription email and checks success message.
  async subscribe(email: string): Promise<void> {
    await this.subscriptionEmailInput.fill(email);
    await this.subscriptionButton.click();
    await expect(this.subscriptionSuccessMessage).toContainText('You have been successfully subscribed!');
  }

  // Subscribes with default test email.
  async subscribeWithDefaultEmail(): Promise<void> {
    await this.subscribe(subscriptionData.email);
  }

  // Verifies that a specific username is logged in.
  async verifyLoggedInAs(username: string): Promise<void> {
    await expect(this.page.getByText(`Logged in as ${username}`)).toBeVisible();
  }

  // Verifies registration user is logged in.
  async verifyLoggedInAsRegistrationUser(): Promise<void> {
    await this.verifyLoggedInAs(registrationData.registrationName);
  }

  // Verifies login user is logged in.
  async verifyLoggedInAsLoginUser(): Promise<void> {
    await this.verifyLoggedInAs(validLoginData.validUsername);
  }

  // Deletes the current logged-in account.
  async deleteAccount(): Promise<void> {
    await this.deleteAccountLink.click();
    await expect(this.page.locator('[data-qa="account-deleted"]')).toBeVisible();
    await this.continueButton.click();
  }

  // Deletes account only when delete link is visible.
  async deleteAccountIfLoggedIn(): Promise<void> {
    if (!(await this.deleteAccountLink.isVisible())) {
      return;
    }

    await this.deleteAccount();
  }

  // Verifies category sidebar is visible.
  async verifyCategoriesVisible(): Promise<void> {
    await expect(this.categorySidebar.getByRole('heading', { name: 'Category' })).toBeVisible();
  }

  // Opens Women Dress category and checks page title.
  async openWomenDressCategory(): Promise<void> {
    await this.page.locator('a[href="#Women"]').click();
    await this.page.locator('#Women').getByRole('link', { name: 'Dress' }).click();
    await expect(this.page.getByRole('heading', { name: 'Women - Dress Products' })).toBeVisible();
  }

  // Opens Men Tshirts category and checks page title.
  async openMenTshirtsCategory(): Promise<void> {
    await this.page.locator('a[href="#Men"]').click();
    await this.page.locator('#Men').getByRole('link', { name: 'Tshirts' }).click();
    await expect(this.page.getByRole('heading', { name: 'Men - Tshirts Products' })).toBeVisible();
  }

  // Verifies recommended items block.
  async verifyRecommendedItemsVisible(): Promise<void> {
    await this.recommendedItemsTitle.scrollIntoViewIfNeeded();
    await expect(this.recommendedItemsTitle).toBeVisible();
  }

  // Adds first recommended item to cart.
  async addRecommendedProductToCart(): Promise<CartPage> {
    await this.recommendedAddToCartButton.click();
    await this.viewCartLink.click();
    return new CartPage(this.page);
  }

  // Scrolls to footer area.
  async scrollToBottom(): Promise<void> {
    await this.subscriptionTitle.scrollIntoViewIfNeeded();
  }

  // Scrolls up using arrow button.
  async scrollUpWithArrow(): Promise<void> {
    await this.scrollUpArrow.click();
    await expect(this.carouselText).toBeVisible();
  }

  // Scrolls up using page script.
  async scrollUpManually(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await expect(this.carouselText).toBeVisible();
  }

  // Opens login page.
  async navigateToLoginPage(): Promise<LoginPage> {
    await this.signupLoginLink.click();
    return new LoginPage(this.page);
  }
  // Opens products page.
  async navigateToProductsPage(): Promise<ProductsPage> {
    await this.productsLink.click();
    return new ProductsPage(this.page);
  }

  // Opens the home page.
  async openMainPage(): Promise<void> {
    await this.page.goto('/');
  }

  // Opens cart page.
  async navigateToCartPage(): Promise<CartPage> {
    await this.cartLink.click();
    return new CartPage(this.page);
  }

  // Opens signup/login page.
  async navigateToSignupLoginPage(): Promise<void> {
    await this.signupLoginLink.click();
  }

  // Opens contact us page.
  async navigateToContactUsPage(): Promise<ContactUsPage> {
    await this.contactUsLink.click();
    return new ContactUsPage(this.page);
  }

  // Opens test cases page.
  async navigateToTestCasesPage(): Promise<void> {
    await this.testCasesLink.click();
  }

  // Verifies test cases page.
  async verifyTestCasesPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/test_cases$/);
    await expect(this.page.getByRole('heading', { name: 'Test Cases', exact: true })).toBeVisible();
  }

  // Opens API testing page.
  async navigateToAPITestingPage(): Promise<void> {
    await this.apiTestingLink.click();
  }

  // Opens video tutorials page.
  async navigateToVideoTutorialsPage(): Promise<void> {
    await this.videoTutorialsLink.click();
  }

  // Opens home page from header.
  async navigateToHomePage(): Promise<void> {
    await this.homeButton.click();
  }
  // Logs out current user.
  async logout(): Promise<MainPage> {
    await this.logoutLink.click();
    return new MainPage(this.page);
  }
}
