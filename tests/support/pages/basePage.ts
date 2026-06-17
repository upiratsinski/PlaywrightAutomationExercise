import { Page } from '@playwright/test';
import { logAction } from '../utils/logger.ts';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  protected log(action: string): void {
    logAction(`${this.constructor.name}: ${action}`);
  }
}
