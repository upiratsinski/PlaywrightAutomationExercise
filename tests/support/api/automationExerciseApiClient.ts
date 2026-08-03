import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { UserCredentials, ApiUser } from '../data/users.ts';
import type {
  ApiMessageResponse,
  ApiResult,
  BrandsResponse,
  ProductsResponse,
  UserDetailsResponse,
} from './apiTypes.ts';

export class AutomationExerciseApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async getProducts(): Promise<ApiResult<ProductsResponse>> {
    return this.toResult(this.request.get('/api/productsList'));
  }

  async postProducts(): Promise<ApiResult<ApiMessageResponse>> {
    return this.toResult(this.request.post('/api/productsList'));
  }

  async getBrands(): Promise<ApiResult<BrandsResponse>> {
    return this.toResult(this.request.get('/api/brandsList'));
  }

  async putBrands(): Promise<ApiResult<ApiMessageResponse>> {
    return this.toResult(this.request.put('/api/brandsList'));
  }

  async searchProducts(searchProduct: string): Promise<ApiResult<ProductsResponse>>;
  async searchProducts(): Promise<ApiResult<ApiMessageResponse>>;
  async searchProducts(searchProduct?: string): Promise<ApiResult<ProductsResponse | ApiMessageResponse>> {
    const options = searchProduct === undefined ? undefined : { form: { search_product: searchProduct } };

    return this.toResult(this.request.post('/api/searchProduct', options));
  }

  async verifyLogin(credentials: Partial<UserCredentials>): Promise<ApiResult<ApiMessageResponse>> {
    const form: Record<string, string> = {};

    if (credentials.email !== undefined) {
      form.email = credentials.email;
    }

    if (credentials.password !== undefined) {
      form.password = credentials.password;
    }

    return this.toResult(this.request.post('/api/verifyLogin', { form }));
  }

  async deleteVerifyLogin(): Promise<ApiResult<ApiMessageResponse>> {
    return this.toResult(this.request.delete('/api/verifyLogin'));
  }

  async createAccount(user: ApiUser): Promise<ApiResult<ApiMessageResponse>> {
    return this.toResult(this.request.post('/api/createAccount', { form: { ...user } }));
  }

  async deleteAccount(email: string, password: string): Promise<ApiResult<ApiMessageResponse>> {
    return this.toResult(
      this.request.delete('/api/deleteAccount', {
        form: {
          email,
          password,
        },
      }),
    );
  }

  async updateAccount(user: ApiUser): Promise<ApiResult<ApiMessageResponse>> {
    return this.toResult(this.request.put('/api/updateAccount', { form: { ...user } }));
  }

  async getUserDetails(email: string): Promise<ApiResult<UserDetailsResponse>> {
    return this.toResult(
      this.request.get('/api/getUserDetailByEmail', {
        params: {
          email,
        },
      }),
    );
  }

  private async toResult<TBody>(responsePromise: Promise<APIResponse>): Promise<ApiResult<TBody>> {
    const response = await responsePromise;

    return {
      httpStatus: response.status(),
      body: (await response.json()) as TBody,
    };
  }
}
