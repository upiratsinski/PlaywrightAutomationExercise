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

  test('API 1: Get All Products List', async () => {
    await automationExerciseApi.shouldReturnAllProductsList();
  });

  test('API 2: POST To All Products List', async () => {
    await automationExerciseApi.shouldRejectPostToProductsList();
  });

  test('API 3: Get All Brands List', async () => {
    await automationExerciseApi.shouldReturnAllBrandsList();
  });

  test('API 4: PUT To All Brands List', async () => {
    await automationExerciseApi.shouldRejectPutToBrandsList();
  });

  test('API 5: POST To Search Product', async () => {
    await automationExerciseApi.shouldReturnSearchResults();
  });

  test('API 6: POST To Search Product without search_product parameter', async () => {
    await automationExerciseApi.shouldRequireSearchProductParameter();
  });

  test('API 7: POST To Verify Login with valid details', async () => {
    await automationExerciseApi.shouldVerifyLoginWithValidDetails();
  });

  test('API 8: POST To Verify Login without email parameter', async () => {
    await automationExerciseApi.shouldRequireEmailForLogin();
  });

  test('API 9: DELETE To Verify Login', async () => {
    await automationExerciseApi.shouldRejectDeleteToVerifyLogin();
  });

  test('API 10: POST To Verify Login with invalid details', async () => {
    await automationExerciseApi.shouldRejectInvalidLogin();
  });

  test('API 11: POST To Create/Register User Account', async () => {
    await automationExerciseApi.shouldCreateUserAccount();
  });

  test('API 12: DELETE METHOD To Delete User Account', async () => {
    await automationExerciseApi.shouldDeleteUserAccount();
  });

  test('API 13: PUT METHOD To Update User Account', async () => {
    await automationExerciseApi.shouldUpdateUserAccount();
  });

  test('API 14: GET user account detail by email', async () => {
    await automationExerciseApi.shouldReturnUserDetailsByEmail();
  });
});
