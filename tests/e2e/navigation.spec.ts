import { createSubscriptionEmail } from '../support/data/users.ts';
import { test } from '../support/fixtures/uiTest.ts';

test.describe('Navigation and page behavior', () => {
  test('7. Open the test cases page', async ({ homePage }) => {
    await homePage.shouldBeOpened();
    await homePage.openTestCasesPage();
    await homePage.shouldShowTestCasesPage();
  });

  test('10. Subscribe from the home page', async ({ homePage }) => {
    await homePage.shouldBeOpened();
    await homePage.shouldShowSubscription();
    await homePage.subscribe(createSubscriptionEmail('home-subscription'));
  });

  test('25. Scroll up with the arrow button', async ({ homePage }) => {
    await homePage.shouldBeOpened();
    await homePage.scrollToFooter();
    await homePage.scrollUpWithArrow();
  });

  test('26. Scroll up without the arrow button', async ({ homePage }) => {
    await homePage.shouldBeOpened();
    await homePage.scrollToFooter();
    await homePage.scrollUpManually();
  });
});
