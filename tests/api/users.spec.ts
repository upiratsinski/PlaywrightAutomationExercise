import type { ApiUser } from '../support/data/users.ts';
import { expect, test } from '../support/fixtures/apiTest.ts';

test.describe('Users API', () => {
  test('API 11: POST To Create/Register User Account', async ({ apiClient, generatedApiUser }) => {
    const response = await apiClient.createAccount(generatedApiUser);

    expect(response.httpStatus).toBe(200);
    expect(response.body.responseCode).toBe(201);
    expect(response.body.message).toBe('User created!');
  });

  test('API 12: DELETE METHOD To Delete User Account', async ({ apiClient, registeredApiUser }) => {
    const response = await apiClient.deleteAccount(registeredApiUser.email, registeredApiUser.password);

    expect(response.httpStatus).toBe(200);
    expect(response.body.responseCode).toBe(200);
    expect(response.body.message).toBe('Account deleted!');
  });

  test('API 13: PUT METHOD To Update User Account', async ({ apiClient, registeredApiUser }) => {
    const updatedUser: ApiUser = {
      ...registeredApiUser,
      firstname: 'Updated',
      lastname: 'Api User',
      city: 'Tel Aviv',
    };
    const updateResponse = await apiClient.updateAccount(updatedUser);

    expect(updateResponse.httpStatus).toBe(200);
    expect(updateResponse.body.responseCode).toBe(200);
    expect(updateResponse.body.message).toBe('User updated!');

    const detailsResponse = await apiClient.getUserDetails(updatedUser.email);

    expect(detailsResponse.httpStatus).toBe(200);
    expect(detailsResponse.body.responseCode).toBe(200);
    expect(detailsResponse.body.user).toMatchObject({
      email: updatedUser.email,
      first_name: updatedUser.firstname,
      last_name: updatedUser.lastname,
      city: updatedUser.city,
    });
  });

  test('API 14: GET user account detail by email', async ({ apiClient, registeredApiUser }) => {
    const response = await apiClient.getUserDetails(registeredApiUser.email);

    expect(response.httpStatus).toBe(200);
    expect(response.body.responseCode).toBe(200);
    expect(response.body.user).toEqual(
      expect.objectContaining({
        email: registeredApiUser.email,
        first_name: registeredApiUser.firstname,
        last_name: registeredApiUser.lastname,
      }),
    );
  });
});
