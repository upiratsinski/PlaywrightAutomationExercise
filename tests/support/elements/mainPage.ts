import { expect, Page } from '@playwright/test';
import { ProductsPage } from './productsPage.ts';
import { LoginPage } from './loginPage.ts';
import { ContactUsPage } from './contactUsPage.ts';
import { CartPage } from './cartPage.ts';

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

  async verifyHomePageVisible(): Promise<void> {
    await expect(this.homeButton).toBeVisible();
    await expect(this.page).toHaveURL(/automationexercise\.com\/?$/);
  }

  async verifySubscription(): Promise<void> {
    await this.subscriptionTitle.scrollIntoViewIfNeeded();
    await expect(this.subscriptionTitle).toBeVisible();
  }

  async subscribe(email: string): Promise<void> {
    await this.subscriptionEmailInput.fill(email);
    await this.subscriptionButton.click();
    await expect(this.subscriptionSuccessMessage).toContainText('You have been successfully subscribed!');
  }

  async verifyLoggedInAs(username: string): Promise<void> {
    await expect(this.page.getByText(`Logged in as ${username}`)).toBeVisible();
  }

  async deleteAccount(): Promise<void> {
    await this.deleteAccountLink.click();
    await expect(this.page.locator('[data-qa="account-deleted"]')).toBeVisible();
    await this.continueButton.click();
  }

  async verifyCategoriesVisible(): Promise<void> {
    await expect(this.categorySidebar.getByRole('heading', { name: 'Category' })).toBeVisible();
  }

  async openWomenDressCategory(): Promise<void> {
    await this.page.locator('a[href="#Women"]').click();
    await this.page.locator('#Women').getByRole('link', { name: 'Dress' }).click();
    await expect(this.page.getByRole('heading', { name: 'Women - Dress Products' })).toBeVisible();
  }

  async openMenTshirtsCategory(): Promise<void> {
    await this.page.locator('a[href="#Men"]').click();
    await this.page.locator('#Men').getByRole('link', { name: 'Tshirts' }).click();
    await expect(this.page.getByRole('heading', { name: 'Men - Tshirts Products' })).toBeVisible();
  }

  async verifyRecommendedItemsVisible(): Promise<void> {
    await this.recommendedItemsTitle.scrollIntoViewIfNeeded();
    await expect(this.recommendedItemsTitle).toBeVisible();
  }

  async addRecommendedProductToCart(): Promise<CartPage> {
    await this.recommendedAddToCartButton.click();
    await this.viewCartLink.click();
    return new CartPage(this.page);
  }

  async scrollToBottom(): Promise<void> {
    await this.subscriptionTitle.scrollIntoViewIfNeeded();
  }

  async scrollUpWithArrow(): Promise<void> {
    await this.scrollUpArrow.click();
    await expect(this.carouselText).toBeVisible();
  }

  async scrollUpManually(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await expect(this.carouselText).toBeVisible();
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
  async navigateToCartPage(): Promise<CartPage> {
    await this.cartLink.click();
    return new CartPage(this.page);
  }

  // Method to navigate to signup/login page
  async navigateToSignupLoginPage(): Promise<void> {
    await this.signupLoginLink.click();
  }

  // Method to navigate to contact us page
  async navigateToContactUsPage(): Promise<ContactUsPage> {
    await this.contactUsLink.click();
    return new ContactUsPage(this.page);
  }

  // Method to navigate to test cases page
  async navigateToTestCasesPage(): Promise<void> {
    await this.testCasesLink.click();
  }

  async verifyTestCasesPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/test_cases$/);
    await expect(this.page.getByRole('heading', { name: 'Test Cases', exact: true })).toBeVisible();
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
