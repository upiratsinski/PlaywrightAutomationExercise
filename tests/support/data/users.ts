import { randomUUID } from 'node:crypto';
import { env } from '../config/env.ts';

export interface UserCredentials {
  email: string;
  password: string;
}

export interface LoginCredentials extends UserCredentials {
  username: string;
}

export interface UserAddress {
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  mobileNumber: string;
}

export interface TestUser extends UserCredentials, UserAddress {
  name: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
}

export interface ApiUser {
  name: string;
  email: string;
  password: string;
  title: 'Mr' | 'Mrs';
  birth_date: string;
  birth_month: string;
  birth_year: string;
  firstname: string;
  lastname: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  zipcode: string;
  state: string;
  city: string;
  mobile_number: string;
}

export function createUniqueEmail(prefix = 'test-user'): string {
  return `${prefix}-${randomUUID()}@example.com`;
}

export function createTestUser(prefix = 'test-user'): TestUser {
  return {
    name: 'Automation Test User',
    email: createUniqueEmail(prefix),
    password: env.registrationPassword,
    firstName: 'Automation',
    lastName: 'User',
    company: 'Automation Exercise',
    address1: '123 Test Street',
    address2: 'Suite 456',
    country: 'Israel',
    state: 'Israel',
    city: 'Jerusalem',
    zipCode: '12345',
    mobileNumber: '+1234567890',
    birthDay: '1',
    birthMonth: 'January',
    birthYear: '2001',
  };
}

export function createApiUser(prefix = 'api-user'): ApiUser {
  return {
    name: 'Api Test User',
    email: createUniqueEmail(prefix),
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
}

export function toApiUser(user: TestUser): ApiUser {
  return {
    name: user.name,
    email: user.email,
    password: user.password,
    title: 'Mr',
    birth_date: user.birthDay,
    birth_month: user.birthMonth,
    birth_year: user.birthYear,
    firstname: user.firstName,
    lastname: user.lastName,
    company: user.company,
    address1: user.address1,
    address2: user.address2,
    country: user.country,
    zipcode: user.zipCode,
    state: user.state,
    city: user.city,
    mobile_number: user.mobileNumber,
  };
}

export function createSubscriptionEmail(prefix = 'subscription'): string {
  return createUniqueEmail(prefix);
}
