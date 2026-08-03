import { createUniqueEmail } from './users.ts';

export interface ProductReference {
  id: number;
  name: string;
}

export interface CartProduct extends ProductReference {
  price: string;
  quantity: string;
  totalPrice: string;
}

export interface ProductReview {
  name: string;
  email: string;
  review: string;
}

export const productSearchData = {
  productName: 'Dress',
};

export function createReviewData(): ProductReview {
  return {
    name: 'Luke Skywalker',
    email: createUniqueEmail('review'),
    review: 'Great product for automation practice.',
  };
}

export const cartProductData = {
  firstProduct: {
    id: 1,
    name: 'Blue Top',
    price: 'Rs. 500',
    quantity: '1',
    totalPrice: 'Rs. 500',
  },
  secondProduct: {
    id: 2,
    name: 'Men Tshirt',
    price: 'Rs. 400',
    quantity: '1',
    totalPrice: 'Rs. 400',
  },
} satisfies Record<'firstProduct' | 'secondProduct', CartProduct>;

export const brandData = {
  firstBrand: 'Polo',
  secondBrand: 'H&M',
};
