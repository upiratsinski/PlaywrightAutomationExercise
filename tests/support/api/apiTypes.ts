export interface CommonApiResponse {
  responseCode: number;
}

export interface ApiMessageResponse extends CommonApiResponse {
  message: string;
}

export interface ProductCategory {
  usertype: {
    usertype: string;
  };
  category: string;
}

export interface Product {
  id: number;
  name: string;
  price: string;
  brand: string;
  category: ProductCategory;
}

export interface Brand {
  id: number;
  brand: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  title: string;
  birth_day: string;
  birth_month: string;
  birth_year: string;
  first_name: string;
  last_name: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobile_number: string;
}

export interface ProductsResponse extends CommonApiResponse {
  products: Product[];
}

export interface BrandsResponse extends CommonApiResponse {
  brands: Brand[];
}

export interface UserDetailsResponse extends CommonApiResponse {
  user: User;
}

export interface ApiResult<TBody> {
  httpStatus: number;
  body: TBody;
}
