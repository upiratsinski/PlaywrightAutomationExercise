import { env } from '../config/env.ts';

const uniqueId = Date.now();

export const apiUser = {
  name: 'Api Test User',
  email: `api-user-${uniqueId}@example.com`,
  password: env.apiUserPassword,
  title: 'Mr',
  birth_date: '1',
  birth_month: 'January',
  birth_year: '2001',
  firstname: 'Api',
  lastname: 'User',
  company: 'Automation Exercise',
  address1: '123 Api Street',
  address2: 'Suite 456',
  country: 'Israel',
  zipcode: '12345',
  state: 'Israel',
  city: 'Jerusalem',
  mobile_number: '+1234567890',
};

export const apiSearchData = {
  productName: 'top',
};

export const invalidApiLoginData = {
  email: env.invalidApiLoginEmail,
  password: env.invalidApiLoginPassword,
};
