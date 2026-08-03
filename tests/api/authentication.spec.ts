import { getInvalidApiLoginData } from '../support/data/api.ts';
import { expect, test } from '../support/fixtures/apiTest.ts';

test.describe('Authentication API', () => {
  test(
    'API 7: POST To Verify Login with valid details',
    { tag: ['@smoke', '@regression'] },
    async ({ apiClient, registeredApiUser }) => {
      const response = await apiClient.verifyLogin(registeredApiUser);

      expect(response.httpStatus).toBe(200);
      expect(response.body.responseCode).toBe(200);
      expect(response.body.message).toBe('User exists!');
    },
  );

  test('API 8: POST To Verify Login without email parameter', { tag: '@regression' }, async ({ apiClient }) => {
    const { password } = getInvalidApiLoginData();
    const response = await apiClient.verifyLogin({ password });

    expect(response.httpStatus).toBe(200);
    expect(response.body.responseCode).toBe(400);
    expect(response.body.message).toBe('Bad request, email or password parameter is missing in POST request.');
  });

  test('API 9: DELETE To Verify Login', { tag: '@regression' }, async ({ apiClient }) => {
    const response = await apiClient.deleteVerifyLogin();

    expect(response.httpStatus).toBe(200);
    expect(response.body.responseCode).toBe(405);
    expect(response.body.message).toBe('This request method is not supported.');
  });

  test('API 10: POST To Verify Login with invalid details', { tag: '@regression' }, async ({ apiClient }) => {
    const response = await apiClient.verifyLogin(getInvalidApiLoginData());

    expect(response.httpStatus).toBe(200);
    expect(response.body.responseCode).toBe(404);
    expect(response.body.message).toBe('User not found!');
  });
});
