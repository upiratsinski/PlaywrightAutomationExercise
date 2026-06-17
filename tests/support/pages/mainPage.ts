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

  // Finds the Home link in the header menu.
  private get homeLink(): Locator {
    return this.header.locator('li a[href="/"]');
  }

  // Finds the Signup/Login link in the header menu.
  private get loginLink(): Locator {
    return this.header.locator('a[href="/login"]');
  }

  // Finds the Products link in the header menu.
  private get productsLink(): Locator {
    return this.header.locator('a[href="/products"]');
  }

  // Finds the Cart link in the header menu.
  private get cartLink(): Locator {
    return this.header.locator('a[href="/view_cart"]');
  }

  // Finds the Contact Us link in the header menu.
  private get contactUsLink(): Locator {
    return this.header.locator('a[href="/contact_us"]');
  }

  // Finds the Test Cases link in the header menu.
  private get testCasesLink(): Locator {
    return this.header.locator('a[href="/test_cases"]');
  }

  // Finds the Logout link shown for logged-in users.
  private get logoutLink(): Locator {
    return this.page.locator('a[href="/logout"]');
  }

  // Finds the Delete Account link shown for logged-in users.
  private get deleteAccountLink(): Locator {
    return this.page.locator('a[href="/delete_account"]');
  }

  // Finds the account deleted confirmation title.
  private get accountDeletedTitle(): Locator {
    return this.page.locator('[data-qa="account-deleted"]');
  }

  // Finds the Continue button on account status pages.
  private get continueButton(): Locator {
    return this.page.locator('[data-qa="continue-button"]');
  }

  // Finds the footer subscription title.
  private get subscriptionTitle(): Locator {
    return this.page.getByRole('heading', { name: 'Subscription' });
  }

  // Finds the footer subscription email input.
  private get subscriptionEmailInput(): Locator {
    return this.page.locator('#susbscribe_email');
  }

  // Finds the footer subscription submit button.
  private get subscriptionButton(): Locator {
    return this.page.locator('#subscribe');
  }

  // Finds the footer subscription success message.
  private get subscriptionSuccessMessage(): Locator {
    return this.page.locator('#success-subscribe');
  }

  // Finds the left category sidebar.
  private get categorySidebar(): Locator {
    return this.page.locator('.left-sidebar');
  }

  // Finds the recommended items section title.
  private get recommendedItemsTitle(): Locator {
    return this.page.getByRole('heading', { name: 'recommended items' });
  }

  // Finds the first Add to Cart button in recommended items.
  private get recommendedAddToCartButton(): Locator {
    return this.page.locator('.recommended_items a.add-to-cart').first();
  }

  // Finds the View Cart link in add-to-cart modals.
  private get viewCartLink(): Locator {
    return this.page.getByRole('link', { name: 'View Cart' });
  }

  // Finds the scroll-up arrow button.
  private get scrollUpArrow(): Locator {
    return this.page.locator('#scrollUp');
  }

  // Finds the top carousel headline after scrolling up.
  private get carouselText(): Locator {
    return this.page.getByRole('heading', { name: 'Full-Fledged practice website' }).first();
  }

  // Finds the page header that contains the main navigation.
  private get header(): Locator {
    return this.page.getByRole('banner');
  }

  // Opens the application home page before every UI scenario.
  async open(): Promise<void> {
    this.log('open home page');
    await this.page.goto('/');
  }

  // Checks that the home page is opened.
  async shouldBeOpened(): Promise<void> {
    await expect(this.homeLink).toBeVisible();
    await expect(this.page).toHaveURL('/');
  }

  // Opens the signup and login page.
  async openLoginPage(): Promise<LoginPage> {
    this.log('open signup and login page');
    await this.loginLink.click();
    return new LoginPage(this.page);
  }

  // Opens the products catalog page.
  async openProductsPage(): Promise<ProductsPage> {
    this.log('open products page');
    await this.productsLink.click();
    return new ProductsPage(this.page);
  }

  // Opens the cart page.
  async openCartPage(): Promise<CartPage> {
    this.log('open cart page');
    await this.cartLink.click();
    return new CartPage(this.page);
  }

  // Opens the contact form page.
  async openContactUsPage(): Promise<ContactUsPage> {
    this.log('open contact us page');
    await this.contactUsLink.click();
    return new ContactUsPage(this.page);
  }

  // Opens the Test Cases page.
  async openTestCasesPage(): Promise<void> {
    this.log('open test cases page');
    await this.testCasesLink.click();
  }

  // Checks that the Test Cases page is visible.
  async shouldShowTestCasesPage(): Promise<void> {
    await expect(this.page).toHaveURL('/test_cases');
    await expect(this.page.getByRole('heading', { name: 'Test Cases', exact: true })).toBeVisible();
  }

  // Checks that the freshly registered user is shown in the header.
  async shouldShowRegistrationUser(): Promise<void> {
    await this.shouldShowLoggedInUser(registrationData.name);
  }

  // Checks that the reusable login user is shown in the header.
  async shouldShowLoginUser(): Promise<void> {
    await this.shouldShowLoggedInUser(validLoginData.username);
  }

  // Logs out the current user.
  async logout(): Promise<LoginPage> {
    this.log('log out current user');
    await this.logoutLink.click();
    return new LoginPage(this.page);
  }

  // Deletes the current user account.
  async deleteAccount(): Promise<void> {
    this.log('delete current account');
    await this.deleteAccountLink.click();
    await expect(this.accountDeletedTitle).toBeVisible();
    await this.continueButton.click();
  }

  // Deletes the current account only when a logged-in user is present.
  async deleteAccountIfLoggedIn(): Promise<void> {
    if (await this.deleteAccountLink.isVisible()) {
      await this.deleteAccount();
    }
  }

  // Checks that the subscription block is visible.
  async shouldShowSubscription(): Promise<void> {
    await this.subscriptionTitle.scrollIntoViewIfNeeded();
    await expect(this.subscriptionTitle).toBeVisible();
  }

  // Subscribes with a generated test email from the home page footer.
  async subscribeWithDefaultEmail(): Promise<void> {
    this.log('subscribe from home page footer');
    await this.subscriptionEmailInput.fill(subscriptionData.email);
    await this.subscriptionButton.click();
    await expect(this.subscriptionSuccessMessage).toContainText('You have been successfully subscribed!');
  }

  // Checks that product categories are visible.
  async shouldShowCategories(): Promise<void> {
    await expect(this.categorySidebar.getByRole('heading', { name: 'Category' })).toBeVisible();
  }

  // Opens the Women Dress category and checks its title.
  async openWomenDressCategory(): Promise<void> {
    this.log('open women dress category');
    await this.page.locator('a[href="#Women"]').click();
    await this.page.locator('#Women').getByRole('link', { name: 'Dress' }).click();
    await expect(this.page.getByRole('heading', { name: 'Women - Dress Products' })).toBeVisible();
  }

  // Opens the Men Tshirts category and checks its title.
  async openMenTshirtsCategory(): Promise<void> {
    this.log('open men tshirts category');
    await this.page.locator('a[href="#Men"]').click();
    await this.page.locator('#Men').getByRole('link', { name: 'Tshirts' }).click();
    await expect(this.page.getByRole('heading', { name: 'Men - Tshirts Products' })).toBeVisible();
  }

  // Checks that recommended products are visible.
  async shouldShowRecommendedItems(): Promise<void> {
    await this.recommendedItemsTitle.scrollIntoViewIfNeeded();
    await expect(this.recommendedItemsTitle).toBeVisible();
  }

  // Adds the first recommended product and opens the cart.
  async addRecommendedProductToCart(): Promise<CartPage> {
    this.log('add recommended product to cart');
    await this.recommendedAddToCartButton.click();
    await this.viewCartLink.click();
    return new CartPage(this.page);
  }

  // Scrolls to the footer area.
  async scrollToFooter(): Promise<void> {
    await this.subscriptionTitle.scrollIntoViewIfNeeded();
  }

  // Scrolls back to the top using the page arrow button.
  async scrollUpWithArrow(): Promise<void> {
    this.log('scroll up with arrow button');
    await this.scrollUpArrow.click();
    await expect(this.carouselText).toBeVisible();
  }

  // Scrolls back to the top using browser scroll.
  async scrollUpManually(): Promise<void> {
    this.log('scroll up with browser script');
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await expect(this.carouselText).toBeVisible();
  }

  // Checks that the header shows the expected logged-in username.
  private async shouldShowLoggedInUser(username: string): Promise<void> {
    await expect(this.page.getByText(`Logged in as ${username}`)).toBeVisible();
  }
}
