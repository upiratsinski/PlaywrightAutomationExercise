import { env } from '../config/env.ts';

const uniqueId = Date.now();

export const validLoginData = {
  username: env.loginUsername,
  email: env.loginEmail,
  password: env.loginPassword,
};

export const loginUserProfileData = {
  firstName: 'Luke',
  lastName: 'Skywalker',
  company: 'Rebellion Inc.',
  address1: '123 Test St',
  address2: 'Apt 4B',
  country: 'Israel',
  state: 'Israel',
  city: 'Jerusalem',
  zipCode: '12345',
  mobileNumber: '+1234567890',
  birthDay: '1',
  birthMonth: 'January',
  birthYear: '2001',
};

export const invalidLoginData = {
  email: env.invalidLoginEmail,
  password: env.invalidLoginPassword,
};

export const registrationData = {
  name: 'AnakinSkywalker',
  email: `anakin-skywalker-${uniqueId}@example.com`,
  password: env.registrationPassword,
  firstName: 'Anakin',
  lastName: 'Skywalker',
  company: 'Rebellion Inc.',
  address1: '123 Test St',
  address2: 'Apt 4B',
  country: 'Israel',
  state: 'Israel',
  city: 'Jerusalem',
  zipCode: '12345',
  mobileNumber: '+1234567890',
  birthDay: '1',
  birthMonth: 'January',
  birthYear: '2001',
};

export const contactUsData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  subject: 'Inquiry about services',
  message: 'Hello, I would like to know more about your services.',
  filePath: 'tests/support/data/SampleFile.txt',
};

export const subscriptionData = {
  email: `subscription-${uniqueId}@example.com`,
};

export const productSearchData = {
  productName: 'Dress',
};

export const reviewData = {
  name: 'Luke Skywalker',
  email: 'luke.review@example.com',
  review: 'Great product for automation practice.',
};

export const orderData = {
  comment: 'Please deliver this test order carefully.',
};

export const paymentData = {
  nameOnCard: 'Luke Skywalker',
  cardNumber: env.paymentCardNumber,
  cvc: env.paymentCvc,
  expiryMonth: env.paymentExpiryMonth,
  expiryYear: env.paymentExpiryYear,
};

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
};

export const brandData = {
  firstBrand: 'Polo',
  secondBrand: 'H&M',
};
