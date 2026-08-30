import { createUniqueEmail } from '../support/data/users.ts';
import { test } from '../support/fixtures/uiTest.ts';

test.describe('Authentication', () => {
  test('1. Register and delete a user', { tag: '@smoke' }, async ({ generatedUser, homePage }) => {
    await homePage.shouldBeOpened();
    const loginPage = await homePage.openLoginPage();

    await loginPage.shouldBeOpened();
    const registeredHomePage = await loginPage.register(generatedUser);

    await registeredHomePage.shouldShowLoggedInUser(generatedUser.name);
    await registeredHomePage.deleteAccount();
  });

  test('2. Login with correct credentials', { tag: '@smoke' }, async ({ homePage, registeredUser }) => {
    await homePage.shouldBeOpened();
    const loginPage = await homePage.openLoginPage();

    await loginPage.shouldBeOpened();
    const loggedInHomePage = await loginPage.login(registeredUser);

    await loggedInHomePage.shouldShowLoggedInUser(registeredUser.name);
  });

  test('3. Reject incorrect credentials', async ({ homePage }) => {
    const loginPage = await homePage.openLoginPage();

    await loginPage.shouldBeOpened();
    await loginPage.submitLogin({
      email: createUniqueEmail('invalid-ui-user'),
      password: 'invalid-ui-password',
    });
    await loginPage.shouldShowInvalidLoginError();
  });

  test('4. Logout a user', async ({ homePage, registeredUser }) => {
    const loginPage = await homePage.openLoginPage();
    const loggedInHomePage = await loginPage.login(registeredUser);

    await loggedInHomePage.shouldShowLoggedInUser(registeredUser.name);
    const loginPageAfterLogout = await loggedInHomePage.logout();

    await loginPageAfterLogout.shouldBeOpened();
  });

  test('5. Reject registration with an existing email', async ({ homePage, registeredUser }) => {
    const loginPage = await homePage.openLoginPage();

    await loginPage.shouldBeOpened();
    await loginPage.submitSignup(registeredUser);
    await loginPage.shouldShowExistingEmailError();
  });
});
