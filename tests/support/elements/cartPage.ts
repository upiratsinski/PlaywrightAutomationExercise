import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locators for cart items

  private get cartDescription(): Locator {
    return this.page.locator('td.cart_description');
  }

  private get cartPrice(): Locator {
    return this.page.locator('td.cart_price');
  }

  private get cartQuantity(): Locator {
    return this.page.locator('td.cart_quantity');
  }

  private get cartTotalPrice(): Locator {
    return this.page.locator('td.cart_total_price');
  }

  private get deleteBtn(): Locator {
    return this.page.locator('td.cart_delete > a.cart_quantity_delete');
  }

  // Method to verify cart item details
  async verifyCartItemDetails(
    expectedDescription: string,
    expectedPrice: string,
    expectedQuantity: string,
    expectedTotalPrice: string,
  ): Promise<void> {
    await expect(this.cartDescription).toHaveText(expectedDescription);
    await expect(this.cartPrice).toHaveText(expectedPrice);
    await expect(this.cartQuantity).toHaveText(expectedQuantity);
    await expect(this.cartTotalPrice).toHaveText(expectedTotalPrice);
  }

  // Method to delete an item from the cart
  async deleteCartItem(): Promise<void> {
    await this.deleteBtn.click();
  }
}
