import { test } from '@playwright/test';
import { AutomationExerciseApi } from '../support/api/automationExerciseApi.ts';

test.describe('Automation Exercise API tests', () => {
  let automationExerciseApi: AutomationExerciseApi;

  test.beforeAll(async ({ request }) => {
    await new AutomationExerciseApi(request).createReusableApiUser();
  });

  test.afterAll(async ({ request }) => {
    await new AutomationExerciseApi(request).deleteReusableApiUser();
  });

  test.beforeEach(async ({ request }) => {
    automationExerciseApi = new AutomationExerciseApi(request);
  });

  // Checks that the products endpoint returns catalog items.
  test('@smoke @regression API 1: Get All Products List', async () => {
    await automationExerciseApi.shouldReturnAllProductsList();
  });

  // Checks that products list rejects an unsupported POST request.
  test('@regression API 2: POST To All Products List', async () => {
    await automationExerciseApi.shouldRejectPostToProductsList();
  });

  // Checks that the brands endpoint returns brand items.
  test('@smoke @regression API 3: Get All Brands List', async () => {
    await automationExerciseApi.shouldReturnAllBrandsList();
  });

  // Checks that brands list rejects an unsupported PUT request.
  test('@regression API 4: PUT To All Brands List', async () => {
    await automationExerciseApi.shouldRejectPutToBrandsList();
  });

  // Checks that product search returns matching API results.
  test('@smoke @regression API 5: POST To Search Product', async () => {
    await automationExerciseApi.shouldReturnSearchResults();
  });

  // Checks that product search requires the search parameter.
  test('@regression API 6: POST To Search Product without search_product parameter', async () => {
    await automationExerciseApi.shouldRequireSearchProductParameter();
  });

  // Checks that verifyLogin accepts a valid API user.
  test('@smoke @regression API 7: POST To Verify Login with valid details', async () => {
    await automationExerciseApi.shouldVerifyLoginWithValidDetails();
  });

  // Checks that verifyLogin requires an email.
  test('@regression API 8: POST To Verify Login without email parameter', async () => {
    await automationExerciseApi.shouldRequireEmailForLogin();
  });

  // Checks that verifyLogin rejects DELETE requests.
  test('@regression API 9: DELETE To Verify Login', async () => {
    await automationExerciseApi.shouldRejectDeleteToVerifyLogin();
  });

  // Checks that verifyLogin rejects invalid credentials.
  test('@regression API 10: POST To Verify Login with invalid details', async () => {
    await automationExerciseApi.shouldRejectInvalidLogin();
  });

  // Checks that a user account can be created by API.
  test('@regression API 11: POST To Create/Register User Account', async () => {
    await automationExerciseApi.shouldCreateUserAccount();
  });

  // Checks that a user account can be deleted by API.
  test('@regression API 12: DELETE METHOD To Delete User Account', async () => {
    await automationExerciseApi.shouldDeleteUserAccount();
  });

  // Checks that a user account can be updated by API.
  test('@regression API 13: PUT METHOD To Update User Account', async () => {
    await automationExerciseApi.shouldUpdateUserAccount();
  });

  // Checks that user details can be retrieved by email.
  test('@regression API 14: GET user account detail by email', async () => {
    await automationExerciseApi.shouldReturnUserDetailsByEmail();
  });
});
