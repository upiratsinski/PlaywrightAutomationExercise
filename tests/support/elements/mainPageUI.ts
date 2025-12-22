import { Locator, Page } from '@playwright/test';

export interface Element {
  locator: (page: Page) => Locator;
  name: string;
  text?: string;
  attribute?: {
    type: string;
    value: string;
  };
}

export const mainPageElements: Element[] = [
  {
    locator: (page: Page) => page.getByRole('link', { name: 'Home' }),
    name: 'Home Button link',
    text: 'Home',
    attribute: { type: 'href', value: '/' },
  },
  {
    locator: (page: Page) => page.getByRole('link', { name: 'Products' }),
    name: 'Products link',
    text: 'Products',
    attribute: { type: 'href', value: '/products' },
  },
  {
    locator: (page: Page) => page.getByRole('link', { name: 'Cart' }),
    name: 'Cart link',
    text: 'Cart',
    attribute: { type: 'href', value: '/view_cart' },
  },
  {
    locator: (page: Page) => page.getByRole('link', { name: ' Signup / Login' }),
    name: ' Signup / Login',
    text: 'Signup / Login',
    attribute: { type: 'href', value: '/login' },
  },
  {
    locator: (page: Page) => page.getByRole('link', { name: ' Test Cases' }),
    name: 'Test Cases',
    text: 'Test Cases',
    attribute: { type: 'href', value: '/test_cases' },
  },
  {
    locator: (page: Page) => page.getByRole('link', { name: 'API Testing' }),
    name: 'API Testing link',
    text: 'API Testing',
    attribute: { type: 'href', value: '/api_list' },
  },
  {
    locator: (page: Page) => page.getByRole('link', { name: 'Video Tutorials' }),
    name: 'Video Tutorials link',
    text: 'Video Tutorials',
    attribute: { type: 'href', value: 'https://www.youtube.com/c/AutomationExercise' },
  },
  {
    locator: (page: Page) => page.getByRole('link', { name: 'Contact us' }),
    name: 'Contact us link',
    text: 'Contact us',
    attribute: { type: 'href', value: '/contact_us' },
  },
];
