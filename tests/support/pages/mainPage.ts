import { expect, Locator, Page } from '@playwright/test';
import { CartPage } from './cartPage.ts';
import { ContactUsPage } from './contactUsPage.ts';
import { LoginPage } from './loginPage.ts';
import { ProductsPage } from './productsPage.ts';
import { BasePage } from './basePage.ts';
import { registrationData, subscriptionData, validLoginData } from '../data/authData.ts';

export class MainPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private get homeLink(): Locator {
    return this.header.locator('li a[href="/"]');
  }

  private get loginLink(): Locator {
    return this.header.locator('a[href="/login"]');
  }

  private get productsLink(): Locator {
    return this.header.locator('a[href="/products"]');
  }

  private get cartLink(): Locator {
    return this.header.locator('a[href="/view_cart"]');
  }

  private get contactUsLink(): Locator {
    return this.header.locator('a[href="/contact_us"]');
  }

  private get testCasesLink(): Locator {
    return this.header.locator('a[href="/test_cases"]');
  }

  private get logoutLink(): Locator {
    return this.page.locator('a[href="/logout"]');
  }

  private get deleteAccountLink(): Locator {
    return this.page.locator('a[href="/delete_account"]');
  }

  private get accountDeletedTitle(): Locator {
    return this.page.locator('[data-qa="account-deleted"]');
  }

  private get continueButton(): Locator {
    return this.page.locator('[data-qa="continue-button"]');
  }

  private get subscriptionTitle(): Locator {
    return this.page.getByRole('heading', { name: 'Subscription' });
  }

  private get subscriptionEmailInput(): Locator {
    return this.page.locator('#susbscribe_email');
  }

  private get subscriptionButton(): Locator {
    return this.page.locator('#subscribe');
  }

  private get subscriptionSuccessMessage(): Locator {
    return this.page.locator('#success-subscribe');
  }

  private get categorySidebar(): Locator {
    return this.page.locator('.left-sidebar');
  }

  private get recommendedItemsTitle(): Locator {
    return this.page.getByRole('heading', { name: 'recommended items' });
  }

  private get recommendedAddToCartButton(): Locator {
    return this.page.locator('.recommended_items a.add-to-cart').first();
  }

  private get viewCartLink(): Locator {
    return this.page.getByRole('link', { name: 'View Cart' });
  }

  private get scrollUpArrow(): Locator {
    return this.page.locator('#scrollUp');
  }

  private get carouselText(): Locator {
    return this.page.getByRole('heading', { name: 'Full-Fledged practice website' }).first();
  }

  private get header(): Locator {
    return this.page.getByRole('banner');
  }

  // Opens the application home page before every UI scenario.
  async open(): Promise<void> {
    this.log('open home page');
    await this.page.goto('/');
  }

  async shouldBeOpened(): Promise<void> {
    await expect(this.homeLink).toBeVisible();
    await expect(this.page).toHaveURL('/');
  }

  async openLoginPage(): Promise<LoginPage> {
    this.log('open signup and login page');
    await this.loginLink.click();
    return new LoginPage(this.page);
  }

  async openProductsPage(): Promise<ProductsPage> {
    this.log('open products page');
    await this.productsLink.click();
    return new ProductsPage(this.page);
  }

  async openCartPage(): Promise<CartPage> {
    this.log('open cart page');
    await this.cartLink.click();
    return new CartPage(this.page);
  }

  async openContactUsPage(): Promise<ContactUsPage> {
    this.log('open contact us page');
    await this.contactUsLink.click();
    return new ContactUsPage(this.page);
  }

  async openTestCasesPage(): Promise<void> {
    this.log('open test cases page');
    await this.testCasesLink.click();
  }

  async shouldShowTestCasesPage(): Promise<void> {
    await expect(this.page).toHaveURL('/test_cases');
    await expect(this.page.getByRole('heading', { name: 'Test Cases', exact: true })).toBeVisible();
  }

  async shouldShowRegistrationUser(): Promise<void> {
    await this.shouldShowLoggedInUser(registrationData.name);
  }

  async shouldShowLoginUser(): Promise<void> {
    await this.shouldShowLoggedInUser(validLoginData.username);
  }

  async logout(): Promise<LoginPage> {
    this.log('log out current user');
    await this.logoutLink.click();
    return new LoginPage(this.page);
  }

  async deleteAccount(): Promise<void> {
    this.log('delete current account');
    await this.deleteAccountLink.click();
    await expect(this.accountDeletedTitle).toBeVisible();
    await this.continueButton.click();
  }

  async deleteAccountIfLoggedIn(): Promise<void> {
    if (await this.deleteAccountLink.isVisible()) {
      await this.deleteAccount();
    }
  }

  async shouldShowSubscription(): Promise<void> {
    await this.subscriptionTitle.scrollIntoViewIfNeeded();
    await expect(this.subscriptionTitle).toBeVisible();
  }

  async subscribeWithDefaultEmail(): Promise<void> {
    this.log('subscribe from home page footer');
    await this.subscriptionEmailInput.fill(subscriptionData.email);
    await this.subscriptionButton.click();
    await expect(this.subscriptionSuccessMessage).toContainText('You have been successfully subscribed!');
  }

  async shouldShowCategories(): Promise<void> {
    await expect(this.categorySidebar.getByRole('heading', { name: 'Category' })).toBeVisible();
  }

  async openWomenDressCategory(): Promise<void> {
    this.log('open women dress category');
    await this.page.locator('a[href="#Women"]').click();
    await this.page.locator('#Women').getByRole('link', { name: 'Dress' }).click();
    await expect(this.page.getByRole('heading', { name: 'Women - Dress Products' })).toBeVisible();
  }

  async openMenTshirtsCategory(): Promise<void> {
    this.log('open men tshirts category');
    await this.page.locator('a[href="#Men"]').click();
    await this.page.locator('#Men').getByRole('link', { name: 'Tshirts' }).click();
    await expect(this.page.getByRole('heading', { name: 'Men - Tshirts Products' })).toBeVisible();
  }

  async shouldShowRecommendedItems(): Promise<void> {
    await this.recommendedItemsTitle.scrollIntoViewIfNeeded();
    await expect(this.recommendedItemsTitle).toBeVisible();
  }

  async addRecommendedProductToCart(): Promise<CartPage> {
    this.log('add recommended product to cart');
    await this.recommendedAddToCartButton.click();
    await this.viewCartLink.click();
    return new CartPage(this.page);
  }

  async scrollToFooter(): Promise<void> {
    await this.subscriptionTitle.scrollIntoViewIfNeeded();
  }

  async scrollUpWithArrow(): Promise<void> {
    this.log('scroll up with arrow button');
    await this.scrollUpArrow.click();
    await expect(this.carouselText).toBeVisible();
  }

  async scrollUpManually(): Promise<void> {
    this.log('scroll up with browser script');
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await expect(this.carouselText).toBeVisible();
  }

  private async shouldShowLoggedInUser(username: string): Promise<void> {
    await expect(this.page.getByText(`Logged in as ${username}`)).toBeVisible();
  }
}
