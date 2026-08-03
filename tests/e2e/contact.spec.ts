import { contactUsData } from '../support/data/contact.ts';
import { test } from '../support/fixtures/uiTest.ts';

test.describe('Contact', { tag: '@regression' }, () => {
  test('6. Submit the contact form', async ({ mainPage }) => {
    await mainPage.shouldBeOpened();
    const contactPage = await mainPage.openContactUsPage();

    await contactPage.submit(contactUsData);
    await contactPage.shouldShowSuccess();
  });
});
