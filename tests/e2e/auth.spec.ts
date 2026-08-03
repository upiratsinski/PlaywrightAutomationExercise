import { createUniqueEmail } from '../support/data/users.ts';
import { test } from '../support/fixtures/uiTest.ts';

test.describe('Authentication', { tag: '@regression' }, () => {
  test('1. Register and delete a user', { tag: '@smoke' }, async ({ generatedUser, mainPage }) => {
    await mainPage.shouldBeOpened();
    const loginPage = await mainPage.openLoginPage();

    await loginPage.shouldBeOpened();
    const registeredMainPage = await loginPage.register(generatedUser);

    await registeredMainPage.shouldShowLoggedInUser(generatedUser.name);
    await registeredMainPage.deleteAccount();
  });

  test('2. Login with correct credentials', { tag: '@smoke' }, async ({ mainPage, registeredUser }) => {
    await mainPage.shouldBeOpened();
    const loginPage = await mainPage.openLoginPage();

    await loginPage.shouldBeOpened();
    const loggedInMainPage = await loginPage.login(registeredUser);

    await loggedInMainPage.shouldShowLoggedInUser(registeredUser.name);
  });

  test('3. Reject incorrect credentials', async ({ mainPage }) => {
    const loginPage = await mainPage.openLoginPage();

    await loginPage.shouldBeOpened();
    await loginPage.submitLogin({
      email: createUniqueEmail('invalid-ui-user'),
      password: 'invalid-ui-password',
    });
    await loginPage.shouldShowInvalidLoginError();
  });

  test('4. Logout a user', async ({ mainPage, registeredUser }) => {
    const loginPage = await mainPage.openLoginPage();
    const loggedInMainPage = await loginPage.login(registeredUser);

    await loggedInMainPage.shouldShowLoggedInUser(registeredUser.name);
    const loginPageAfterLogout = await loggedInMainPage.logout();

    await loginPageAfterLogout.shouldBeOpened();
  });

  test('5. Reject registration with an existing email', async ({ mainPage, registeredUser }) => {
    const loginPage = await mainPage.openLoginPage();

    await loginPage.shouldBeOpened();
    await loginPage.submitSignup(registeredUser);
    await loginPage.shouldShowExistingEmailError();
  });
});
