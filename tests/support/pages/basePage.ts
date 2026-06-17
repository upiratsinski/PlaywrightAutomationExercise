import { Page } from '@playwright/test';
import { logAction } from '../utils/logger.ts';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Logs page actions with the current Page Object name.
  protected log(action: string): void {
    logAction(`${this.constructor.name}: ${action}`);
  }
}
