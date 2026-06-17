import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { apiSearchData, apiUser, invalidApiLoginData } from '../data/apiData.ts';
import { logAction } from '../utils/logger.ts';

type ApiBody = {
  responseCode: number;
  message?: string;
  products?: unknown[];
  brands?: unknown[];
  user?: Record<string, unknown>;
};

export class AutomationExerciseApi {
  private readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  // Test setup accepts "already exists" because failed previous runs can leave the demo user behind.
  async createReusableApiUser(): Promise<void> {
    logAction('create reusable API user');
    const body = await this.postCreateAccount(apiUser);

    expect([201, 400]).toContain(body.responseCode);
  }

  // Test cleanup accepts "not found" so teardown stays safe after partial setup failures.
  async deleteReusableApiUser(): Promise<void> {
    logAction('delete reusable API user');
    const body = await this.deleteAccount(apiUser.email, apiUser.password);

    expect([200, 404]).toContain(body.responseCode);
  }

  async shouldReturnAllProductsList(): Promise<void> {
    const response = await this.request.get('/api/productsList');
    const body = await this.parseApiResponse(response);

    expect(body.responseCode).toBe(200);
    expect(body.products).toBeDefined();
    expect(body.products?.length).toBeGreaterThan(0);
  }

  async shouldRejectPostToProductsList(): Promise<void> {
    const response = await this.request.post('/api/productsList');
    const body = await this.parseApiResponse(response);

    expect(body.responseCode).toBe(405);
    expect(body.message).toBe('This request method is not supported.');
  }

  async shouldReturnAllBrandsList(): Promise<void> {
    const response = await this.request.get('/api/brandsList');
    const body = await this.parseApiResponse(response);

    expect(body.responseCode).toBe(200);
    expect(body.brands).toBeDefined();
    expect(body.brands?.length).toBeGreaterThan(0);
  }

  async shouldRejectPutToBrandsList(): Promise<void> {
    const response = await this.request.put('/api/brandsList');
    const body = await this.parseApiResponse(response);

    expect(body.responseCode).toBe(405);
    expect(body.message).toBe('This request method is not supported.');
  }

  async shouldReturnSearchResults(): Promise<void> {
    const response = await this.request.post('/api/searchProduct', {
      form: {
        search_product: apiSearchData.productName,
      },
    });
    const body = await this.parseApiResponse(response);

    expect(body.responseCode).toBe(200);
    expect(body.products).toBeDefined();
    expect(body.products?.length).toBeGreaterThan(0);
  }

  async shouldRequireSearchProductParameter(): Promise<void> {
    const response = await this.request.post('/api/searchProduct');
    const body = await this.parseApiResponse(response);

    expect(body.responseCode).toBe(400);
    expect(body.message).toBe('Bad request, search_product parameter is missing in POST request.');
  }

  async shouldVerifyLoginWithValidDetails(): Promise<void> {
    const response = await this.request.post('/api/verifyLogin', {
      form: {
        email: apiUser.email,
        password: apiUser.password,
      },
    });
    const body = await this.parseApiResponse(response);

    expect(body.responseCode).toBe(200);
    expect(body.message).toBe('User exists!');
  }

  async shouldRequireEmailForLogin(): Promise<void> {
    const response = await this.request.post('/api/verifyLogin', {
      form: {
        password: apiUser.password,
      },
    });
    const body = await this.parseApiResponse(response);

    expect(body.responseCode).toBe(400);
    expect(body.message).toBe('Bad request, email or password parameter is missing in POST request.');
  }

  async shouldRejectDeleteToVerifyLogin(): Promise<void> {
    const response = await this.request.delete('/api/verifyLogin');
    const body = await this.parseApiResponse(response);

    expect(body.responseCode).toBe(405);
    expect(body.message).toBe('This request method is not supported.');
  }

  async shouldRejectInvalidLogin(): Promise<void> {
    const response = await this.request.post('/api/verifyLogin', {
      form: invalidApiLoginData,
    });
    const body = await this.parseApiResponse(response);

    expect(body.responseCode).toBe(404);
    expect(body.message).toBe('User not found!');
  }

  async shouldCreateUserAccount(): Promise<void> {
    const user = {
      ...apiUser,
      email: `api-create-${Date.now()}@example.com`,
    };
    const body = await this.postCreateAccount(user);

    expect(body.responseCode).toBe(201);
    expect(body.message).toBe('User created!');

    await this.deleteAccount(user.email, user.password);
  }

  async shouldDeleteUserAccount(): Promise<void> {
    const user = {
      ...apiUser,
      email: `api-delete-${Date.now()}@example.com`,
    };

    await this.postCreateAccount(user);
    const body = await this.deleteAccount(user.email, user.password);

    expect(body.responseCode).toBe(200);
    expect(body.message).toBe('Account deleted!');
  }

  async shouldUpdateUserAccount(): Promise<void> {
    const updatedUser = {
      ...apiUser,
      firstname: 'Updated',
      lastname: 'Api User',
      city: 'Tel Aviv',
    };
    const response = await this.request.put('/api/updateAccount', {
      form: updatedUser,
    });
    const body = await this.parseApiResponse(response);

    expect(body.responseCode).toBe(200);
    expect(body.message).toBe('User updated!');

    const userDetails = await this.getUserDetails(apiUser.email);

    expect(userDetails.responseCode).toBe(200);
    expect(userDetails.user).toMatchObject({
      email: updatedUser.email,
      first_name: updatedUser.firstname,
      last_name: updatedUser.lastname,
      city: updatedUser.city,
    });
  }

  async shouldReturnUserDetailsByEmail(): Promise<void> {
    const body = await this.getUserDetails(apiUser.email);

    expect(body.responseCode).toBe(200);
    expect(body.user).toBeDefined();
    expect(body.user?.email).toBe(apiUser.email);
  }

  private async postCreateAccount(user: typeof apiUser): Promise<ApiBody> {
    const response = await this.request.post('/api/createAccount', { form: user });

    return this.parseApiResponse(response);
  }

  private async deleteAccount(email: string, password: string): Promise<ApiBody> {
    const response = await this.request.delete('/api/deleteAccount', {
      form: {
        email,
        password,
      },
    });

    return this.parseApiResponse(response);
  }

  private async getUserDetails(email: string): Promise<ApiBody> {
    const response = await this.request.get('/api/getUserDetailByEmail', {
      params: {
        email,
      },
    });

    return this.parseApiResponse(response);
  }

  private async parseApiResponse(response: APIResponse): Promise<ApiBody> {
    expect(response.status()).toBe(200);
    return JSON.parse(await response.text()) as ApiBody;
  }
}
