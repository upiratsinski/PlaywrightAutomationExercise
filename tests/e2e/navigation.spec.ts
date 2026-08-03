import { createSubscriptionEmail } from '../support/data/users.ts';
import { test } from '../support/fixtures/uiTest.ts';

test.describe('Navigation and page behavior', { tag: '@regression' }, () => {
  test('7. Open the test cases page', async ({ mainPage }) => {
    await mainPage.shouldBeOpened();
    await mainPage.openTestCasesPage();
    await mainPage.shouldShowTestCasesPage();
  });

  test('10. Subscribe from the home page', async ({ mainPage }) => {
    await mainPage.shouldBeOpened();
    await mainPage.shouldShowSubscription();
    await mainPage.subscribe(createSubscriptionEmail('home-subscription'));
  });

  test('25. Scroll up with the arrow button', async ({ mainPage }) => {
    await mainPage.shouldBeOpened();
    await mainPage.scrollToFooter();
    await mainPage.shouldShowSubscription();
    await mainPage.scrollUpWithArrow();
  });

  test('26. Scroll up without the arrow button', async ({ mainPage }) => {
    await mainPage.shouldBeOpened();
    await mainPage.scrollToFooter();
    await mainPage.shouldShowSubscription();
    await mainPage.scrollUpManually();
  });
});
