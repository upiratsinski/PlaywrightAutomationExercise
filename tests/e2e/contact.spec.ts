import { contactUsData } from '../support/data/contact.ts';
import { test } from '../support/fixtures/uiTest.ts';

test.describe('Contact', () => {
  test('6. Submit the contact form', async ({ homePage }) => {
    await homePage.shouldBeOpened();
    const contactPage = await homePage.openContactUsPage();

    await contactPage.submit(contactUsData);
    await contactPage.shouldShowSuccess();
  });
});
