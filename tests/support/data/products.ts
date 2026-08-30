import { createUniqueEmail } from './users.ts';

export interface ProductReference {
  id: number;
  name: string;
}

export interface ProductDetails extends ProductReference {
  price: string;
  category: string;
  availability: string;
  condition: string;
  brand: string;
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
  productName: 'Sleeveless',
};

export function createReviewData(): ProductReview {
  return {
    name: 'Luke Skywalker',
    email: createUniqueEmail('review'),
    review: 'Great product for automation practice.',
  };
}

export const firstProductDetails = {
  id: 1,
  name: 'Blue Top',
  price: 'Rs. 500',
  category: 'Women > Tops',
  availability: 'In Stock',
  condition: 'New',
  brand: 'Polo',
} satisfies ProductDetails;

export const cartProductData = {
  firstProduct: {
    id: firstProductDetails.id,
    name: firstProductDetails.name,
    price: firstProductDetails.price,
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
