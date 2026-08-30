import { apiSearchData } from '../support/data/api.ts';
import { expect, test } from '../support/fixtures/apiTest.ts';

test.describe('Catalog API', () => {
  test('API 1: Get All Products List', { tag: '@smoke' }, async ({ apiClient }) => {
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

  test('API 2: POST To All Products List', async ({ apiClient }) => {
    const response = await apiClient.postProducts();

    expect(response.httpStatus).toBe(200);
    expect(response.body.responseCode).toBe(405);
    expect(response.body.message).toBe('This request method is not supported.');
  });

  test('API 3: Get All Brands List', { tag: '@smoke' }, async ({ apiClient }) => {
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

  test('API 4: PUT To All Brands List', async ({ apiClient }) => {
    const response = await apiClient.putBrands();

    expect(response.httpStatus).toBe(200);
    expect(response.body.responseCode).toBe(405);
    expect(response.body.message).toBe('This request method is not supported.');
  });

  test('API 5: POST To Search Product', { tag: '@smoke' }, async ({ apiClient }) => {
    const response = await apiClient.searchProducts(apiSearchData.productName);

    expect(response.httpStatus).toBe(200);
    expect(response.body.responseCode).toBe(200);
    expect(response.body.products.length).toBeGreaterThan(0);

    const searchTerm = apiSearchData.productName.toLowerCase();
    for (const product of response.body.products) {
      const searchableValues = [
        product.name,
        product.brand,
        product.category.category,
        product.category.usertype.usertype,
      ];

      expect(
        searchableValues.some((value) => value.toLowerCase().includes(searchTerm)),
        `Product ${product.id} should match the search term in its catalog metadata`,
      ).toBe(true);
    }
  });

  test('API 6: POST To Search Product without search_product parameter', async ({ apiClient }) => {
    const response = await apiClient.searchProducts();

    expect(response.httpStatus).toBe(200);
    expect(response.body.responseCode).toBe(400);
    expect(response.body.message).toBe('Bad request, search_product parameter is missing in POST request.');
  });
});
