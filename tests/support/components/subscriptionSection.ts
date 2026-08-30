import { expect, type Locator } from '@playwright/test';

export class SubscriptionSection {
  constructor(private readonly root: Locator) {}

  private get title(): Locator {
    return this.root.getByRole('heading', { name: 'Subscription' });
  }

  private get emailInput(): Locator {
    return this.root.getByPlaceholder('Your email address');
  }

  private get subscribeButton(): Locator {
    return this.root.locator('#subscribe');
  }

  private get successMessage(): Locator {
    return this.root.getByText('You have been successfully subscribed!', { exact: true });
  }

  async shouldBeVisibleInViewport(): Promise<void> {
    await this.title.scrollIntoViewIfNeeded();
    await expect(this.title).toBeInViewport();
  }

  async subscribe(email: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.subscribeButton.click();
    await expect(this.successMessage).toBeVisible();
  }
}
