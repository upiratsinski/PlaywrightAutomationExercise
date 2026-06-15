import { test } from '@playwright/test';
import { AutomationExerciseApi } from '../support/api/automationExerciseApi.ts';

test.describe('Automation Exercise API tests', () => {
  let automationExerciseApi: AutomationExerciseApi;

  // Creates API client before each test.
  test.beforeEach(async ({ request }) => {
    automationExerciseApi = new AutomationExerciseApi(request);
  });

  // Creates a reusable API user before API tests.
  test.beforeAll(async ({ request }) => {
    await new AutomationExerciseApi(request).createApiUser();
  });

  // Deletes the reusable API user after API tests.
  test.afterAll(async ({ request }) => {
    await new AutomationExerciseApi(request).deleteApiUser();
  });

  // Verifies that products list is returned.
  test('API 1: Get All Products List', async () => {
    await automationExerciseApi.verifyAllProductsList();
  });

  // Verifies unsupported POST for products list.
  test('API 2: POST To All Products List', async () => {
    await automationExerciseApi.verifyPostToProductsListIsNotSupported();
  });

  // Verifies that brands list is returned.
  test('API 3: Get All Brands List', async () => {
    await automationExerciseApi.verifyAllBrandsList();
  });

  // Verifies unsupported PUT for brands list.
  test('API 4: PUT To All Brands List', async () => {
    await automationExerciseApi.verifyPutToBrandsListIsNotSupported();
  });

  // Searches products by API.
  test('API 5: POST To Search Product', async () => {
    await automationExerciseApi.verifySearchProduct();
  });

  // Verifies search requires product parameter.
  test('API 6: POST To Search Product without search_product parameter', async () => {
    await automationExerciseApi.verifySearchProductRequiresParameter();
  });

  // Verifies login with valid API user.
  test('API 7: POST To Verify Login with valid details', async () => {
    await automationExerciseApi.verifyLoginWithValidDetails();
  });

  // Verifies login requires email parameter.
  test('API 8: POST To Verify Login without email parameter', async () => {
    await automationExerciseApi.verifyLoginRequiresEmail();
  });

  // Verifies unsupported DELETE for verify login.
  test('API 9: DELETE To Verify Login', async () => {
    await automationExerciseApi.verifyDeleteToLoginIsNotSupported();
  });

  // Verifies invalid login returns not found.
  test('API 10: POST To Verify Login with invalid details', async () => {
    await automationExerciseApi.verifyLoginWithInvalidDetails();
  });

  // Creates a user account by API.
  test('API 11: POST To Create/Register User Account', async () => {
    await automationExerciseApi.verifyCreateUserAccount();
  });

  // Deletes a user account by API.
  test('API 12: DELETE METHOD To Delete User Account', async () => {
    await automationExerciseApi.verifyDeleteUserAccount();
  });

  // Updates a user account by API.
  test('API 13: PUT METHOD To Update User Account', async () => {
    await automationExerciseApi.verifyUpdateUserAccount();
  });

  // Gets user details by email.
  test('API 14: GET user account detail by email', async () => {
    await automationExerciseApi.verifyUserDetailsByEmail();
  });
});
