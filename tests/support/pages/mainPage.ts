import { expect, type Locator, type Page } from '@playwright/test';
import { CartPage } from './cartPage.ts';
import { ContactUsPage } from './contactUsPage.ts';
import { LoginPage } from './loginPage.ts';
import { ProductsPage } from './productsPage.ts';

export class MainPage {
  constructor(private readonly page: Page) {}

  private get header(): Locator {
    return this.page.getByRole('banner');
  }

  private get homeLink(): Locator {
    return this.header.getByRole('link', { name: 'Home' });
  }

  private get loginLink(): Locator {
    return this.header.getByRole('link', { name: 'Signup / Login' });
  }

  private get productsLink(): Locator {
    return this.header.getByRole('link', { name: 'Products' });
  }

  private get cartLink(): Locator {
    return this.header.getByRole('link', { name: 'Cart' });
  }

  private get contactUsLink(): Locator {
    return this.header.getByRole('link', { name: 'Contact us' });
  }

  private get testCasesLink(): Locator {
    return this.header.getByRole('link', { name: 'Test Cases' });
  }

  private get logoutLink(): Locator {
    return this.page.getByRole('link', { name: 'Logout' });
  }

  private get deleteAccountLink(): Locator {
    return this.page.getByRole('link', { name: 'Delete Account' });
  }

  private get accountDeletedTitle(): Locator {
    return this.page.getByTestId('account-deleted');
  }

  private get continueButton(): Locator {
    return this.page.getByTestId('continue-button');
  }

  private get subscriptionTitle(): Locator {
    return this.page.getByRole('heading', { name: 'Subscription' });
  }

  private get subscriptionEmailInput(): Locator {
    return this.page.getByPlaceholder('Your email address');
  }

  private get subscriptionButton(): Locator {
    return this.page.locator('#subscribe');
  }

  private get subscriptionSuccessMessage(): Locator {
    return this.page.locator('#success-subscribe');
  }

  private get recommendedItemsTitle(): Locator {
    return this.page.getByRole('heading', { name: 'recommended items' });
  }

  private get recommendedAddToCartButton(): Locator {
    // The scenario intentionally selects the first product in the recommendations carousel.
    return this.page.locator('#recommended-item-carousel .item.active a.add-to-cart').first();
  }

  private get viewCartLink(): Locator {
    return this.page.getByRole('link', { name: 'View Cart' });
  }

  private get scrollUpArrow(): Locator {
    return this.page.locator('#scrollUp');
  }

  private get activeCarouselText(): Locator {
    return this.page
      .locator('.carousel-inner .item.active')
      .getByRole('heading', { name: 'Full-Fledged practice website' });
  }

  async open(): Promise<void> {
    await this.page.goto('/');
  }

  async shouldBeOpened(): Promise<void> {
    await expect(this.homeLink).toBeVisible();
    await expect(this.page).toHaveURL('/');
  }

  async openLoginPage(): Promise<LoginPage> {
    await this.loginLink.click();
    return new LoginPage(this.page);
  }

  async openProductsPage(): Promise<ProductsPage> {
    await this.productsLink.click();
    return new ProductsPage(this.page);
  }

  async openCartPage(): Promise<CartPage> {
    await this.cartLink.click();
    return new CartPage(this.page);
  }

  async openContactUsPage(): Promise<ContactUsPage> {
    await this.contactUsLink.click();
    return new ContactUsPage(this.page);
  }

  async openTestCasesPage(): Promise<void> {
    await this.testCasesLink.click();
  }

  async shouldShowTestCasesPage(): Promise<void> {
    await expect(this.page).toHaveURL('/test_cases');
    await expect(this.page.getByRole('heading', { name: 'Test Cases', exact: true })).toBeVisible();
  }

  async shouldShowLoggedInUser(username: string): Promise<void> {
    await expect(this.page.getByText(`Logged in as ${username}`)).toBeVisible();
  }

  async logout(): Promise<LoginPage> {
    await this.logoutLink.click();
    return new LoginPage(this.page);
  }

  async deleteAccount(): Promise<void> {
    await this.deleteAccountLink.click();
    await expect(this.accountDeletedTitle).toBeVisible();
    await this.continueButton.click();
  }

  async shouldShowSubscription(): Promise<void> {
    await this.subscriptionTitle.scrollIntoViewIfNeeded();
    await expect(this.subscriptionTitle).toBeInViewport();
  }

  async subscribe(email: string): Promise<void> {
    await this.subscriptionEmailInput.fill(email);
    await this.subscriptionButton.click();
    await expect(this.subscriptionSuccessMessage).toContainText('You have been successfully subscribed!');
    await expect(this.subscriptionSuccessMessage).toBeVisible();
  }

  async shouldShowCategories(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Category' })).toBeVisible();
  }

  async openWomenDressCategory(): Promise<void> {
    await this.page.locator('#accordian a[href="#Women"]').click();
    await this.page.locator('#Women').getByRole('link', { name: 'Dress' }).click();
    await expect(this.page.getByRole('heading', { name: 'Women - Dress Products' })).toBeVisible();
  }

  async openMenTshirtsCategory(): Promise<void> {
    await this.page.locator('#accordian a[href="#Men"]').click();
    await this.page.locator('#Men').getByRole('link', { name: 'Tshirts' }).click();
    await expect(this.page.getByRole('heading', { name: 'Men - Tshirts Products' })).toBeVisible();
  }

  async shouldShowRecommendedItems(): Promise<void> {
    await this.recommendedItemsTitle.scrollIntoViewIfNeeded();
    await expect(this.recommendedItemsTitle).toBeInViewport();
  }

  async addRecommendedProductToCart(): Promise<CartPage> {
    await this.recommendedAddToCartButton.click();
    await this.viewCartLink.click();
    return new CartPage(this.page);
  }

  async scrollToFooter(): Promise<void> {
    await this.subscriptionTitle.scrollIntoViewIfNeeded();
    await expect(this.subscriptionTitle).toBeInViewport();
  }

  async scrollUpWithArrow(): Promise<void> {
    await this.scrollUpArrow.click();
    await expect(this.activeCarouselText).toBeInViewport();
  }

  async scrollUpManually(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await expect(this.activeCarouselText).toBeInViewport();
  }
}
