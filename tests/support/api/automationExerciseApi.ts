import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { apiSearchData, apiUser, invalidApiLoginData } from '../fixtures/apiData.ts';

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

  // Creates reusable API user.
  async createApiUser(): Promise<void> {
    const body = await this.postCreateAccount(apiUser);

    expect([201, 400]).toContain(body.responseCode);
  }

  // Deletes reusable API user.
  async deleteApiUser(): Promise<void> {
    const body = await this.deleteAccount(apiUser.email, apiUser.password);

    expect([200, 404]).toContain(body.responseCode);
  }

  // Verifies products list response.
  async verifyAllProductsList(): Promise<void> {
    const response = await this.request.get('/api/productsList');
    const body = await this.parseApiResponse(response);

    expect(body.responseCode).toBe(200);
    expect(body.products).toBeDefined();
    expect(body.products?.length).toBeGreaterThan(0);
  }

  // Verifies products list rejects POST.
  async verifyPostToProductsListIsNotSupported(): Promise<void> {
    const response = await this.request.post('/api/productsList');
    const body = await this.parseApiResponse(response);

    expect(body.responseCode).toBe(405);
    expect(body.message).toBe('This request method is not supported.');
  }

  // Verifies brands list response.
  async verifyAllBrandsList(): Promise<void> {
    const response = await this.request.get('/api/brandsList');
    const body = await this.parseApiResponse(response);

    expect(body.responseCode).toBe(200);
    expect(body.brands).toBeDefined();
    expect(body.brands?.length).toBeGreaterThan(0);
  }

  // Verifies brands list rejects PUT.
  async verifyPutToBrandsListIsNotSupported(): Promise<void> {
    const response = await this.request.put('/api/brandsList');
    const body = await this.parseApiResponse(response);

    expect(body.responseCode).toBe(405);
    expect(body.message).toBe('This request method is not supported.');
  }

  // Verifies product search response.
  async verifySearchProduct(): Promise<void> {
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

  // Verifies product search requires parameter.
  async verifySearchProductRequiresParameter(): Promise<void> {
    const response = await this.request.post('/api/searchProduct');
    const body = await this.parseApiResponse(response);

    expect(body.responseCode).toBe(400);
    expect(body.message).toBe('Bad request, search_product parameter is missing in POST request.');
  }

  // Verifies login with existing user.
  async verifyLoginWithValidDetails(): Promise<void> {
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

  // Verifies login rejects missing email.
  async verifyLoginRequiresEmail(): Promise<void> {
    const response = await this.request.post('/api/verifyLogin', {
      form: {
        password: apiUser.password,
      },
    });
    const body = await this.parseApiResponse(response);

    expect(body.responseCode).toBe(400);
    expect(body.message).toBe('Bad request, email or password parameter is missing in POST request.');
  }

  // Verifies verifyLogin rejects DELETE.
  async verifyDeleteToLoginIsNotSupported(): Promise<void> {
    const response = await this.request.delete('/api/verifyLogin');
    const body = await this.parseApiResponse(response);

    expect(body.responseCode).toBe(405);
    expect(body.message).toBe('This request method is not supported.');
  }

  // Verifies login with invalid user.
  async verifyLoginWithInvalidDetails(): Promise<void> {
    const response = await this.request.post('/api/verifyLogin', {
      form: invalidApiLoginData,
    });
    const body = await this.parseApiResponse(response);

    expect(body.responseCode).toBe(404);
    expect(body.message).toBe('User not found!');
  }

  // Verifies user creation by API.
  async verifyCreateUserAccount(): Promise<void> {
    const user = {
      ...apiUser,
      email: `api-create-${Date.now()}@example.com`,
    };
    const body = await this.postCreateAccount(user);

    expect(body.responseCode).toBe(201);
    expect(body.message).toBe('User created!');

    await this.deleteAccount(user.email, user.password);
  }

  // Verifies user deletion by API.
  async verifyDeleteUserAccount(): Promise<void> {
    const user = {
      ...apiUser,
      email: `api-delete-${Date.now()}@example.com`,
    };

    await this.postCreateAccount(user);
    const body = await this.deleteAccount(user.email, user.password);

    expect(body.responseCode).toBe(200);
    expect(body.message).toBe('Account deleted!');
  }

  // Verifies user update by API.
  async verifyUpdateUserAccount(): Promise<void> {
    const response = await this.request.put('/api/updateAccount', {
      form: {
        ...apiUser,
        firstname: 'Updated',
        lastname: 'Api User',
        city: 'Tel Aviv',
      },
    });
    const body = await this.parseApiResponse(response);

    expect(body.responseCode).toBe(200);
    expect(body.message).toBe('User updated!');
  }

  // Verifies user details by email.
  async verifyUserDetailsByEmail(): Promise<void> {
    const response = await this.request.get('/api/getUserDetailByEmail', {
      params: {
        email: apiUser.email,
      },
    });
    const body = await this.parseApiResponse(response);

    expect(body.responseCode).toBe(200);
    expect(body.user).toBeDefined();
    expect(body.user?.email).toBe(apiUser.email);
  }

  // Sends create account request.
  private async postCreateAccount(user: typeof apiUser): Promise<ApiBody> {
    const response = await this.request.post('/api/createAccount', { form: user });

    return this.parseApiResponse(response);
  }

  // Sends delete account request.
  private async deleteAccount(email: string, password: string): Promise<ApiBody> {
    const response = await this.request.delete('/api/deleteAccount', {
      form: {
        email,
        password,
      },
    });

    return this.parseApiResponse(response);
  }

  // Parses API response body and checks HTTP status.
  private async parseApiResponse(response: APIResponse): Promise<ApiBody> {
    expect(response.status()).toBe(200);
    return JSON.parse(await response.text()) as ApiBody;
  }
}
