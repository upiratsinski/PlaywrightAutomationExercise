import { apiSearchData } from '../support/data/api.ts';
import { expect, test } from '../support/fixtures/apiTest.ts';

test.describe('Catalog API', () => {
  test('API 1: Get All Products List', { tag: ['@smoke', '@regression'] }, async ({ apiClient }) => {
    const response = await apiClient.getProducts();

    expect(response.httpStatus).toBe(200);
    expect(response.body.responseCode).toBe(200);
    expect(response.body.products.length).toBeGreaterThan(0);
    expect(response.body.products[0]).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        price: expect.any(String),
        brand: expect.any(String),
      }),
    );
  });

  test('API 2: POST To All Products List', { tag: '@regression' }, async ({ apiClient }) => {
    const response = await apiClient.postProducts();

    expect(response.httpStatus).toBe(200);
    expect(response.body.responseCode).toBe(405);
    expect(response.body.message).toBe('This request method is not supported.');
  });

  test('API 3: Get All Brands List', { tag: ['@smoke', '@regression'] }, async ({ apiClient }) => {
    const response = await apiClient.getBrands();

    expect(response.httpStatus).toBe(200);
    expect(response.body.responseCode).toBe(200);
    expect(response.body.brands.length).toBeGreaterThan(0);
    expect(response.body.brands[0]).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        brand: expect.any(String),
      }),
    );
  });

  test('API 4: PUT To All Brands List', { tag: '@regression' }, async ({ apiClient }) => {
    const response = await apiClient.putBrands();

    expect(response.httpStatus).toBe(200);
    expect(response.body.responseCode).toBe(405);
    expect(response.body.message).toBe('This request method is not supported.');
  });

  test('API 5: POST To Search Product', { tag: ['@smoke', '@regression'] }, async ({ apiClient }) => {
    const response = await apiClient.searchProducts(apiSearchData.productName);

    expect(response.httpStatus).toBe(200);
    expect(response.body.responseCode).toBe(200);
    expect(response.body.products.length).toBeGreaterThan(0);
    expect(
      response.body.products.some((product) => product.name.toLowerCase().includes(apiSearchData.productName)),
    ).toBe(true);
  });

  test(
    'API 6: POST To Search Product without search_product parameter',
    { tag: '@regression' },
    async ({ apiClient }) => {
      const response = await apiClient.searchProducts();

      expect(response.httpStatus).toBe(200);
      expect(response.body.responseCode).toBe(400);
      expect(response.body.message).toBe('Bad request, search_product parameter is missing in POST request.');
    },
  );
});
